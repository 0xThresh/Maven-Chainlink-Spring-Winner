# Backend

## TODO
- Change secrets, store secrets in AWS Secrets Manager, and remove them from config files 

## Scratchpad
Command to start Chainlink node - `chainlink node -config /etc/chainlink/config/config.toml -secrets /etc/chainlink/secrets/secrets.toml start`

Command to port-forward to Chainlink node: 
k port-forward pod/chainlink 6688:6688 
k port-forward pod/lens-ea-api 8080:8080

aws ecr get-login-password | docker login --username AWS --password-stdin 130922966848.dkr.ecr.us-west-2.amazonaws.com/chainlink_ecr && docker tag lens-ea:latest 130922966848.dkr.ecr.us-west-2.amazonaws.com/chainlink_ecr:latest && docker push 130922966848.dkr.ecr.us-west-2.amazonaws.com/chainlink_ecr:latest


## Next steps
1. Create ECR repo and upload lens-ea docker image using ETH Denver strategy
2. Add ECR permissions to pod execution roles to allow them to pull image 
3. Update lens-ea pod spec to use image in ECR 
4. Profit?? 