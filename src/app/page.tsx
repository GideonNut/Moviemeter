"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ConnectButton, 
  useActiveAccount, 
  useReadContract, 
  useSendTransaction, 
  useWaitForReceipt, 
  useContractEvents 
} from "thirdweb/react";
import { getContract, defineChain, prepareEvent } from "thirdweb";
import { client } from "./client";
import thirdwebIcon from "@/public/thirdweb.svg";

const alfajores = defineChain({
  id: 44787,
  rpc: "https://alfajores-forno.celo-testnet.org",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
});

const contractAddress = "0x3eD5D4A503999C5aEB13CD71Eb1d395043368723";
const contract = getContract({ client, chain: alfajores, address: contractAddress });
const votedEvent = prepareEvent({ signature: "event Voted(uint256 movieId, address voter, bool vote)" });

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
          <ConnectButton client={client} appMetadata={{ name: "Movie Voting DApp", url: "https://example.com" }} />
        </div>
        {address && <MovieCards />}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image src={thirdwebIcon} alt="Thirdweb Logo" className="size-[150px] md:size-[150px]" />
      <h1 className="text-2xl md:text-6xl font-semibold tracking-tighter mb-6 text-zinc-100">
        Vote for Your Favorite <span className="inline-block -skew-x-6 text-blue-500">Movies</span>
      </h1>
      <p className="text-zinc-300 text-base">
        Your <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">Blockchain</code> IMDb.
      </p>
    </header>
  );
}

function MovieCards() {
  const movies = [
    { id: 0, title: "Inception", description: "A thief enters dreams to steal secrets." },
    { id: 1, title: "Interstellar", description: "A space epic exploring love and time." },
    { id: 2, title: "The Dark Knight", description: "Batman faces off against the Joker." },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center">
      {movies.map((movie) => (
        <MovieSection key={movie.id} {...movie} contract={contract} contractAddress={contractAddress} />
      ))}
    </div>
  );
}

function MovieSection({ id, title, description, contract, contractAddress }) {
  return (
    <div className="flex flex-col items-center">
      <MovieCard id={id} title={title} description={description} contract={contract} />
      <VoteButtons id={id} contract={contract} contractAddress={contractAddress} />
    </div>
  );
}

function MovieCard({ id, title, description, contract }) {
  const { data: votes, refetch, isLoading } = useReadContract<number[]>({
    contract,
    method: "getVotes",
    params: [id],
  });

  useContractEvents({
    contract,
    events: [votedEvent],
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.movieId === id) {
          refetch();
        }
      });
    },
  });

  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700 w-full text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>
      <div className="text-sm text-zinc-300 mb-4">
        {isLoading ? "Loading votes..." : `✅ Yes: ${votes?.[0] || 0} | ❌ No: ${votes?.[1] || 0}`}
      </div>
    </div>
  );
}

function VoteButtons({ id, contract, contractAddress }) {
  const { mutate: sendTransaction, data: txHash } = useSendTransaction();
  const { data: receipt, isLoading } = useWaitForReceipt({
    client,
    chain: alfajores,
    transactionHash: txHash,
  });

  const handleVote = async (voteType) => {
    try {
      await sendTransaction({
        transaction: {
          to: contractAddress,
          data: contract.encoder.encode("vote", [id, voteType]),
        },
      });
    } catch (error) {
      console.error("Voting failed:", error);
    }
  };

  useEffect(() => {
    if (receipt) {
      console.log("Transaction confirmed", receipt);
    }
  }, [receipt]);

  return (
    <div className="flex gap-3 mt-4">
      <button onClick={() => handleVote(true)} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
        {isLoading ? "Voting..." : "👍 Yes"}
      </button>
      <button onClick={() => handleVote(false)} disabled={isLoading} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
        {isLoading ? "Voting..." : "👎 No"}
      </button>
    </div>
  );
}
