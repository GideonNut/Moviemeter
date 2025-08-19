import mongoose, { Schema, model, models } from "mongoose"

const WatchlistSchema = new Schema({
  address: { type: String, required: true, index: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true })

// Compound index to ensure unique user-movie combinations
WatchlistSchema.index({ address: 1, movieId: 1 }, { unique: true })

export default models.Watchlist || model("Watchlist", WatchlistSchema)
