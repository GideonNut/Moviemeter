"use client"

import { useState, useEffect } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { ConnectWallet } from "@/components/ConnectWallet"

export default function FarcasterSDKTester() {
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">("loading")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [clientInfo, setClientInfo] = useState<any>(null)
  const [locationInfo, setLocationInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<
    {
      action: string
      status: "pending" | "success" | "error"
      message?: string
    }[]
  >([])

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check if SDK is available
        if (!sdk) {
          setSdkStatus("error")
          return
        }

        // Get user info
        if (sdk.context.user) {
          setUserInfo(sdk.context.user)
        }

        // Get client info
        if (sdk.context.client) {
          setClientInfo(sdk.context.client)
        }

        // Get location info
        if (sdk.context.location) {
          setLocationInfo(sdk.context.location)
        }

        // Tell the client we're ready
        await sdk.actions.ready()
        setSdkStatus("ready")
      } catch (error) {
        console.error("Error initializing SDK:", error)
        setSdkStatus("error")
      }
    }

    initSDK()
  }, [])

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    setTestResults((prev) => [...prev, { action: testName, status: "pending" }])

    try {
      await testFn()
      setTestResults((prev) =>
        prev.map((test) => (test.action === testName ? { ...test, status: "success", message: "Test passed" } : test)),
      )
    } catch (error) {
      console.error(`Error in ${testName}:`, error)
      setTestResults((prev) =>
        prev.map((test) =>
          test.action === testName
            ? {
                ...test,
                status: "error",
                message: `Error: ${(error as Error).message}`,
              }
            : test,
        ),
      )
    }
  }

  const testToast = async () => {
    await runTest("Show Toast", async () => {
      await sdk.actions.close({
        toast: {
          message: "Test toast message",
        },
      })
    })
  }

  const testOpenUrl = async () => {
    await runTest("Open URL", async () => {
      await sdk.actions.openUrl("https://warpcast.com")
    })
  }

  const testAddFrame = async () => {
    await runTest("Add Frame", async () => {
      const result = await sdk.actions.addFrame()
      if (!result.added) {
        throw new Error("Frame was not added")
      }
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Farcaster SDK Tester</h1>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">SDK Status</h2>
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                sdkStatus === "ready" ? "bg-green-500" : sdkStatus === "loading" ? "bg-yellow-500" : "bg-red-500"
              }`}
            ></div>
            <span>
              {sdkStatus === "ready" ? "SDK Ready" : sdkStatus === "loading" ? "SDK Loading..." : "SDK Error"}
            </span>
          </div>
        </div>

        {userInfo && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">User Info</h2>
            <pre className="bg-zinc-800 p-3 rounded overflow-auto text-sm">{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
        )}

        {clientInfo && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Client Info</h2>
            <pre className="bg-zinc-800 p-3 rounded overflow-auto text-sm">{JSON.stringify(clientInfo, null, 2)}</pre>
          </div>
        )}

        {locationInfo && (
          <div className="bg-zinc-900 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Location Info</h2>
            <pre className="bg-zinc-800 p-3 rounded overflow-auto text-sm">{JSON.stringify(locationInfo, null, 2)}</pre>
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Test SDK Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testToast}
              disabled={sdkStatus !== "ready"}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              Test Toast
            </button>
            <button
              onClick={testOpenUrl}
              disabled={sdkStatus !== "ready"}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              Test Open URL
            </button>
            <button
              onClick={testAddFrame}
              disabled={sdkStatus !== "ready"}
              className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              Test Add Frame
            </button>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="bg-zinc-900 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    test.status === "pending"
                      ? "bg-yellow-900/20 border border-yellow-900"
                      : test.status === "success"
                        ? "bg-green-900/20 border border-green-900"
                        : "bg-red-900/20 border border-red-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{test.action}</span>
                    <span
                      className={`text-sm ${
                        test.status === "pending"
                          ? "text-yellow-400"
                          : test.status === "success"
                            ? "text-green-400"
                            : "text-red-400"
                      }`}
                    >
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                  {test.message && <p className="text-sm mt-1 text-zinc-400">{test.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <ConnectWallet />
      </div>
    </div>
  )
}
