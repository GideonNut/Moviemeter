"use client";

/**
 * Movie Context
 *
 * This context provides state management for movie data and voting functionality.
 * It separates the state management logic from UI components.
 */

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAccount, useConnect, useSendTransaction } from "wagmi";
import {
  getMovieMeterContract,
  prepareVoteTransaction,
} from "@/lib/blockchain-service";

// Define movie data interface
export interface Movie {
  id: number;
  title: string;
  description: string;
  voteCountYes: number;
  voteCountNo: number;
  hasVoted: boolean;
}

// Define context interface
interface MovieContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  voteForMovie: (movieId: number, voteType: boolean) => Promise<void>;
  isVoting: boolean;
  error: string | null;
}

// Create context with default values
const MovieContext = createContext<MovieContextType>({
  movies: [],
  filteredMovies: [],
  searchQuery: "",
  setSearchQuery: () => {},
  voteForMovie: async () => {},
  isVoting: false,
  error: null,
});

// Custom hook to use the movie context
export const useMovies = () => useContext(MovieContext);

// Sample movie data - in a real app, this would come from an API or database
const initialMovies: Omit<
  Movie,
  "voteCountYes" | "voteCountNo" | "hasVoted"
>[] = [
  {
    id: 0,
    title: "Inception",
    description: "A thief enters dreams to steal secrets.",
  },
  {
    id: 1,
    title: "Interstellar",
    description: "A space epic exploring love and time.",
  },
  {
    id: 2,
    title: "The Dark Knight",
    description: "Batman faces off against the Joker.",
  },
  {
    id: 3,
    title: "Avengers: Endgame",
    description: "The Avengers assemble for one last fight.",
  },
  {
    id: 4,
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
  },
  {
    id: 5,
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the creation of the atomic bomb.",
  },
];

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const contract = getMovieMeterContract();

  const { data: hash, sendTransaction } = useSendTransaction();

  // Load movie data with vote counts
  useEffect(() => {
    const loadMovieData = async () => {
      if (!address) return;

      try {
        // Map initial movies to include vote data
        const moviesWithVotes = await Promise.all(
          initialMovies.map(async (movie) => {
            try {
              const voteData = await contract.read("getVotes", [movie.id]);
              return {
                ...movie,
                voteCountYes: voteData ? Number(voteData.yes) : 0,
                voteCountNo: voteData ? Number(voteData.no) : 0,
                hasVoted: voteData ? voteData.voters.includes(address) : false,
              };
            } catch (err) {
              console.error(`Error loading votes for movie ${movie.id}:`, err);
              return {
                ...movie,
                voteCountYes: 0,
                voteCountNo: 0,
                hasVoted: false,
              };
            }
          })
        );

        setMovies(moviesWithVotes);
      } catch (err) {
        console.error("Error loading movie data:", err);
        setError("Failed to load movie data. Please try again later.");
      }
    };

    if (address) {
      loadMovieData();
    }
  }, [address, contract]);

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the voteForMovie function to properly handle transaction status and refresh data
  const voteForMovie = async (movieId: number, voteType: boolean) => {
    if (!address) {
      setError("Please connect your wallet to vote");
      return;
    }

    try {
      setIsVoting(true);
      setError(null);

      // Optimistically update UI
      setMovies((prevMovies) =>
        prevMovies.map((movie) => {
          if (movie.id === movieId) {
            return {
              ...movie,
              voteCountYes: voteType
                ? movie.voteCountYes + 1
                : movie.voteCountYes,
              voteCountNo: voteType ? movie.voteCountNo : movie.voteCountNo + 1,
              hasVoted: true,
            };
          }
          return movie;
        })
      );

      // Prepare and send transaction
      const transaction = prepareVoteTransaction(movieId, voteType);

      sendTransaction(transaction, {
        onSuccess: async (result) => {
          console.log(
            `Successfully voted ${
              voteType ? "yes" : "no"
            } for movie ${movieId}`,
            result
          );

          // Wait for transaction to be mined
          try {
            // Refresh the vote data from the blockchain after a short delay
            // to allow the transaction to be processed
            setTimeout(async () => {
              try {
                const voteData = await contract.read("getVotes", [movieId]);

                // Update the movie with the latest vote data from the blockchain
                setMovies((prevMovies) =>
                  prevMovies.map((movie) => {
                    if (movie.id === movieId) {
                      return {
                        ...movie,
                        voteCountYes: voteData
                          ? Number(voteData.yes)
                          : movie.voteCountYes,
                        voteCountNo: voteData
                          ? Number(voteData.no)
                          : movie.voteCountNo,
                        hasVoted: voteData
                          ? voteData.voters.includes(address)
                          : movie.hasVoted,
                      };
                    }
                    return movie;
                  })
                );
              } catch (refreshError) {
                console.error("Error refreshing vote data:", refreshError);
              }
            }, 3000); // Wait 3 seconds for the transaction to be processed
          } catch (waitError) {
            console.error("Error waiting for transaction:", waitError);
          }
        },
        onError: (error) => {
          console.error("Voting failed:", error);
          // Revert optimistic update
          setMovies((prevMovies) =>
            prevMovies.map((movie) => {
              if (movie.id === movieId) {
                return {
                  ...movie,
                  voteCountYes: voteType
                    ? movie.voteCountYes - 1
                    : movie.voteCountYes,
                  voteCountNo: voteType
                    ? movie.voteCountNo
                    : movie.voteCountNo - 1,
                  hasVoted: false,
                };
              }
              return movie;
            })
          );
          setError("Failed to submit vote. Please try again.");
        },
      });
    } catch (err) {
      console.error("Error voting:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const value = {
    movies,
    filteredMovies,
    searchQuery,
    setSearchQuery,
    voteForMovie,
    isVoting,
    error,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
