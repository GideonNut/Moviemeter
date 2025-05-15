import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", ".well-known", "farcaster.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const manifest = JSON.parse(fileContents)

    return NextResponse.json(manifest, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error serving Farcaster manifest:", error)
    return NextResponse.json({ error: "Failed to serve manifest" }, { status: 500 })
  }
}
