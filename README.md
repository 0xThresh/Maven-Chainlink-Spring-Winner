# Chainlink 2023 Spring Hackathon

## Actors
1. Social media agencies - manage social accounts on behalf of end users
2. End users - someone who wants their social media accounts/ presence managed by a third party 

## Components
### Account abstraction wallets
- Delegated access - end user sends Lens profile to delegated smart account, and grants access to the agency to use the Lens profile within the smart account for logins/ posts/ etc 
- Question: can we write custom contracts/ functions for AA wallets? If so, we can do something like an onlyOwner modifier 

### Smart contracts
- Payment contract - uses Chainlink to determine price in ETH that should be paid to agency to match their USD requirements, and Chainlink adapter to check # of Lens posts to make sure agency is fulfilling their end
- Just use stablecoins instead? Would make an easier user experience 
- Hold monthly end user funds in escrow, then funds are transferred once number of posts is made/ at the end of the month
- Small initiation fee (set by the agency) is paid from end user to agency immediately to start the contract 
- We keep a small fee of whatever is in the contract 

### Frontend 
- Landing page for product description and agency/ end user logins
- Agency page can list all accounts they're managing/ view the rules they're supposed to follow on number of posts, track monthly posts for the account
- End user page allows them to initiate a contract with an agency, view the rules agency is supposed to follow on number of posts, track monthly posts, and manually terminate a contract if desired/ transfer Lens profile back to their own wallet from smart account 

### Backend
- Chainlink external adapter node
- Possibly a Chainlink oracle node if conversions are used 
- ETH nodes 


## Tech Stack 
### Account abstraction wallets
- More research required 
- Rainbow wallet

### Smart contracts
- Solidity 
- Hardhat/ Foundry 

### Frontend 
- React
- NextJS
- JavaScript
- TypeScript 
- wagmi
- ChakraUI and/or Tailwind

### Backend
- Kubernetes 
- Docker
- NodeJS
- Terraform
- AWS 
