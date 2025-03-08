// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract MovieVoting {
    struct Movie {
        uint256 id;
        string title;
        uint256 yesVotes;
        uint256 noVotes;
    }

    mapping(uint256 => Movie) public movies;
    uint256 public movieCount;

    event Voted(uint256 indexed movieId, address voter, bool vote);

    function addMovie(string memory _title) public {
        movies[movieCount] = Movie(movieCount, _title, 0, 0);
        movieCount++;
    }

    function vote(uint256 _movieId, bool _vote) public {
        require(_movieId < movieCount, "Movie does not exist");

        if (_vote) {
            movies[_movieId].yesVotes++;
        } else {
            movies[_movieId].noVotes++;
        }

        emit Voted(_movieId, msg.sender, _vote);
    }

    function getVotes(uint256 _movieId) public view returns (uint256, uint256) {
        require(_movieId < movieCount, "Movie does not exist");
        return (movies[_movieId].yesVotes, movies[_movieId].noVotes);
    }
}
