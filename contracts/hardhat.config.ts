require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts:'../frontend/artifacts'
  },
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
