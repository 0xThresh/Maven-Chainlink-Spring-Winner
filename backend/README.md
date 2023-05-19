# Backend

## TODO
- Change secrets, store secrets in AWS Secrets Manager, and remove them from config files 

## Scratchpad
Command to start Chainlink node - `chainlink node -config /etc/chainlink/config/config.toml -secrets /etc/chainlink/secrets/secrets.toml start`

Command to port-forward to Chainlink node: 
k port-forward pod/chainlink 6688:6688 -n socialmaven