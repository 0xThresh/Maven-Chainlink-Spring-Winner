require("@nomiclabs/hardhat-ethers");

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  paths: {
    artifacts:'../frontend/artifacts'
  }
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
