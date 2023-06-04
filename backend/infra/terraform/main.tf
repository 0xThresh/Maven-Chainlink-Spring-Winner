data "aws_availability_zones" "available" {}
data "aws_caller_identity" "current" {}
data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}

locals {
  cluster_name            = "chainlink-cluster"
  cluster_version = "1.25"
  namespace = "default"
  region          = "us-west-2"

  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  tags = {
    app    = "maven"
  }

  secrets = [
    "pk",
    "mumbai-rpc-url",
    "lens-api",
    "lens-hub-contract",
    "lens-periphery-contract",
    "api-login-username",
    "api-login-password",
    "quicknode-wss-url",
    "quicknode-http-url",
    "postgres-username",
    "postgres-password"
  ]

  cluster_secretstore_name = "cluster-secretstore-sm"
  cluster_secretstore_sa   = "cluster-secretstore-sa"
  secretstore_name         = "secretstore-ps"
  secretstore_sa           = "secretstore-sa"
}

# Secrets
resource "aws_secretsmanager_secret" "secrets" {
  lifecycle {
    prevent_destroy = true
  }

  for_each = toset(local.secrets)
  name = each.value
  kms_key_id              = aws_kms_key.secrets.arn
}

resource "aws_secretsmanager_secret_version" "secret" {
  lifecycle {
    ignore_changes = [secret_string]
  }
  for_each = aws_secretsmanager_secret.secrets
  secret_id = each.value.id
  secret_string = jsonencode({
    value = ""
  })
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "my-vpc"
  cidr = "10.2.0.0/16"

  azs             = ["us-west-2a", "us-west-2b"]
  private_subnets = ["10.2.1.0/24", "10.2.2.0/24"]
  public_subnets  = ["10.2.101.0/24", "10.2.102.0/24"]
  intra_subnets   = ["10.2.50.0/24", "10.2.51.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "prod"
  }

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                      = 1
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"             = 1
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.5.1"

  cluster_name    = local.cluster_name
  cluster_version = "1.25"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true


  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"

  }

  eks_managed_node_groups = {
    # one = {
    #   name = "node-group-1"

    #   instance_types = ["t3a.small"]

    #   min_size     = 1
    #   max_size     = 1
    #   desired_size = 1
    # }

    two = {
      name = "node-group-2"

      instance_types = ["t3a.small"]

      min_size     = 1
      max_size     = 1
      desired_size = 1
    }
  }
}
    

# https://aws.amazon.com/blogs/containers/amazon-ebs-csi-driver-is-now-generally-available-in-amazon-eks-add-ons/ 
data "aws_iam_policy" "ebs_csi_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

module "irsa-ebs-csi" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version = "4.7.0"

  create_role                   = true
  role_name                     = "AmazonEKSTFEBSCSIRole-${module.eks.cluster_name}"
  provider_url                  = module.eks.oidc_provider
  role_policy_arns              = [data.aws_iam_policy.ebs_csi_policy.arn]
  oidc_fully_qualified_subjects = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
}

resource "aws_eks_addon" "ebs-csi" {
  cluster_name             = module.eks.cluster_name
  addon_name               = "aws-ebs-csi-driver"
  #addon_version            = "v1.5.2-eksbuild.1"
  service_account_role_arn = module.irsa-ebs-csi.iam_role_arn
  tags = {
    "eks_addon" = "ebs-csi"
    "terraform" = "true"
  }
}

# IAM
resource "aws_iam_policy" "additional" {
  name = "${local.cluster_name}-additional"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:Describe*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# RDS 
resource "aws_db_instance" "chainlink" {
    # TODO: Get secrets out of config for non-hackathon use
    allocated_storage = 20
    storage_type = "gp2"
    db_name = "chainlink_db"
    engine = "postgres"
    engine_version = "15.3"
    instance_class = "db.t3.micro"
    username = "postgres"
    password = "POSTGR3S123456789!"
    skip_final_snapshot = true
    multi_az = false
    db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name
    parameter_group_name = "default.postgres15"
    tags = {
        Name = "chainlink"
    }
    vpc_security_group_ids = [aws_security_group.chainlink-db-sg.id]
}

resource "aws_db_subnet_group" "db_subnet_group" {
    name = "chainlink_subnet_group"
    subnet_ids = [
        module.vpc.private_subnets[0],
        module.vpc.private_subnets[1]
        ]
}

# SG
resource "aws_security_group" "chainlink-db-sg" {
  name        = "chainlink-db-sg"
  description = "Allow Postgres traffic to Chainlink components"
  vpc_id      = module.vpc.vpc_id

    # ingress {
    #     description      = "Chainlink operator port"
    #     from_port        = 6688
    #     to_port          = 6688
    #     protocol         = "tcp"
    #     cidr_blocks      = ["0.0.0.0/0"]
    # }

    # ingress {
    #     description      = "Chainlink external adapter"
    #     from_port        = 8080
    #     to_port          = 8080
    #     protocol         = "tcp"
    #     cidr_blocks      = ["0.0.0.0/0"]
    # }

    ingress {
        description      = "Chainlink external adapter"
        from_port        = 5432
        to_port          = 5432
        protocol         = "tcp"
        # TODO: Fix hardcode
        cidr_blocks      = ["10.2.0.0/16"]
    }

  egress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
}

# Build Docker image locally
# TODO: Put this into Codebuild to prevent any further arch issues
resource "null_resource" "build_docker_image" {
  provisioner "local-exec" {
    command = "docker buildx build --platform=linux/amd64 -t lens-ea ../../lens-api-ea"
  }
}

# Build ECR repo
resource "aws_ecr_repository" "chainlink_ecr" {
  name                 = "chainlink_ecr"
  image_tag_mutability = "MUTABLE"

  encryption_configuration {
    encryption_type = "AES256"
  }

  force_delete = false

  lifecycle {
    prevent_destroy = true
  }
}

# Push Docker image to ECR repository using local_exec provisioner
resource "null_resource" "push_to_ecr" {
  triggers = {
    ecr_repository_url = "${aws_ecr_repository.chainlink_ecr.repository_url}"
  }

  provisioner "local-exec" {
    command = "aws ecr get-login-password | docker login --username AWS --password-stdin ${aws_ecr_repository.chainlink_ecr.repository_url} && docker tag lens-ea:latest ${aws_ecr_repository.chainlink_ecr.repository_url}:latest && docker push ${aws_ecr_repository.chainlink_ecr.repository_url}:latest"
  }
}

# Pod manifests
data "kubectl_file_documents" "docs" {
    content = file("../kubernetes/chainlink.yml")
}

resource "kubectl_manifest" "chainlink_resources" {
    depends_on = [
        null_resource.push_to_ecr
    ]
    for_each  = data.kubectl_file_documents.docs.manifests
    yaml_body = each.value
}

resource "kubectl_manifest" "chainlink_node_pod" {
  depends_on = [ 
    kubectl_manifest.rds_secret
   ]
  yaml_body = <<YAML
apiVersion: v1
kind: Pod
metadata:
  name: chainlink-node
  namespace: ${local.namespace}
  labels:
    app: chainlink-node
spec:
  containers:
  - name: chainlink
    image: smartcontract/chainlink:2.0.0
    imagePullPolicy: IfNotPresent
    priorityClassName: high-priority
    ports:
    - containerPort: 6688
      name: chainlink
    command: ["chainlink", "node"]
    args: ["-config", "/etc/chainlink/config/config.toml", "-secrets", "/etc/chainlink/secrets/secrets.toml", "start", "-api", "/etc/chainlink/api"]
    volumeMounts:
    - name: config
      mountPath: /etc/chainlink
    - name: config-toml
      mountPath: /etc/chainlink/config
    - name: secrets-toml
      mountPath: /etc/chainlink/secrets
  tolerations:
  - key: ""
    operator: "Exists"
  volumes:
  - name: config
    secret:
      secretName: chainlink-configmap
      items:
      - key: API_LOGIN
        path: api
  - name: config-toml
    configMap:
      name: chainlink-config-toml
      items:
      - key: config.toml
        path: config.toml
  - name: secrets-toml
    secret:
      secretName: chainlink-secrets-toml
      items:
      - key: secrets.toml
        path: secrets.toml

YAML
}

resource "kubectl_manifest" "lens_ea_pod" {
  yaml_body = <<YAML
apiVersion: v1
kind: Pod
metadata:
  name: lens-api-ea
  namespace: ${local.namespace}
  labels:
    app: lens-api-ea
spec:
  containers:
  - name: lens-api-ea
    image: ${aws_ecr_repository.chainlink_ecr.repository_url}:latest
    imagePullPolicy: IfNotPresent
    env:
    - name: PK
      valueFrom:
        secretKeyRef: 
          name: pk
          key: value
    - name: LENS_API
      valueFrom:
        secretKeyRef: 
          name: lens-api
          key: value
    - name: LENS_HUB_CONTRACT
      valueFrom:
        secretKeyRef: 
          name: lens-hub-contract
          key: value
    - name: LENS_PERIPHERY_CONTRACT
      valueFrom:
        secretKeyRef: 
          name: lens-periphery-contract
          key: value
    - name: MUMBAI_RPC_URL
      valueFrom:
        secretKeyRef: 
          name: mumbai-rpc-url
          key: value
    ports:
    - containerPort: 8080
      name: lens-api-ea
    command: ["yarn", "start"]
YAML
}

# TODO: Replace secrets in next three manifests with SM secrets
  resource "kubectl_manifest" "rds_secret" {
    yaml_body = <<YAML
apiVersion: v1
kind: Secret
metadata:
  name: chainlink-secrets-toml
  namespace: ${local.namespace}
type: Opaque
stringData:
  secrets.toml: |
    [Password]
    Keystore = 'POSTGR3S123456789!'
    [Database]
    URL = 'postgresql://${aws_db_instance.chainlink.username}:POSTGR3S123456789!@${aws_db_instance.chainlink.endpoint}/${aws_db_instance.chainlink.db_name}'
YAML
  }

  resource "kubectl_manifest" "evm_secret" {
    yaml_body = <<YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: chainlink-config-toml
  namespace: ${local.namespace}
data:
  config.toml: |
    [Log]
    Level = 'warn'

    [WebServer]
    AllowOrigins = '*'
    SecureCookies = false

    [WebServer.TLS]
    HTTPSPort = 0

    [[EVM]]
    ChainID = '80001'

    [[EVM.Nodes]]
    Name = 'Mumbai'
    WSURL = 'wss'
    HTTPURL = 'http'
YAML
  }


  resource "kubectl_manifest" "api_secret" {
    yaml_body = <<YAML
apiVersion: v1
kind: Secret
metadata:
  name: chainlink-configmap
  #namespace: socialmaven
type: Opaque
stringData:
  API_LOGIN: |
    x@y.z
    POSTGR3S123456789!
YAML
  }

# resource "kubectl_manifest" "geth_node_pod" {
#   manifest = file("../kubernetes/geth.yml") 
# }


# Kubernetes Addons

module "eks_blueprints_kubernetes_addons" {
  source = "./modules/kubernetes-addons"

  eks_cluster_id       = module.eks.cluster_name
  eks_cluster_endpoint = module.eks.cluster_endpoint
  eks_oidc_provider    = module.eks.oidc_provider
  eks_cluster_version  = module.eks.cluster_version

  enable_external_secrets = true
  enable_amazon_eks_coredns = true

  tags = local.tags
}

#---------------------------------------------------------------
# External Secrets Operator - Secret
#---------------------------------------------------------------

resource "aws_kms_key" "secrets" {
  enable_key_rotation = true
}

module "cluster_secretstore_role" {
  source                      = "./modules/irsa"
  kubernetes_namespace        = local.namespace
  create_kubernetes_namespace = false
  kubernetes_service_account  = local.cluster_secretstore_sa
  irsa_iam_policies           = [aws_iam_policy.cluster_secretstore.arn]
  eks_cluster_id              = module.eks.cluster_name
  eks_oidc_provider_arn       = module.eks.oidc_provider_arn

  depends_on = [module.eks_blueprints_kubernetes_addons]
}

resource "aws_iam_policy" "cluster_secretstore" {
  name_prefix = local.cluster_secretstore_sa
  policy      = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetResourcePolicy",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecretVersionIds"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "${aws_kms_key.secrets.arn}"
    }
  ]
}
POLICY
}

resource "kubectl_manifest" "cluster_secretstore" {
  yaml_body  = <<YAML
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: ${local.cluster_secretstore_name}
spec:
  provider:
    aws:
      service: SecretsManager
      region: ${local.region}
      auth:
        jwt:
          serviceAccountRef:
            name: ${local.cluster_secretstore_sa}
            namespace: ${local.namespace}
YAML
  depends_on = [module.eks_blueprints_kubernetes_addons]
}

resource "kubectl_manifest" "secret" {
  for_each = aws_secretsmanager_secret.secrets
  yaml_body  = <<YAML
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: ${each.key}
  namespace: ${local.namespace}
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: ${local.cluster_secretstore_name}
    kind: ClusterSecretStore
  dataFrom:
  - extract:
      key: ${each.value.name}
YAML
  depends_on = [kubectl_manifest.cluster_secretstore]
}
