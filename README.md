# MovieMeter - A Web3 Movie Voting DApp
MovieMeter is a decentralized movie voting application built on the Celo blockchain. Users can vote for their favorite movies, and the results are recorded on-chain and shown at the Must-Watch part of the site.

## Check us out
[moviemeter.io](https://moviemeter13.vercel.app/)

## Features
- Vote on your favorite movies using blockchain technology.
- Transparent and immutable vote records.
- Seamless Web3 authentication with Thirdweb.
- Deployed on the Celo Alfajores testnet.

## Smart Contract Details
- **Network**: Celo Alfajores Testnet
- **Contract Address**: `0x3eD5D4A503999C5aEB13CD71Eb1d395043368723`
- **Contract link**: https://alfajores.celoscan.io/address/0x3eD5D4A503999C5aEB13CD71Eb1d395043368723

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Blockchain**: Celo, Thirdweb SDK
- **Authentication**: Thirdweb Connect
- **Storage**: IPFS / Decentralized Storage (Future Integration)

## Installation & Setup

### Prerequisites
- Node.js (>=18.x)
- Yarn or npm
- Metamask (or any Celo-compatible wallet)

### Clone the Repository
```sh
git clone https://github.com/your-username/moviemeter.git
cd moviemeter
```

### Install Dependencies
```sh
yarn install  # or npm install
```

### Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_CELO_RPC=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3eD5D4A503999C5aEB13CD71Eb1d395043368723
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
```

### Run the Development Server
```sh
yarn dev  # or npm run dev
```
The app will be available at `http://localhost:3000`

## Usage
1. Connect your Celo wallet.
2. Search for a movie and vote on your favorite.
3. Votes are recorded on the Celo blockchain.

## Deployment
To deploy the frontend:
```sh
yarn build && yarn start  # or npm run build && npm start
```
You can also deploy it on Vercel or Netlify for easy hosting.

## Future Enhancements
- **On-Chain Reputation System**: Reward users with Soulbound Tokens (SBTs).
- **User Profiles**: Store user activity and votes.
- **Leaderboard**: Display trending movies based on votes.

## Contributing
Pull requests are welcome! Please open an issue first to discuss changes.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, reach out via [Twitter](https://twitter.com/gideondern_) or [Email](mailto:ngideon538@yahoo.com).

