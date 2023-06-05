# Chainlink 2023 Spring Hackathon

## Process
1. Agency signs up, sets their price per post AND startup fee, and signs with the wallet they'll use to sign into smart account 
2. End User clicks a button to select an agency to manage their account, selects which Lens profile they want to be managed, sets the number of posts that is required per month, and determines how long (in months) the agreement is valid for
3. Smart account is spun up, with full Lens NFT permissions granted to End User address and limited permissions granted to Agency address. Smart contract is deployed using the following values in the constructor:
- Agency monthly fee to be paid 
- Agency startup fee to be paid
- Number of posts required per month
- Profile ID of the Lens profile that is being managed
- Social Maven team's fee address to send monthly fee to (2% to start?)
- When to terminate the contract
4. End User initiates a txn to: 1. transfer Lens NFT to smart account, and 2. pay startup fee as well as first month fee which will both live in escrow until end of the first payment period
5. Agency signs into Lens profile in smart account and posts, etc. using Lens profile in smart account until monthly obligations are met
6. At the end of the payment period, a request to the escrow contract is made from the backend that checks the post history of the Lens profile for the past month. If the number of posts >= the obligation required in the contract, the monthly payment is sent from escrow to the Agency account, and fee is paid to Social Maven team. The End User must submit another txn for the next monthly fee to be paid. (This should be abstracted away but is fine for hackathon)
7. End User and Agency both have the ability to call a function to terminate the contract, which pays out the remaining funds in escrow to the appropriate party (decision mechanism TBD) and return the Lens profile to the End User's wallet

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
- Tailwind
- Recoil

### Backend
- Kubernetes 
- Docker
- NodeJS
- Terraform
- AWS 
