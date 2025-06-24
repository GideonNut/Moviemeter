# Moviemeter

A decentralized movie discovery platform where users can vote on movies, earn rewards, and join a vibrant community. Votes are stored on-chain and also saved to Apillon’s decentralized storage.

---

## Useful links
CELO MAINNET: https://celoscan.io/address/0x6d83eF793A7e82BFa20B57a60907F85c06fB8828

KARMAGAP: https://gap.karmahq.xyz/project/moviemeter 


---

## Features

- **Movie Voting:** Vote on your favorite films and shape the future of recommendations.
- **Earn Rewards:** Get rewarded for your movie predictions and community engagement.
- **Community:** Join a vibrant community of movie enthusiasts and critics.
- **Decentralized Storage:** Every vote is saved to Apillon’s storage bucket for transparency and analytics.

---

## Tech Stack

- **Next.js** (App Router)
- **React**
- **thirdweb** (blockchain interactions)
- **Apillon SDK** (decentralized storage)
- **Tailwind CSS** (styling)
- **Celo** (blockchain network)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
APILLON_API_KEY=your_apillon_api_key
APILLON_API_SECRET=your_apillon_api_secret
```

- Get your Apillon API key and secret from the [Apillon dashboard](https://dashboard.apillon.io/).
- Make sure your bucket UUID is set in the code (default: `4a7aeee3-f525-4404-a230-fb43cec4e253`).

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Apillon Integration

### How Votes Are Saved

- When a user votes on a movie, the vote is:
  - Sent to the blockchain via thirdweb.
  - Uploaded as a JSON file to your Apillon storage bucket using the Apillon SDK (server-side).
- Each vote file is named:  
  `votes/{address}_{movieId}_{timestamp}.json`
- The file contains:
  ```json
  {
    "movieId": 1,
    "address": "0xUserAddress",
    "voteType": true,
    "timestamp": "2024-05-01T12:34:56.789Z"
  }
  ```

### How to Verify

- Log in to your [Apillon dashboard](https://dashboard.apillon.io/).
- Go to the Storage section and select your bucket.
- Look for files in the `votes/` folder.
- Download and inspect files to see vote data.

---

## Project Structure

```
app/
  page.tsx                # Landing page
  movies/
    page.tsx              # Movie voting page
  api/
    vote/
      route.tsx           # API route for voting and Apillon upload
components/
  ...                     # UI components
lib/
  ...                     # Blockchain and utility logic
```

---

## Customization

- **Change Bucket UUID:**  
  Update the UUID in `app/api/vote/route.tsx` if you use a different Apillon bucket.
- **Add More Vote Data:**  
  Edit the `voteData` object in the same file to include more fields.
- **UI Feedback:**  
  You can display a message to users based on the `apillonUploadSuccess` field in the API response.

---

## Troubleshooting

- **Votes not appearing in Apillon:**  
  - Ensure your API key and secret are correct and have storage permissions.
  - Make sure the upload logic runs server-side (API route, not client).
  - Check server logs for errors.
- **Blockchain errors:**  
  - Ensure your wallet is connected and on the correct network (Celo).
  - Check contract address and ABI.

---

## License

MIT

---

## Credits

- [Apillon](https://apillon.io/)
- [thirdweb](https://thirdweb.com/)
- [Celo](https://celo.org/)
- [Next.js](https://nextjs.org/)

---
