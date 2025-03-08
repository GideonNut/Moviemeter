"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ConnectButton, 
  useActiveAccount, 
  useReadContract, 
  useSendTransaction, 
  useContractEvents 
} from "thirdweb/react";
import { getContract, defineChain, prepareContractCall } from "thirdweb";
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

export default function Home() {
  const account = useActiveAccount();
  const address = account?.address;
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
      <p className="text-zinc-300 text-base">Your <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">Blockchain</code> IMDb.</p>
    </header>
  );
}

function MovieCards() {
  const movies = [
    { id: 0, title: "Inception", description: "A thief enters dreams to steal secrets." },
    { id: 1, title: "Interstellar", description: "A space epic exploring love and time." },
    { id: 2, title: "The Dark Knight", description: "Batman faces off against the Joker." },
    { id: 3, title: "Avengers: Endgame", description: "The Avengers assemble for one last fight." },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} contract={contract} />
      ))}
    </div>
  );
}

function MovieCard({ id, title, description, contract }: { id: number; title: string; description: string; contract: any }) {
  const [localVotes, setLocalVotes] = useState<{ yes: number; no: number }>({ yes: 0, no: 0 });
  const { data: votes, refetch, isLoading } = useReadContract({ contract, method: "getVotes", params: [id] });
  useEffect(() => {
    if (votes) setLocalVotes({ yes: votes[0], no: votes[1] });
  }, [votes]);
  useContractEvents({
    contract,
    events: ["Voted"],
    onLogs: () => refetch(),
  });
  return (
    <div className="border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 w-full text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 mb-4">{description}</p>
      <div className="text-sm text-zinc-300 mb-4">
        {isLoading ? "Loading votes..." : `✅ Yes: ${localVotes.yes} | ❌ No: ${localVotes.no}`}
      </div>
      <VoteButtons id={id} contract={contract} updateLocalVotes={setLocalVotes} />
    </div>
  );
}

function VoteButtons({ id, contract, updateLocalVotes }: { id: number; contract: any; updateLocalVotes: (votes: { yes: number; no: number }) => void }) {
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const handleVote = async (voteType: boolean) => {
    try {
      updateLocalVotes((prev) => ({ yes: voteType ? prev.yes + 1 : prev.yes, no: !voteType ? prev.no + 1 : prev.no }));
      const transaction = prepareContractCall({ contract, method: "function vote(uint256, bool)", params: [id, voteType] });
      sendTransaction(transaction, {
        onSuccess: () => console.log("Transaction successful"),
        onError: () => updateLocalVotes((prev) => ({ yes: voteType ? prev.yes - 1 : prev.yes, no: !voteType ? prev.no - 1 : prev.no })),
      });
    } catch (error) {
      console.error("Voting failed:", error);
    }
  };
  return (
    <div className="flex gap-3 mt-4">
      <button onClick={() => handleVote(true)} disabled={isPending} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        {isPending ? "Voting..." : "👍 Yes"}
      </button>
      <button onClick={() => handleVote(false)} disabled={isPending} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
        {isPending ? "Voting..." : "👎 No"}
      </button>
    </div>
  );
}
