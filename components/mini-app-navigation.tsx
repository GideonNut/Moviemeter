"use client"

import { Home, User, Film } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function MiniAppNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navigate = (url: string) => {
    try {
      // Use internal navigation instead of external URLs
      if (url === "/mini") {
        router.push("/mini")
      } else if (url === "/mini/discover") {
        router.push("/mini/discover")
      } else if (url === "/mini/profile") {
        router.push("/mini/profile")
      } else {
        // Fallback to internal navigation
        router.push(url)
      }
    } catch (err) {
      console.error("Navigation error:", err)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2">
      <div className="flex justify-around items-center">
        <button
          className={`flex flex-col items-center p-2 ${isActive("/mini") ? "text-white" : "text-gray-400"}`}
          onClick={() => navigate("/mini")}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          className={`flex flex-col items-center p-2 ${isActive("/mini/discover") ? "text-white" : "text-gray-400"}`}
          onClick={() => navigate("/mini/discover")}
        >
          <Film className="h-6 w-6" />
          <span className="text-xs mt-1">Discover</span>
        </button>

        <button
          className={`flex flex-col items-center p-2 ${isActive("/mini/profile") ? "text-white" : "text-gray-400"}`}
          onClick={() => navigate("/mini/profile")}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  )
}
