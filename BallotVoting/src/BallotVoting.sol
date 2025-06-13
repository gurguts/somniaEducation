// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BallotVoting {
    struct Ballot {
        string name;
        string[] options;
        mapping(uint256 => uint256) votes;
        mapping(address => bool) hasVoted;
        bool active;
        uint256 totalVotes;
    }

    uint256 public ballotCount;
    mapping(uint256 => Ballot) public ballots;

    event BallotCreated(uint256 indexed ballotId, string name, string[] options);
    event VoteCast(uint256 indexed ballotId, address indexed voter, uint256 optionIndex);
    event BallotClosed(uint256 indexed ballotId);

    function createBallot(string memory name, string[] memory options) public{
        require(options.length>1, "Ballot must have at least two options");

        ballotCount++;
        Ballot storage ballot = ballots[ballotCount];
        ballot.name =name;
        ballot.options=options;
        ballot.active = true;

        emit BallotCreated(ballotCount, name, options);
    }

    function vote(uint256 ballotId, uint256 optionIndex) public {
        Ballot storage ballot = ballots[ballotId];
        require(ballot.active, "This ballot is closed");
        require(!ballot.hasVoted[msg.sender], "You have already voted");
        require(optionIndex < ballot.options.length, "Invalid option index");
        ballot.votes[optionIndex]++;
        ballot.hasVoted[msg.sender] = true;
        ballot.totalVotes++;
        emit VoteCast(ballotId, msg.sender, optionIndex);
    }

    function closeBallot(uint256 ballotId) public {
        Ballot storage ballot = ballots[ballotId];
        require(ballot.active, "Ballot is already closed");
        ballot.active = false;

        emit BallotClosed(ballotId);
    }

    function getBallotDetails(uint256 ballotId)
    public
    view
    returns (
        string memory name,
        string[] memory options,
        bool active,
        uint256 totalVotes
    )
    {
        Ballot storage ballot = ballots[ballotId];
        return (ballot.name, ballot.options, ballot.active, ballot.totalVotes);
    }

    function getBallotResults(uint256 ballotId) public view returns (uint256[] memory results) {
        Ballot storage ballot = ballots[ballotId];
        uint256[] memory voteCounts = new uint256[](ballot.options.length);
        for (uint256 i = 0; i < ballot.options.length; i++) {
            voteCounts[i] = ballot.votes[i];
        }

        return voteCounts;
    }
}
