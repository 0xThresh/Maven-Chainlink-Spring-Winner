require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
    const LINK_TOKEN_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    const ORACLE_ADDRESS = "0xabEE66bB661F34c9C3766FF5bC3BABa83b120208";
    const JOB_ID = "c89cd0852cf04f6b8e5bbd5da5841214";
    const LENS_PROFILE_ID = "0x8be0";
    const FUNDING_AMOUNT = ethers.utils.parseEther("5"); // 5 LINK

    // We get the contract to deploy
    const Maven = await ethers.getContractFactory("Maven");
    const maven = await Maven.deploy(LINK_TOKEN_ADDRESS);

    await maven.deployed();

    console.log("Maven deployed to:", maven.address);

    // Get Link Token contract
    const linkToken = await ethers.getContractAt("@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol:LinkTokenInterface", LINK_TOKEN_ADDRESS);

    // Transfer 5 LINK to contract, wait for it to complete
    let fundTx = await linkToken.transfer(maven.address, FUNDING_AMOUNT);
    await fundTx.wait(); 

    console.log("Maven contract funded with 5 LINK. Transaction hash: ", fundTx.hash);

    // Call checkProfilePosts function
    await maven.checkProfilePosts(ORACLE_ADDRESS, JOB_ID, LENS_PROFILE_ID);

    console.log("checkProfilePosts function called successfully");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
