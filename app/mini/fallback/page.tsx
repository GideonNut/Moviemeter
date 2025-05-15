"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"

export default function FallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md border-2 border-purple-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
          <h2 className="text-xl font-bold">MovieMeter</h2>
        </CardHeader>

        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Something went wrong</h3>
          <p className="text-gray-400 mb-6">
            We encountered an issue loading the MovieMeter app. This could be due to network issues or a temporary
            problem.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4 bg-zinc-900">
          <Button
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open("https://moviemeter13.vercel.app", "_blank")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Main Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
