export interface Movie {
  id: string
  title: string
  description: string
  releaseYear: string
  director?: string
  cast?: string[]
  genres?: string[]
  rating?: number
  posterUrl: string
  backdropUrl?: string
  trailerUrl?: string
  screenshots?: string[]
}

// Sample movie data with proper image URLs
export const movies: Movie[] = [
  {
    id: "0",
    title: "Final Destination: Bloodlines",
    description:
      "Death is coming for a new group of unsuspecting victims in this terrifying new chapter of the Final Destination franchise.",
    releaseYear: "2024",
    director: "Zach Lipovsky, Adam B. Stein",
    cast: ["Brec Bassinger", "Teo Briones", "Keenan Tracey"],
    genres: ["Horror", "Thriller"],
    rating: 7.2,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZDJlYzMyZTctYzBiMi00Y2ZjLTg0MTctMDQ1ZTVhZDQ5ZTI1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    backdropUrl: "https://i.ytimg.com/vi/EL4sUiPQDrQ/maxresdefault.jpg",
    trailerUrl: "https://www.youtube.com/embed/EL4sUiPQDrQ",
    screenshots: [
      "https://i.ytimg.com/vi/EL4sUiPQDrQ/hq720.jpg",
      "https://i.ytimg.com/vi/EL4sUiPQDrQ/hqdefault.jpg",
      "https://i.ytimg.com/vi/EL4sUiPQDrQ/maxresdefault.jpg",
    ],
  },
  {
    id: "1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: "2010",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    genres: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.8,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    backdropUrl: "https://wallpaperaccess.com/full/1264514.jpg",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    screenshots: [
      "https://m.media-amazon.com/images/M/MV5BMTM4OGIzMWMtMjkwZS00ZTIwLWI1MTktY2E1NWI0NGM0MWRjXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTM4OTQ0NTkxMF5BMl5BanBnXkFtZTcwNjEwMzE0Mw@@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTY3MzMzMDgyMF5BMl5BanBnXkFtZTcwODAwMzE0Mw@@._V1_.jpg",
    ],
  },
  {
    id: "2",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: "2014",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    genres: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    backdropUrl: "https://wallpaperaccess.com/full/1264543.jpg",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    screenshots: [
      "https://m.media-amazon.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTc0MjgyNTUyNF5BMl5BanBnXkFtZTgwNDQ5MTE0MjE@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTg4Njk4MzY0Nl5BMl5BanBnXkFtZTgwMzIyODgxMzE@._V1_.jpg",
    ],
  },
  {
    id: "3",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: "2008",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genres: ["Action", "Crime", "Drama"],
    rating: 9.0,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    backdropUrl: "https://wallpaperaccess.com/full/1264521.jpg",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    screenshots: [
      "https://m.media-amazon.com/images/M/MV5BMTM5OTMyMjIxOV5BMl5BanBnXkFtZTcwNzU3MTIzMw@@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTkyMjQ4ODk1NF5BMl5BanBnXkFtZTcwMDU3MTIzMw@@._V1_.jpg",
      "https://m.media-amazon.com/images/M/MV5BMTMwNzExMTcxOV5BMl5BanBnXkFtZTcwODU3MTIzMw@@._V1_.jpg",
    ],
  },
]

