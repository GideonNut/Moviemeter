import { Storage } from '@apillon/sdk';

const storage = new Storage({
  key: process.env.APILLON_API_KEY!,
  secret: process.env.APILLON_API_SECRET!,
});
const bucket = storage.bucket('4a7aeee3-f525-4404-a230-fb43cec4e253'); // Replace with your bucket UUID

export interface ApillonVote {
  movieId: string;
  address: string;
  voteType: boolean;
  timestamp: string;
}

export interface ApillonVoteSummary {
  yes: number;
  no: number;
  voters: string[];
  votes: ApillonVote[];
}

export async function getVotesFromApillon(movieId: string): Promise<ApillonVoteSummary> {
  // List all files in the votes/ folder
  const files = await bucket.listFiles('votes/');
  let yes = 0, no = 0, voters: string[] = [];
  const votes: ApillonVote[] = [];
  for (const file of files.items) {
    const { content } = await bucket.getFile(file.uuid);
    const vote = JSON.parse(content.toString()) as ApillonVote;
    if (vote.movieId === movieId) {
      if (vote.voteType) yes++;
      else no++;
      voters.push(vote.address);
      votes.push(vote);
    }
  }
  return { yes, no, voters, votes };
}

export async function hasUserVotedApillon(movieId: string, address: string): Promise<boolean> {
  const { voters } = await getVotesFromApillon(movieId);
  return voters.includes(address);
} 