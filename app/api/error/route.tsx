import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#18181b", // zinc-950
        color: "#e5e5e5", // neutral-200
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* MovieMeter Logo - Rendered as text with styling to match the logo */}
        <div
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#be123c", // rose-700
            fontFamily: "cursive, sans-serif",
            textAlign: "center",
          }}
        >
          MovieMeter
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#27272a", // zinc-800
            borderRadius: "12px",
            padding: "24px",
            width: "80%",
            marginTop: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Oops! Something went wrong.
          </h2>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa", // zinc-400
              marginBottom: "24px",
            }}
          >
            We encountered an error processing your vote.
          </p>
          <p
            style={{
              fontSize: "20px",
              marginTop: "24px",
            }}
          >
            Please try again.
          </p>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}

