// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Funding {
    string public name;
    string public description;
    uint256 public goalAmount;
    uint256 public deadline;
    address public owner;

    struct Tier {
        string name;
        uint256 amount;
        uint256 backers;
    }

    struct Backer {
        uint256 totalDonations;
        mapping(uint256 => bool) fundedTiers;
    }

    Tier[] public tiers;
    mapping(address => Backer) public backers;

    enum CampaignState {
        Active,
        Fail,
        Success
    }
    CampaignState public state;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier CampaignOpen() {
        require(state == CampaignState.Active, "");
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationInDays
    ) {
        name = _name;
        description = _description;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
        owner = msg.sender;
    }

    function checkAndUpdateState() internal {
        if (state == CampaignState.Active) {
            if (block.timestamp >= deadline) {
                state = address(this).balance >= goalAmount
                    ? CampaignState.Success
                    : CampaignState.Fail;
            } else {
                state = address(this).balance >= goalAmount
                    ? CampaignState.Success
                    : CampaignState.Active;
            }
        }
    }

    function donate(uint256 _tierIndex) public payable CampaignOpen {
        require(
            msg.value == tiers[_tierIndex].amount && msg.value > 0,
            "Invalid inout"
        );
        tiers[_tierIndex].backers++;

        backers[msg.sender].totalDonations += msg.value;
        backers[msg.sender].fundedTiers[_tierIndex] = true;

        checkAndUpdateState();
    }

    function refund() public {
        checkAndUpdateState();
        require(state == CampaignState.Fail, "Camping isn't fail");
        uint256 amount = backers[msg.sender].totalDonations;
        require(amount > 0, " you have nothing");

        backers[msg.sender].totalDonations = 0;
        payable(msg.sender).transfer(amount);
    }

    function hadDonation(
        address _backer,
        uint256 _tierIndex
    ) public view returns (bool) {
        return backers[_backer].fundedTiers[_tierIndex];
    }

    function withdraw() public onlyOwner {
        checkAndUpdateState();
        require(state == CampaignState.Success, "we fail");
        require(block.timestamp < deadline, "Deadline ended");
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner).transfer(balance);
    }

    function getCurrentBlance() public view returns (uint256) {
        return address(this).balance;
    }

    function addTier(
        string memory _name,
        uint256 _amount,
        uint256 _backers
    ) public onlyOwner {
        tiers.push(Tier(_name, _amount, _backers));
    }

    function removeTier(uint256 _index) public onlyOwner {
        require(_index < tiers.length, "index should be less that arr length");
        tiers[_index] = tiers[tiers.length - 1];
        tiers.pop();
    }
}
