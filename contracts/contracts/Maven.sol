// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Maven is ChainlinkClient, ConfirmedOwner {
     
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    uint256 public lastRetrievedInfo;
    mapping(address => string) public agencyAddress;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        uint256 indexed response
    );

    // Mumbai LINK: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB 
    constructor(address _linkTokenAddress) ConfirmedOwner(msg.sender) {
       setChainlinkToken(_linkTokenAddress);
    //    fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    struct Deal {
        uint256 dealId;
        address client;
        address contractingAgency;
        uint256 dealAmount;
        uint256 requiredNumberOfPosts;
        bool startDeal;
        bool isDealCancelled;
        bool isDealDone;
        string lensProfileId;
        uint256 numberOfAgencyPosts;
        uint256 postsBeforeContract;
    }

    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;

    function checkProfilePosts(
        address _oracle,
        string memory _jobId,
        string memory _lensProfileId
    ) public onlyOwner {
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );

        req.add("profileId", _lensProfileId);
        req.add("operation", "get-profile");
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    function checkAgency(address _agencyAddress) public view returns(string memory) {
        require(bytes(agencyAddress[_agencyAddress]).length != 0, "Agency does not exist");
        return agencyAddress[_agencyAddress];
    }

    function startDeal(address _agency, uint256 _amount, uint256 _requiredNumberOfPosts, string memory _lensProfileId) external payable {
        require(msg.value >= _amount, "Insufficient payment");

        dealCounter++;
        Deal storage newDeal = deals[dealCounter];
        newDeal.dealId = dealCounter;
        newDeal.client = msg.sender;
        newDeal.contractingAgency = _agency;
        newDeal.dealAmount = _amount;
        newDeal.requiredNumberOfPosts = _requiredNumberOfPosts;
        newDeal.startDeal = true;
        newDeal.lensProfileId = _lensProfileId;
        newDeal.postsBeforeContract = lastRetrievedInfo;
    }

    function checkAgencyProgress(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(deal.startDeal, "Deal does not exist or not started");

        uint256 postsDifference = lastRetrievedInfo - deal.postsBeforeContract;

        deal.numberOfAgencyPosts = postsDifference - deal.requiredNumberOfPosts;
}

    function revokeDeal(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(deal.startDeal, "Deal does not exist or not started");
        require(!deal.isDealCancelled, "Deal is already cancelled");

        deal.isDealCancelled = true;
        address payable clientWallet = payable(address(deal.client));
        sendPaymentToClient(clientWallet, deal.dealAmount);
    }

    function sendPaymentToAgency(uint256 _dealId, uint256 _amount) internal {
        Deal storage deal = deals[_dealId];

        require(deal.startDeal, "Deal does not exist or not started");
        require((lastRetrievedInfo - deal.postsBeforeContract) >= deal.requiredNumberOfPosts, "Required number of posts not reached");
        require(address(this).balance >= _amount, "Insufficient balance");

        payable(deal.contractingAgency).transfer(_amount);
    }

    function sendPaymentToClient(address payable _client, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient balance");
        _client.transfer(_amount);
    }

    function fulfillRequestInfo(bytes32 _requestId, uint256 _info) 
        public 
        recordChainlinkFulfillment(_requestId)
        {
            emit RequestForInfoFulfilled(_requestId, _info);
            lastRetrievedInfo = _info;
        }

    function contractBalances()
        public
        view
        returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
