"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/farcaster-sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import MiniAppNavigation from "@/components/mini-app-navigation"

export default function DebugPage() {
  const [sdkInfo, setSdkInfo] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Collect SDK info
      const info = {
        isConnected: !!sdk,
        context: sdk?.context ? JSON.stringify(sdk.context) : "Not available",
        user: sdk?.context?.user ? JSON.stringify(sdk.context.user) : "Not available",
        client: sdk?.context?.client ? JSON.stringify(sdk.context.client) : "Not available",
        userAgent: window.navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }

      setSdkInfo(info)
    } catch (err) {
      console.error("Error collecting debug info:", err)
      setError("Failed to collect debug information")
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Card className="w-full max-w-md mx-auto border-2 border-purple-200 shadow-md m-4">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
          <h2 className="text-xl font-bold">MovieMeter Debug</h2>
        </CardHeader>

        <CardContent className="p-4">
          {error ? (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-md mb-4">{error}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">SDK Status</h3>
                <div className="bg-zinc-800 p-3 rounded-md">
                  <p>Connected: {sdkInfo.isConnected ? "Yes" : "No"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">User Info</h3>
                <pre className="bg-zinc-800 p-3 rounded-md overflow-x-auto text-xs">
                  {sdkInfo.user || "Not available"}
                </pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">Client Info</h3>
                <pre className="bg-zinc-800 p-3 rounded-md overflow-x-auto text-xs">
                  {sdkInfo.client || "Not available"}
                </pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">Environment</h3>
                <pre className="bg-zinc-800 p-3 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(
                    {
                      userAgent: sdkInfo.userAgent,
                      url: sdkInfo.url,
                      timestamp: sdkInfo.timestamp,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              <Button onClick={() => window.location.reload()} className="w-full bg-purple-600 hover:bg-purple-700">
                Refresh Debug Info
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MiniAppNavigation />
    </div>
  )
}
