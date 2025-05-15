"use client";

import { useEffect, useState } from "react";
import FarcasterMiniApp from "@/components/farcaster-mini-app";
import { useMovies } from "@/lib/state/MovieContext";
import { useAccount, useConnect } from "wagmi";
import { getMovieMeterContract } from "@/lib/blockchain-service";

export default function FarcasterPage() {
  const { movies, voteForMovie, isVoting } = useMovies();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  const contract = getMovieMeterContract();

  // Reset transaction status when changing movies
  useEffect(() => {
    setTransactionStatus("idle");
  }, [currentMovieIndex]);

  const handleVote = async (movieId: number, voteType: boolean) => {
    try {
      setTransactionStatus("pending");
      await voteForMovie(movieId, voteType);
      setTransactionStatus("success");
    } catch (error) {
      console.error("Error voting:", error);
      setTransactionStatus("error");
    }
  };

  const handleNextMovie = () => {
    setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
  };

  const currentMovie = movies[currentMovieIndex] || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">MovieMeter Farcaster Mini App</h1>

      {isConnected ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            Please connect your wallet to interact with the blockchain features.
          </p>
        </div>
      )}

      {movies.length > 0 && currentMovie ? (
        <FarcasterMiniApp
          movie={currentMovie}
          onVote={handleVote}
          onNextMovie={handleNextMovie}
          isVoting={isVoting}
          transactionStatus={transactionStatus}
          walletConnected={isConnected}
        />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">
            {isConnected
              ? "Loading movies..."
              : "Connect your wallet to view movies"}
          </p>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h2 className="font-semibold text-blue-800 mb-2">About This Page</h2>
        <p className="text-blue-700">
          This page demonstrates how the Farcaster Mini App integrates with the
          Celo blockchain. When you vote on a movie, a transaction is sent to
          the MovieMeter smart contract on the Celo Alfajores testnet.
        </p>
      </div>
    </div>
  );
}
