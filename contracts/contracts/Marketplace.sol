// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Marketplace {
    struct Deal {
        uint256 dealId;
        address client;
        address contractingAgency;
        uint256 dealAmount;
        uint256 contractDuration;
        bool startDeal;
        bool isDealCancelled;
        bool isDealDone;
        string lensProfileId;
        uint256 numberOfAgencyPosts;
        uint256 postsBeforeContract;
    }

    function startDeal(address _agency, uint256 _amount) external payable {

    }

    function revokeDeal(uint256 _dealId) external {

    }

    function sendPaymentToAgency(address _agency, uint256 _amount) internal {

    }

    function checkAgencyReputation(address _agency) external {

    }
    
    function checkProfilePosts(string memory _lensProfileId) {
    // Description of how to write Chainlink function in Solidity 
    // https://docs.chain.link/chainlink-nodes/external-adapters/contract-creators
    // Chainlink.Request memory req = buildChainlinkRequest(SPEC_ID, this, this.fulfill.selector);
    // req.add("endpoint", "totalPosts");
    }

}
