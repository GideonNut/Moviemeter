import { NextResponse } from "next/server"

export async function GET() {
  // Create an SVG logo with "MovieMeter" text
  const svg = `
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text { 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          font-weight: bold;
          font-size: 24px;
          fill: white;
        }
        .film-reel {
          fill: #ad264a;
        }
        @media (prefers-color-scheme: light) {
          .text { fill: black; }
        }
      </style>
      <rect width="200" height="60" rx="8" fill="#18181b" />
      <circle cx="30" cy="30" r="15" class="film-reel" />
      <circle cx="30" cy="30" r="5" fill="#18181b" />
      <text x="55" y="38" class="text">MovieMeter</text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
