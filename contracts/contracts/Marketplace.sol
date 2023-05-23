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
        uint256 postsBeforeContract;`
    }

    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;

    // constructor(address _linkTokenAddress, address _oracleAddress) {
    //    setChainlinkToken(_linkTokenAddress);
    //    setChainlinkOracle(_oracleAddress);
    // }

    function startDeal(address _agency, uint256 _amount) external payable {
        require(msg.value >= _amount, "Insufficient payment");

        dealCounter++;
        Deal storage newDeal = deals[dealCounter];
        newDeal.dealId = dealCounter;
        newDeal.client = msg.sender;
        newDeal.contractingAgency = _agency;
        newDeal.dealAmount = _amount;
        newDeal.startDeal = true;
    }

    function revokeDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(deal.startDeal, "Deal does not exist or not started");
        require(!deal.isDealCancelled, "Deal is already cancelled");

        deal.isDealCancelled = true;
        sendPaymentToClient(deal.client, deal.dealAmount);
    }

    function sendPaymentToAgency(address _agency, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient balance");
        payable(_agency).transfer(_amount);
    }

    function sendPaymentToClient(address payable _client, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient balance");
        _client.transfer(_amount);
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
