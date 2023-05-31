data "aws_availability_zones" "available" {}

locals {
  name            = "ex-${replace(basename(path.cwd), "_", "-")}"
  cluster_version = "1.25"
  region          = "us-west-2"

  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  tags = {
    app    = "cf"
  }
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
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"

  cluster_name                   = local.name
  cluster_version                = local.cluster_version
  cluster_endpoint_public_access = true

  cluster_addons = {
    kube-proxy = {}
    vpc-cni    = {}
    coredns = {
      configuration_values = jsonencode({
        computeType = "Fargate"
      })
    }
  }

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.intra_subnets

  # Fargate profiles use the cluster primary security group so these are not utilized
  create_cluster_security_group = false
  create_node_security_group    = false

  fargate_profile_defaults = {
    iam_role_additional_policies = {
      additional = aws_iam_policy.additional.arn
    }
  }

  fargate_profiles = merge(
    {
      example = {
        name = "example"
        selectors = [
          {
            namespace = "backend"
            labels = {
              Application = "backend"
            }
          }
        ]

        # Using specific subnets instead of the subnets supplied for the cluster itself
        subnet_ids = [module.vpc.private_subnets[1]]

        tags = {
          Owner = "secondary"
        }

        timeouts = {
          create = "20m"
          delete = "20m"
        }
      }
    },
    { for i in range(3) :
      "kube-system-${element(split("-", local.azs[i]), 2)}" => {
        selectors = [
          { namespace = "kube-system" }
        ]
        # We want to create a profile per AZ for high availability
        subnet_ids = [element(module.vpc.private_subnets, i)]
      }
    }
  )

  tags = local.tags
}

# Pod manifests
data "kubectl_file_documents" "docs" {
    content = file("../kubernetes/chainlink.yml")
}

resource "kubectl_manifest" "chainlink_resources" {
    for_each  = data.kubectl_file_documents.docs.manifests
    yaml_body = each.value
}

# resource "kubectl_manifest" "chainlink_ea_pod" {
#   yaml_body = file("../kubernetes/chainlink-ea.yml") 
# }

# resource "kubectl_manifest" "geth_node_pod" {
#   manifest = file("../kubernetes/geth.yml") 
# }


# SG
# resource "aws_security_group" "chainlink-sg" {
#   name        = "chainlink-sg"
#   description = "Allow HTTP traffic to Chainlink components"
#   vpc_id      = module.vpc.vpc_id

#     ingress {
#         description      = "Chainlink operator port"
#         from_port        = 6688
#         to_port          = 6688
#         protocol         = "tcp"
#         cidr_blocks      = ["0.0.0.0/0"]
#     }

#     ingress {
#         description      = "Chainlink external adapter"
#         from_port        = 8080
#         to_port          = 8080
#         protocol         = "tcp"
#         cidr_blocks      = ["0.0.0.0/0"]
#     }

#   egress {
#         from_port        = 0
#         to_port          = 0
#         protocol         = "-1"
#         cidr_blocks      = ["0.0.0.0/0"]
#         ipv6_cidr_blocks = ["::/0"]
#     }
# }

# IAM
resource "aws_iam_policy" "additional" {
  name = "${local.name}-additional"

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
