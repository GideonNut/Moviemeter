import Image from "next/image"
import Link from "next/link"

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://moviemeter12.vercel.app"

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 text-center">
        <div className="flex flex-col items-center mb-20 md:mb-20">
          <Image
            src="/logo.png"
            alt="MovieMeter Logo"
            width={250}
            height={150}
            className="size-[150px] md:size-[250px]"
          />
          <h1 className="text-2xl md:text-6xl font-semibold tracking-tighter mb-6 text-zinc-100">
            Vote for Your Favorite <span className="inline-block -skew-x-6 text-rose-600">Movies</span>
          </h1>
          <p className="text-zinc-300 text-base mb-8">
            Your <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">Blockchain</code> IMDb.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Farcaster Frame</h2>
          <p className="mb-4">
            MovieMeter is now available as a Farcaster Frame! Vote on your favorite movies directly within Farcaster.
          </p>
          <div className="bg-zinc-800 p-4 rounded-lg mb-4 overflow-auto">
            <code className="text-sm text-zinc-300">
              {`<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="${baseUrl}/api/image?id=0" />
<meta property="fc:frame:button:1" content="👍 Yes" />
<meta property="fc:frame:button:2" content="👎 No" />
<meta property="fc:frame:post_url" content="${baseUrl}/api/vote?id=0" />`}
            </code>
          </div>
          <Link
            href="/api/frame"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded"
          >
            Try the Frame
          </Link>
        </div>
      </div>
    </main>
  )
}

