import { NextResponse } from "next/server"
import { SelfBackendVerifier, getUserIdentifier } from "@selfxyz/core"
import { connectToDatabase } from "../../../../lib/mongodb"
import mongoose from "mongoose"

// Simple schema for storing verification status
const VerificationSchema = new mongoose.Schema({
  userId: String,
  address: String,
  isVerified: Boolean,
  verifiedAt: Date,
})
const Verification = mongoose.models.Verification || mongoose.model("Verification", VerificationSchema)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      )
    }
    await connectToDatabase()
    const record = await Verification.findOne({ address })
    return NextResponse.json({ isVerified: !!(record && record.isVerified) })
  } catch (error) {
    console.error("Error checking verification status:", error)
    return NextResponse.json(
      { error: "Failed to check verification status" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { proof, publicSignals, address } = await request.json()
    if (!proof || !publicSignals || !address) {
      return NextResponse.json({ error: "Proof, publicSignals, and address are required" }, { status: 400 })
    }
    
    // Check if required environment variables are set
    if (!process.env.CELO_RPC_URL) {
      console.error("CELO_RPC_URL environment variable is not set")
      return NextResponse.json({ error: "Server configuration error: CELO_RPC_URL not set" }, { status: 500 })
    }
    
    if (!process.env.SCOPE) {
      console.error("SCOPE environment variable is not set")
      return NextResponse.json({ error: "Server configuration error: SCOPE not set" }, { status: 500 })
    }
    
    // Validate that SCOPE matches the expected domain
    if (process.env.SCOPE !== 'moviemeter.io') {
      console.error("SCOPE environment variable does not match expected domain")
      return NextResponse.json({ error: "Server configuration error: Invalid SCOPE" }, { status: 500 })
    }
    
    const selfBackendVerifier = new SelfBackendVerifier(
      process.env.CELO_RPC_URL,
      process.env.SCOPE
    )
    
    // Optionally configure verification rules here
    const result = await selfBackendVerifier.verify(proof, publicSignals)
    if (result.isValid) {
      try {
        await connectToDatabase()
        const userId = await getUserIdentifier(publicSignals)
        await Verification.findOneAndUpdate(
          { address },
          { userId, address, isVerified: true, verifiedAt: new Date() },
          { upsert: true }
        )
        return NextResponse.json({ isVerified: true })
      } catch (dbError) {
        console.error("Database error during verification:", dbError)
        return NextResponse.json({ error: "Failed to save verification status" }, { status: 500 })
      }
    } else {
      console.error("Verification failed:", result.isValidDetails)
      return NextResponse.json({ 
        isVerified: false, 
        details: result.isValidDetails,
        error: "Proof verification failed. Please try again." 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying proof:", error)
    return NextResponse.json({ error: "Failed to verify proof due to technical issues" }, { status: 500 })
  }
} 