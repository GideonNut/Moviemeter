"use client"

import { useState } from "react"
import { movies } from "@/lib/movie-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DebugEmbedsPage() {
  const [selectedMovieId, setSelectedMovieId] = useState("0")
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter13.vercel.app")

  const movie = movies.find((m) => m.id === selectedMovieId) || movies[0]

  const frameEmbed = {
    version: "next",
    imageUrl: `${baseUrl}/api/image?id=${selectedMovieId}`,
    button: {
      title: "Vote on this Movie",
      action: {
        type: "launch_frame",
        url: `${baseUrl}/mini/movie/${selectedMovieId}`,
        name: "MovieMeter",
        splashImageUrl: `${baseUrl}/mm-logo-new.png`,
        splashBackgroundColor: "#18181b",
      },
    },
  }

  const embedUrl = `${baseUrl}/api/embed/${selectedMovieId}`
  const shareUrl = `${baseUrl}/share?id=${selectedMovieId}`

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Farcaster Embed Debugger</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Configure Embed</CardTitle>
            <CardDescription>Select a movie and customize your embed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="movie">Select Movie</Label>
              <Select value={selectedMovieId} onValueChange={setSelectedMovieId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://moviemeter13.vercel.app"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your embed will appear</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full aspect-[3/2] mb-4 rounded-md overflow-hidden">
              <img
                src={`${baseUrl}/api/image?id=${selectedMovieId}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold">{movie.title}</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">{movie.description}</p>
            <Button className="mt-4 w-full">Vote on this Movie</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="json">
        <TabsList className="mb-4">
          <TabsTrigger value="json">Frame JSON</TabsTrigger>
          <TabsTrigger value="urls">Embed URLs</TabsTrigger>
          <TabsTrigger value="html">HTML Meta Tag</TabsTrigger>
        </TabsList>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Frame Embed JSON</CardTitle>
              <CardDescription>Copy this JSON to use in your meta tags</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-zinc-900 p-4 rounded-md overflow-x-auto">{JSON.stringify(frameEmbed, null, 2)}</pre>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(frameEmbed))}>Copy JSON</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="urls">
          <Card>
            <CardHeader>
              <CardTitle>Embed URLs</CardTitle>
              <CardDescription>URLs you can share on Farcaster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Embed URL</Label>
                <div className="flex mt-2">
                  <Input value={embedUrl} readOnly />
                  <Button className="ml-2" onClick={() => navigator.clipboard.writeText(embedUrl)}>
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <Label>Share Page URL</Label>
                <div className="flex mt-2">
                  <Input value={shareUrl} readOnly />
                  <Button className="ml-2" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.open(embedUrl, "_blank")}>Test API Embed</Button>
              <Button className="ml-2" onClick={() => window.open(shareUrl, "_blank")}>
                Test Share Page
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle>HTML Meta Tag</CardTitle>
              <CardDescription>Add this to your HTML head</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-zinc-900 p-4 rounded-md overflow-x-auto">
                {`<meta name="fc:frame" content='${JSON.stringify(frameEmbed)}' />`}
              </pre>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(`<meta name="fc:frame" content='${JSON.stringify(frameEmbed)}' />`)
                }
              >
                Copy HTML
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
