// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract SocialMaven is ChainlinkClient, ConfirmedOwner {
     
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    string public lastRetrievedInfo;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        string indexed response
    );

    // Mumbai LINK: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB 
    constructor(address _linkTokenAddress, address _oracleAddress) ConfirmedOwner(msg.sender) {
       setChainlinkToken(_linkTokenAddress);
       setChainlinkOracle(_oracleAddress);
       jobId = ""; // TODO: Plug in Job ID when deployed to Chainlink node 
       fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

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

    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;

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


    function checkProfilePosts(
        address _oracle,
        string memory _jobId,
        string memory _lensProfileId
        // string memory _operation // TODO: Implement operation 
    ) public onlyOwner {
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );

        req.add("profileId", _lensProfileId);
        //req.add("operation", _operation);
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
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
