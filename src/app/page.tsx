"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ConnectButton, useActiveAccount, useSendTransaction, useContractEvents } from "thirdweb/react";
import { getContract, defineChain, prepareContractCall, prepareEvent } from "thirdweb";
import { client } from "./client";
import thirdwebIcon from "@public/thirdweb.svg";

// Define the Celo Alfajores Testnet Chain
const alfajores = defineChain({
  id: 44787,
  rpc: "https://alfajores-forno.celo-testnet.org",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
});

// Smart contract address
const contractAddress = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723";

// Get contract instance
const contract = getContract({
  client,
  chain: alfajores,
  address: contractAddress,
});

// Prepare the "Voted" event to listen for updates
const votedEvent = prepareEvent({
  signature: "event Voted(uint256 movieId, address voter, bool vote)",
});

export default function Home() {
  const account = useActiveAccount();
  const address = account?.address;

  const [isDisplayed, setDisplayed] = useState(false);

  useEffect(() => {
    setDisplayed(!!address);
  }, [address]);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Movie Voting DApp",
              url: "https://example.com",
            }}
          />
        </div>

        {/* Voting section */}
        {address && <MovieCards />}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt="Thirdweb Logo"
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        Vote for Your Favorite <span className="inline-block -skew-x-6 text-blue-500">Movies</span>
      </h1>
      <p className="text-zinc-300 text-base">
        Your{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          Blockchain
        </code>{" "}
        IMDb.
      </p>
    </header>
  );
}

function MovieCards() {
  const movies = [
    { id: 0, title: "Inception", description: "A thief enters dreams to steal secrets." },
    { id: 1, title: "Interstellar", description: "A space epic exploring love and time." },
    { id: 2, title: "The Dark Knight", description: "Batman faces off against the Joker." },
    { id: 3, title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
    { id: 4, title: "Parasite", description: "A dark satire on social classes." },
    { id: 5, title: "The Matrix", description: "A hacker discovers reality isn't what it seems." },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center">
      {movies.map((movie) => (
        <MovieSection key={movie.id} {...movie} contract={contract} contractAddress={contractAddress} />
      ))}
    </div>
  );
}

// Movie Section with Card and Buttons Below
function MovieSection({ id, title, description, contract, contractAddress }: { id: number; title: string; description: string; contract: any; contractAddress: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* Movie Card */}
      <MovieCard id={id} title={title} description={description} />

      {/* Voting Buttons */}
      <VoteButtons id={id} contract={contract} contractAddress={contractAddress} />
    </div>
  );
}

// Movie Card Component
function MovieCard({ id, title, description }: { id: number; title: string; description: string }) {
  return (
    <div className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700 w-full text-center">
      <article>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-zinc-400 mb-4">{description}</p>
      </article>
    </div>
  );
}

// Voting Buttons Component
function VoteButtons({ id, contract }: { id: number; contract: any }) {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handleVote = async (voteType: boolean) => {
    try {
      const transaction = prepareContractCall({
        contract,
        method: "function vote(uint256 movieId, bool vote)",
        params: [id, voteType],
      });

      sendTransaction(transaction);
    } catch (error) {
      console.error("Voting failed:", error);
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => handleVote(true)}
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        {isPending ? "Voting..." : "👍 Yes"}
      </button>
      <button
        onClick={() => handleVote(false)}
        disabled={isPending}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        {isPending ? "Voting..." : "👎 No"}
      </button>
    </div>
  );
}
