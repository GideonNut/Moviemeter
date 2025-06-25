import { NextRequest, NextResponse } from "next/server";
import { getVotesFromApillon } from "@/lib/apillon-vote-service";

export async function GET(req: NextRequest, { params }: { params: { movieId: string } }) {
  const { movieId } = params;
  try {
    const votes = await getVotesFromApillon(movieId);
    return NextResponse.json(votes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
} 