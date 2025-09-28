"use client"

import { useState } from "react"
import { RefreshCw, Film, Clock, AlertTriangle, Settings, Users, Star, TrendingUp, Eye, Edit3, Plus, Trash2, Save } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Featured Movies Management
  const [featuredMovies, setFeaturedMovies] = useState([
    {
      id: "mission-impossible-final-reckoning",
      title: "Mission: Impossible - The Final Reckoning",
      description: "Ethan Hunt and his IMF team embark on their most dangerous mission yet, facing a mysterious enemy that threatens all of humanity.",
      trailerUrl: "https://www.youtube.com/embed/fsQgc9pCyDU",
      imageUrl: "https://i.postimg.cc/MGNwGPQb/mission-impossible.jpg",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNDc0YTQ5NGEtMWQ4OC00NjM2LThmNDAtZTI0MDI5OGYzYjFjXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      duration: "2:35",
      order: 1
    },
    {
      id: "dune-2",
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
      imageUrl: "https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjhkZWY5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      duration: "2:35",
      order: 2
    },
    {
      id: "deadpool-wolverine",
      title: "Deadpool & Wolverine",
      description: "Wade Wilson's peaceful life is interrupted when former colleagues come calling, forcing him to team up with Wolverine.",
      trailerUrl: "https://www.youtube.com/embed/4sUQfaQjKd8",
      imageUrl: "https://i.ytimg.com/vi/4sUQfaQjKd8/maxresdefault.jpg",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQ5MGQyODAtNTg3OC00Y2VjLTkzODktNmU0MWYyZjZmMmRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      duration: "2:15",
      order: 3
    }
  ])

  // Featured Today Content Management
  const [featuredContent, setFeaturedContent] = useState([
    {
      id: "sxsw",
      title: "2025 SXSW Film & TV Festival Cheat Sheet",
      description: "See our picks",
      gradient: "custom-gradient-1",
      type: "list",
      order: 1
    },
    {
      id: "trending-stars",
      title: "Trending: Stars to Watch",
      description: "See the gallery",
      gradient: "custom-gradient-2",
      type: "photos",
      order: 2
    },
    {
      id: "upcoming-releases",
      title: "Most Anticipated Spring Releases",
      description: "View the list",
      gradient: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-400",
      type: "list",
      order: 3
    },
    {
      id: "award-winners",
      title: "Oscar Winners 2024",
      description: "Celebrate excellence",
      gradient: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500",
      type: "list",
      order: 4
    },
    {
      id: "indie-gems",
      title: "Hidden Indie Gems",
      description: "Discover more",
      gradient: "bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500",
      type: "list",
      order: 5
    },
    {
      id: "classic-cinema",
      title: "Classic Cinema Collection",
      description: "Timeless masterpieces",
      gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
      type: "list",
      order: 6
    }
  ])

  // Trending Stars Management
  const [trendingStars, setTrendingStars] = useState([
    {
      id: "star1",
      name: "Zendaya",
      knownFor: "Dune: Part Two, Challengers",
      imageUrl: "https://i.postimg.cc/yd3Wmqwm/zendaya.jpg",
      order: 1
    },
    {
      id: "star2",
      name: "Timothée Chalamet",
      knownFor: "Dune: Part Two, Wonka",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZTBmMmEzXkEyXkFqcGdeQXVyNDk2Mzk2NDg@._V1_.jpg",
      order: 2
    },
    {
      id: "star3",
      name: "Florence Pugh",
      knownFor: "Dune: Part Two, Oppenheimer",
      imageUrl: "https://i.postimg.cc/8P7DsBgv/florence.jpg",
      order: 3
    },
    {
      id: "star4",
      name: "Austin Butler",
      knownFor: "Dune: Part Two, Elvis",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BOWU2MDQyNDMtYjI0OS00MmNiLTk0ZmYtYzU5ZjJkZGEzYTY4XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_.jpg",
      order: 4
    },
    {
      id: "star5",
      name: "Anya Taylor-Joy",
      knownFor: "Furiosa, The Queen's Gambit",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMTgxNDcwMzU2Nl5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_.jpg",
      order: 5
    },
    {
      id: "star6",
      name: "Pedro Pascal",
      knownFor: "The Last of Us, The Mandalorian",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMDQ2ZmE2NTMtZDE3NC00YzFjLWJiNGYtNWZmZTBiZTc0MjYzXkEyXkFqcGdeQXVyMTM1MjAxMDc3._V1_.jpg",
      order: 6
    }
  ])

  // Movie adding form state
  const [movieTitle, setMovieTitle] = useState("")
  const [movieDescription, setMovieDescription] = useState("")
  const [moviePosterUrl, setMoviePosterUrl] = useState("")
  const [isTVSeries, setIsTVSeries] = useState(false)
  const [addMovieResult, setAddMovieResult] = useState<string | null>(null)

  const fetchNewMovies = async () => {
    try {
      setLoading(true)
      setResult(null)

      // In a real implementation, this would call your API
      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setResult({
        success: true,
        message: "Successfully fetched 3 new movies",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to fetch new movies",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateAllMovies = async () => {
    try {
      setLoading(true)
      setResult(null)

      // In a real implementation, this would call your API
      // For demo purposes, we'll simulate a successful API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setResult({
        success: true,
        message: "Successfully updated information for 10 movies",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to update movie information",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddMovieResult(null)
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: movieTitle,
          description: movieDescription,
          posterUrl: moviePosterUrl,
          isTVSeries: isTVSeries,
        }),
      })
      if (res.ok) {
        setAddMovieResult("Movie added!")
        setMovieTitle("")
        setMovieDescription("")
        setMoviePosterUrl("")
        setIsTVSeries(false)
      } else {
        setAddMovieResult("Failed to add movie.")
      }
    } catch {
      setAddMovieResult("Failed to add movie.")
    }
  }

  // Featured movie management functions
  const updateFeaturedMovie = (index: number, field: string, value: string) => {
    const updated = [...featuredMovies]
    updated[index] = { ...updated[index], [field]: value }
    setFeaturedMovies(updated)
  }

  const addFeaturedMovie = () => {
    const newMovie = {
      id: `new-movie-${Date.now()}`,
      title: "New Featured Movie",
      description: "Enter movie description",
      trailerUrl: "",
      imageUrl: "",
      posterUrl: "",
      duration: "2:00",
      order: featuredMovies.length + 1
    }
    setFeaturedMovies([...featuredMovies, newMovie])
  }

  const removeFeaturedMovie = (index: number) => {
    setFeaturedMovies(featuredMovies.filter((_, i) => i !== index))
  }

  // Featured content management functions
  const updateFeaturedContent = (index: number, field: string, value: string) => {
    const updated = [...featuredContent]
    updated[index] = { ...updated[index], [field]: value }
    setFeaturedContent(updated)
  }

  const addFeaturedContent = () => {
    const newContent = {
      id: `new-content-${Date.now()}`,
      title: "New Featured Content",
      description: "Enter description",
      gradient: "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400",
      type: "list",
      order: featuredContent.length + 1
    }
    setFeaturedContent([...featuredContent, newContent])
  }

  const removeFeaturedContent = (index: number) => {
    setFeaturedContent(featuredContent.filter((_, i) => i !== index))
  }

  // Trending stars management functions
  const updateTrendingStar = (index: number, field: string, value: string) => {
    const updated = [...trendingStars]
    updated[index] = { ...updated[index], [field]: value }
    setTrendingStars(updated)
  }

  const addTrendingStar = () => {
    const newStar = {
      id: `new-star-${Date.now()}`,
      name: "New Star",
      knownFor: "Enter notable works",
      imageUrl: "",
      order: trendingStars.length + 1
    }
    setTrendingStars([...trendingStars, newStar])
  }

  const removeTrendingStar = (index: number) => {
    setTrendingStars(trendingStars.filter((_, i) => i !== index))
  }

  const tabs = [
    { id: "home", label: "Home Page", icon: Eye },
    { id: "explore", label: "Explore Pages", icon: TrendingUp },
    { id: "movies", label: "Movie Management", icon: Film },
    { id: "users", label: "User Management", icon: Users },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-green-900/20 border border-green-900 px-3 py-1 rounded">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">System Online</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-zinc-800 text-white border-b-2 border-rose-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Home Page Management */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Featured Movies Management */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Star className="mr-2" />
                  Featured Movies
                </h2>
                <button
                  onClick={addFeaturedMovie}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} />
                  Add Movie
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredMovies.map((movie, index) => (
                  <div key={movie.id} className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-zinc-400">Order: {movie.order}</span>
                      <button
                        onClick={() => removeFeaturedMovie(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={movie.title}
                        onChange={(e) => updateFeaturedMovie(index, "title", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Movie Title"
                      />
                      <textarea
                        value={movie.description}
                        onChange={(e) => updateFeaturedMovie(index, "description", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600 h-20 resize-none"
                        placeholder="Movie Description"
                      />
                      <input
                        type="text"
                        value={movie.imageUrl}
                        onChange={(e) => updateFeaturedMovie(index, "imageUrl", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={movie.trailerUrl}
                        onChange={(e) => updateFeaturedMovie(index, "trailerUrl", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Trailer URL"
                      />
                      <input
                        type="text"
                        value={movie.duration}
                        onChange={(e) => updateFeaturedMovie(index, "duration", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Duration"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Today Content */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <TrendingUp className="mr-2" />
                  Featured Today Content
                </h2>
                <button
                  onClick={addFeaturedContent}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} />
                  Add Content
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredContent.map((content, index) => (
                  <div key={content.id} className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-zinc-400">Order: {content.order}</span>
                      <button
                        onClick={() => removeFeaturedContent(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={content.title}
                        onChange={(e) => updateFeaturedContent(index, "title", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Content Title"
                      />
                      <input
                        type="text"
                        value={content.description}
                        onChange={(e) => updateFeaturedContent(index, "description", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={content.gradient}
                        onChange={(e) => updateFeaturedContent(index, "gradient", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Gradient CSS Class"
                      />
                      <select
                        value={content.type}
                        onChange={(e) => updateFeaturedContent(index, "type", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                      >
                        <option value="list">List</option>
                        <option value="photos">Photos</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Stars */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="mr-2" />
                  Trending Stars
                </h2>
                <button
                  onClick={addTrendingStar}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} />
                  Add Star
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingStars.map((star, index) => (
                  <div key={star.id} className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-zinc-400">Order: {star.order}</span>
                      <button
                        onClick={() => removeTrendingStar(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={star.name}
                        onChange={(e) => updateTrendingStar(index, "name", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Star Name"
                      />
                      <input
                        type="text"
                        value={star.knownFor}
                        onChange={(e) => updateTrendingStar(index, "knownFor", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Known For"
                      />
                      <input
                        type="text"
                        value={star.imageUrl}
                        onChange={(e) => updateTrendingStar(index, "imageUrl", e.target.value)}
                        className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explore Pages Management */}
        {activeTab === "explore" && (
          <div className="space-y-8">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Explore Pages Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Movies Page</h3>
                  <p className="text-zinc-400 text-sm mb-4">Manage movie discovery and voting features</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Enable voting system</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Show movie recommendations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Enable comments</span>
                    </label>
                  </div>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Recommendations Page</h3>
                  <p className="text-zinc-400 text-sm mb-4">AI-powered movie recommendations</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Enable AI recommendations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Personalized suggestions</span>
                    </label>
                  </div>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Celebrities Page</h3>
                  <p className="text-zinc-400 text-sm mb-4">Celebrity profiles and information</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Show celebrity profiles</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Enable celebrity voting</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movie Management */}
        {activeTab === "movies" && (
          <div className="space-y-8">
            {/* Add Movie Form */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
              <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={movieTitle}
                  onChange={e => setMovieTitle(e.target.value)}
                  className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
                  required
                />
                <input
                  type="text"
                  placeholder="Poster URL"
                  value={moviePosterUrl}
                  onChange={e => setMoviePosterUrl(e.target.value)}
                  className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
                />
                <textarea
                  placeholder="Description"
                  value={movieDescription}
                  onChange={e => setMovieDescription(e.target.value)}
                  className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 md:col-span-2 h-24 resize-none"
                  required
                />
                <div className="flex items-center md:col-span-2">
                  <input
                    type="checkbox"
                    id="isTVSeries"
                    checked={isTVSeries}
                    onChange={e => setIsTVSeries(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isTVSeries" className="text-zinc-400">
                    This is a TV series
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded md:col-span-2"
                >
                  Add Movie
                </button>
                {addMovieResult && <div className="text-sm mt-2 md:col-span-2">{addMovieResult}</div>}
              </form>
            </div>

            {/* AI Agent Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Film className="mr-2" /> AI Movie Management
                </h2>
                <p className="text-zinc-400 mb-4">
                  Use the AI agent to fetch new movies and update existing movie information.
                </p>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={fetchNewMovies}
                    disabled={loading}
                    className="bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 rounded flex items-center justify-center"
                  >
                    {loading ? <RefreshCw className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
                    Fetch New Movies
                  </button>
                  <button
                    onClick={updateAllMovies}
                    disabled={loading}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded flex items-center justify-center"
                  >
                    {loading ? <Clock className="animate-spin mr-2" /> : <Clock className="mr-2" />}
                    Update All Movie Information
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">System Status</h2>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>AI Agent is active and ready</span>
                </div>
                <div className="text-sm text-zinc-400 space-y-1">
                  <p>Last run: 2 hours ago</p>
                  <p>Movies in database: 42</p>
                  <p>New movies added this week: 7</p>
                  <p>Active users: 1,234</p>
                </div>

                {result && (
                  <div
                    className={`mt-4 p-3 rounded ${result.success ? "bg-green-900/20 border border-green-900" : "bg-red-900/20 border border-red-900"}`}
                  >
                    <div className="flex items-start">
                      {result.success ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <p>{result.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduled Tasks */}
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Scheduled Tasks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="pb-3">Task</th>
                      <th className="pb-3">Frequency</th>
                      <th className="pb-3">Last Run</th>
                      <th className="pb-3">Next Run</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">Fetch New Movies</td>
                      <td>Daily</td>
                      <td>2024-01-15 08:00</td>
                      <td>2024-01-16 08:00</td>
                      <td>
                        <span className="text-green-500">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="py-3">Update Movie Information</td>
                      <td>Weekly</td>
                      <td>2024-01-12 10:00</td>
                      <td>2024-01-19 10:00</td>
                      <td>
                        <span className="text-green-500">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Generate Recommendations</td>
                      <td>Daily</td>
                      <td>2024-01-15 09:00</td>
                      <td>2024-01-16 09:00</td>
                      <td>
                        <span className="text-green-500">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-rose-500">1,234</p>
                <p className="text-zinc-400 text-sm">+12% this month</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-green-500">892</p>
                <p className="text-zinc-400 text-sm">+8% this week</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Total Votes</h3>
                <p className="text-3xl font-bold text-blue-500">5,678</p>
                <p className="text-zinc-400 text-sm">+23% this month</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="MovieMeter"
                      className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Maintenance Mode</label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Enable maintenance mode</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">API Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">OpenAI API Key</label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Rate Limit</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full p-2 bg-zinc-700 text-white rounded border border-zinc-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
