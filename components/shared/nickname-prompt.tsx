"use client"

import * as React from "react"
import { useActiveAccount } from "thirdweb/react"
import { cn } from "@/lib/utils"

export default function NicknamePrompt({ className }: { className?: string }) {
  const account = useActiveAccount()
  const [nickname, setNickname] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [existing, setExisting] = React.useState<{ nickname?: string; points?: number } | null>(null)

  React.useEffect(() => {
    const run = async () => {
      if (!account?.address) return
      const res = await fetch(`/api/user?address=${account.address}`)
      const data = await res.json()
      if (data?.user) setExisting(data.user)
    }
    run()
  }, [account?.address])

  if (!account?.address) return null

  const hasNickname = !!existing?.nickname

  async function saveNickname() {
    if (!nickname.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account.address, nickname }),
      })
      const data = await res.json()
      if (data.user) {
        setExisting(data.user)
        setSaved(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("w-full rounded-md border border-border bg-card p-4", className)}>
      {hasNickname ? (
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Nickname:</span>{" "}
            <span className="font-semibold">{existing?.nickname}</span>
          </div>
          <div className="text-sm text-muted-foreground">Points: {existing?.points ?? 0}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-sm">Set your nickname and earn 50 bonus points.</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={24}
            />
            <button
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
              onClick={saveNickname}
              disabled={loading || nickname.trim().length < 2}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {saved && <div className="text-xs text-green-600">Nickname saved! +50 points awarded.</div>}
        </div>
      )}
    </div>
  )
}


