# MovieMeter 🎬

## Overview
**MovieMeter** is a decentralized movie rating and voting platform built on the **Celo blockchain**. It allows users to transparently vote **"Yes"** or **"No"** on movies they like, ensuring a fair and tamper-proof voting process.

Unlike traditional platforms, **MovieMeter** eliminates biased ratings, fake reviews, and manipulation by leveraging smart contracts. Every vote is recorded immutably, providing a transparent and verifiable movie rating system.

## Features 🚀
- **Decentralized Voting**: Users can vote on movies securely using blockchain technology.
- **Tamper-proof Ratings**: Votes are recorded on-chain, preventing manipulation.
- **Community Engagement**: Users can discuss and influence movie ratings in our Telegram community.
- **Fast and Low-Cost Transactions**: Powered by the Celo blockchain, ensuring efficiency and affordability.

## Why MovieMeter? 🤔
Traditional movie rating platforms suffer from manipulation, fake reviews, and biased scoring. With **MovieMeter**, we bring:
- **Transparency** 🏛️: Every vote is verifiable on the blockchain.
- **Decentralization** 🌍: No single entity controls the voting results.
- **Fairness** ⚖️: A democratic movie rating system.

Join our larger **Telegram community** to discuss movies and stay updated: [t.me/movies_society](https://t.me/movies_society)

## Tech Stack 🛠️
- **Blockchain**: Celo Alfajores testnest
- **Smart Contracts**: Solidity, Thirdweb
- **Frontend**: React, Next.js, Thirdweb SDK
- **Backend**: Node.js, Express
- **Wallet Integration**: Thirdweb SDK, Celo Wallet
- **Storage**: IPFS (for metadata)

## Getting Started 🚀

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/)
- [Metamask or Celo Wallet](https://valoraapp.com/)

### Installation
Clone the repository:
```bash
  git clone https://github.com/gideonnut/moviemeter.git
```
Navigate to the project folder:
```bash
  cd moviemeter
```
Install dependencies:
```bash
  yarn install
```

### Running the Project
#### 1. Start the Smart Contract
```bash
  cd smartcontract
  yarn hardhat node
```
#### 2. Deploy Contracts
```bash
  yarn hardhat deploy --network alfajores
```
#### 3. Start the Frontend
```bash
  cd frontend
  yarn dev
```
The application should now be running at `http://localhost:3000/` 🎬

## Contributing 🤝
We welcome contributions! If you'd like to contribute:
1. Fork the repository
2. Create a new branch (`feature/new-feature`)
3. Commit your changes
4. Push to your branch and create a Pull Request

## License 📜
This project is licensed under the **MIT License**.

## Connect With Us 🌍
- **Telegram**: [t.me/GideonDern](https://t.me/GideonDern)
- **Twitter**: [@MovieMeterDapp](https://twitter.com/MovieMeterDapp)
- **GitHub**: [MovieMeter Repository](https://github.com/gideonnut/moviemeter)

