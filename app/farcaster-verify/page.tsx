"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function FarcasterVerifyPage() {
  const [manifestStatus, setManifestStatus] = useState<"loading" | "success" | "error">("loading")
  const [manifestData, setManifestData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    async function checkManifest() {
      try {
        const response = await fetch("/.well-known/farcaster.json")
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setManifestData(data)
        setManifestStatus("success")
      } catch (error) {
        console.error("Error checking manifest:", error)
        setManifestStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      }
    }

    checkManifest()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Farcaster Mini App Verification</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {manifestStatus === "loading" && <AlertCircle className="text-yellow-500" />}
            {manifestStatus === "success" && <CheckCircle className="text-green-500" />}
            {manifestStatus === "error" && <XCircle className="text-red-500" />}
            Manifest Status
          </CardTitle>
          <CardDescription>Checking if your farcaster.json manifest is correctly configured</CardDescription>
        </CardHeader>
        <CardContent>
          {manifestStatus === "loading" && <p>Checking manifest...</p>}
          {manifestStatus === "error" && (
            <div className="text-red-500">
              <p className="font-bold">Error loading manifest:</p>
              <p>{errorMessage}</p>
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="font-semibold">Troubleshooting steps:</p>
                <ol className="list-decimal list-inside mt-2">
                  <li>Make sure your farcaster.json file exists in public/.well-known/</li>
                  <li>Verify that the file contains valid JSON</li>
                  <li>Check that your Next.js rewrites are correctly configured</li>
                  <li>Ensure your Vercel deployment is up to date</li>
                </ol>
              </div>
            </div>
          )}
          {manifestStatus === "success" && (
            <div>
              <p className="text-green-600 font-semibold mb-4">✅ Manifest found and loaded successfully!</p>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-sm">{JSON.stringify(manifestData, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex gap-4">
            <Button onClick={() => window.open("https://miniapps.farcaster.xyz", "_blank")}>
              Open Farcaster Developer Tools
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Check
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>After verifying your manifest, complete these steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Verify your domain on{" "}
              <a
                href="https://miniapps.farcaster.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                miniapps.farcaster.xyz
              </a>
            </li>
            <li>
              Test your mini app in Warpcast by visiting{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">https://moviemeter13.vercel.app/mini</code>
            </li>
            <li>Create a frame that links to your mini app</li>
            <li>Share your mini app with the Farcaster community</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
