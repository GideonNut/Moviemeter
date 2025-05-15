import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the farcaster.json file
    const filePath = path.join(process.cwd(), "public", ".well-known", "farcaster.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const manifest = JSON.parse(fileContents)

    // Check if accountAssociation exists and has all required fields
    const accountAssociation = manifest.accountAssociation
    const isValid =
      accountAssociation && accountAssociation.header && accountAssociation.payload && accountAssociation.signature

    // Check if the domain in the payload matches
    let payloadData = null
    let domainMatches = false

    if (accountAssociation?.payload) {
      try {
        const decodedPayload = Buffer.from(accountAssociation.payload, "base64").toString("utf-8")
        payloadData = JSON.parse(decodedPayload)
        domainMatches = payloadData.domain.toLowerCase() === "moviemeter13.vercel.app"
      } catch (e) {
        console.error("Error decoding payload:", e)
      }
    }

    return NextResponse.json({
      isValid,
      domainMatches,
      manifest,
      decodedPayload: payloadData,
      message: isValid ? "Account association is properly formatted" : "Account association is missing required fields",
      domainMessage: domainMatches
        ? "Domain in payload matches moviemeter13.vercel.app"
        : "Domain in payload does not match moviemeter13.vercel.app",
    })
  } catch (error) {
    console.error("Error verifying farcaster.json:", error)
    return NextResponse.json({ error: "Failed to verify farcaster.json" }, { status: 500 })
  }
}
