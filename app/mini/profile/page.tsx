"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/farcaster-sdk"
import { Trophy, Star, Film, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MiniAppNavigation from "@/components/mini-app-navigation"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userFid, setUserFid] = useState<number | null>(null)
  const [username, setUsername] = useState<string>("")
  const [displayName, setDisplayName] = useState<string>("")
  const [pfpUrl, setPfpUrl] = useState<string>("")

  useEffect(() => {
    // Get user info from context
    if (sdk.context?.user) {
      setUserFid(sdk.context.user.fid)
      setUsername(sdk.context.user.username || "")
      setDisplayName(sdk.context.user.displayName || "")
      setPfpUrl(sdk.context.user.pfpUrl || "")
    }
  }, [])

  const handleViewMovies = () => {
    // Use internal navigation instead of external URL
    router.push("/mini/discover")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4">
        <Card className="w-full max-w-md mx-auto border-2 border-gray-200 shadow-md m-4">
          <CardHeader className="bg-black text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Profile</h2>
              <Badge variant="outline" className="bg-white text-black">
                MovieMeter
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-white text-black">
            <div className="flex items-center mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                {pfpUrl ? (
                  <img src={pfpUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{displayName || "Farcaster User"}</h3>
                {username && <p className="text-gray-600">@{username}</p>}
                <p className="text-gray-600">FID: {userFid || "Unknown"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-md font-semibold flex items-center mb-3">
                  <Trophy className="h-5 w-5 text-black mr-2" />
                  Your Rewards
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                    <p className="text-2xl font-bold text-black">42</p>
                    <p className="text-xs text-gray-600">Total Votes</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                    <p className="text-2xl font-bold text-black">0.5 CELO</p>
                    <p className="text-xs text-gray-600">Rewards Earned</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-md font-semibold flex items-center mb-3">
                  <Star className="h-5 w-5 text-black mr-2" />
                  Your Favorites
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Film className="h-4 w-4 text-black mr-2" />
                      <span>Inception</span>
                    </div>
                    <Badge variant="outline" className="bg-white text-black border-gray-300">
                      Voted 👍
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Film className="h-4 w-4 text-black mr-2" />
                      <span>The Dark Knight</span>
                    </div>
                    <Badge variant="outline" className="bg-white text-black border-gray-300">
                      Voted 👍
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-black hover:bg-gray-900 text-white"
                onClick={handleViewMovies}
              >
                View All Movies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MiniAppNavigation />
    </div>
  )
}
