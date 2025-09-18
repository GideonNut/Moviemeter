"use client"

import * as React from "react"
import { useActiveAccount } from "thirdweb/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function NicknameModal() {
  const account = useActiveAccount()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [nickname, setNickname] = React.useState("")
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    const run = async () => {
      if (!account?.address || checked) return
      const res = await fetch(`/api/user?address=${account.address}`)
      const data = await res.json()
      if (!data?.user || !data.user.nickname) {
        setOpen(true)
      }
      setChecked(true)
    }
    run()
  }, [account?.address, checked])

  async function onSave() {
    if (!nickname.trim()) return
    setLoading(true)
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account?.address, nickname }),
      })
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  if (!account?.address) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your nickname</DialogTitle>
          <DialogDescription>
            Set a nickname and instantly earn 50 bonus points.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
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
            onClick={onSave}
            disabled={loading || nickname.trim().length < 2}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">2–24 characters. You can change it later.</p>
      </DialogContent>
    </Dialog>
  )
}


