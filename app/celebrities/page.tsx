import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

// Sample celebrities data
const celebrities = [
  {
    id: "celeb1",
    name: "Zendaya",
    knownFor: "Dune: Part Two, Challengers",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb2",
    name: "Timothée Chalamet",
    knownFor: "Dune: Part Two, Wonka",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb3",
    name: "Florence Pugh",
    knownFor: "Dune: Part Two, Oppenheimer",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb4",
    name: "Austin Butler",
    knownFor: "Dune: Part Two, Elvis",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb5",
    name: "Anya Taylor-Joy",
    knownFor: "Furiosa, The Queen's Gambit",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb6",
    name: "Pedro Pascal",
    knownFor: "The Last of Us, The Mandalorian",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb7",
    name: "Margot Robbie",
    knownFor: "Barbie, Babylon",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb8",
    name: "Ryan Gosling",
    knownFor: "Barbie, The Fall Guy",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb9",
    name: "Cillian Murphy",
    knownFor: "Oppenheimer, Peaky Blinders",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
  {
    id: "celeb10",
    name: "Emily Blunt",
    knownFor: "Oppenheimer, The Fall Guy",
    imageUrl: "/placeholder.svg?height=300&width=200",
  },
]

export default function CelebritiesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Popular Celebrities</h1>

        <div className="relative max-w-xl mb-8">
          <input
            type="text"
            placeholder="Search for a celebrity..."
            className="w-full bg-zinc-800 text-white rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-rose-600"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={20} className="text-zinc-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {celebrities.map((celeb) => (
            <Link href={`/name/${celeb.id}`} key={celeb.id} className="group">
              <div className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={celeb.imageUrl || "/placeholder.svg"}
                    alt={celeb.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3">
                  <h2 className="font-medium group-hover:text-rose-500 transition-colors">{celeb.name}</h2>
                  <p className="text-zinc-400 text-sm line-clamp-1">{celeb.knownFor}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-6 rounded-md">Load More</button>
        </div>
      </div>
    </main>
  )
}

