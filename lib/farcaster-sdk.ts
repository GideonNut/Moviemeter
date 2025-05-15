import { sdk } from "@farcaster/frame-sdk"

export const initFarcasterSDK = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Check if we're in a Farcaster environment
    const isFarcaster = await sdk.isInMiniApp()

    if (isFarcaster) {
      try {
        // Initialize the SDK
        await sdk.actions.ready()
        console.log("Farcaster SDK initialized")

        // Set up event listeners
        sdk.on("frameAdded", () => {
          console.log("Frame added event received")
        })

        sdk.on("frameRemoved", () => {
          console.log("Frame removed event received")
        })

        sdk.on("notificationsEnabled", () => {
          console.log("Notifications enabled event received")
        })

        sdk.on("notificationsDisabled", () => {
          console.log("Notifications disabled event received")
        })
      } catch (error) {
        console.error("Error in SDK initialization:", error)
      }
    }

    return isFarcaster
  } catch (error) {
    console.error("Error initializing Farcaster SDK:", error)
    return false
  }
}

export { sdk }
