# Lens External Adapter
Chainlink External Adapter that can be used to query the Lens API for decisions in smart contracts. 

## Docker Setup
1. Run `cp .env.example .env` and configure the `.env` file using the required values
2. If required, install and set up Docker: https://www.docker.com/get-started/
3. Run `docker build . -t lens-ea` - this will build the required image locally, tagged as `lens-ea` 
4. Run `docker run -dit -p 8080:8080 --name lens-ea --env-file ./.env lens-ea` - this will start the container and allow it to accept requests on http://localhost:8080
- If running on ARM to build on AMD for EC2: `docker buildx build --platform=linux/amd64 -t lens-ea .`
5. Test the container is working correctly using the commands in the Request Data section below

## Manual Setup
I have some work to do to make setup easier, but in order to run this manually for now...

1. Run `npm i` in the `lens-api` folder to ensure that the `get-profile` module has all of its dependencies installed.
2. Run `yarn install` in the `external-adapter` folder.
3. Manually export all of the following values as env vars:

PK=(key of wallet with Lens profile)

MUMBAI_RPC_URL=https://polygon-mainnet.infura.io/v3/(infura key)

LENS_API=https://api.lens.dev/

LENS_HUB_CONTRACT=0x60Ae865ee4C725cd04353b5AAb364553f56ceF82

LENS_PERIPHERY_CONTRACT=0xD5037d72877808cdE7F669563e9389930AF404E8

INFURA_PROJECT_ID=https://polygon-mainnet.infura.io/v3/(infura key)

INFURA_SECRET=(infura_key)

4. Run `yarn start` in the `external-adapter` folder to start the server

## Request Data

Requests to External Adapters conform to the following structure ([docs](https://docs.chain.link/docs/developers/#requesting-data)). Not all fields are required.

You can check that your external adapter is responsive by sending it a manual `curl` request that simulates what it would receive from a Chainlink Node.

A sample curl request to the External Adapter for the Lens API will look like:
`curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 10, "data": { "profileId":"0x09", "operation": "get-profile" } }'`, which will cause the EA to get profile info about the given `profileId`. 

Another example:
`curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 10, "data": { "profileId":"0x09", "operation": "followers" } }'`, which will cause the EA to get the profile's followers. 

When interacting with a Chainlink Node, the External Adapter will receive a post request that looks something like this:

```
{
  data: { profileId: '0x09', operation: 'get-profile' },
  id: '0x93fd920063d2462d8dce013a7fc75656',
  meta: {
    oracleRequest: {
     // .... some data ....
    }
  }
}

```

## Acknowledgements
The existing resources from Chainlink and Lens Protocol made this EA possible. 


The Chainlink Fall 2022 workshop/ repo on External Adapters was the starting point for the EA: https://github.com/zeuslawyer/cl-fall22-external-adapters


Minor modifications were made to the Lens API Examples to adapt them to use in an EA: https://github.com/lens-protocol/api-examples