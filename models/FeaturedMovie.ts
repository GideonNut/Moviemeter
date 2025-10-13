import mongoose, { Schema, model, models } from "mongoose"

const FeaturedMovieSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  trailerUrl: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  posterUrl: { type: String, default: "" },
  duration: { type: String, default: "2:00" },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export type FeaturedMovieDoc = mongoose.InferSchemaType<typeof FeaturedMovieSchema>

export default models.FeaturedMovie || model("FeaturedMovie", FeaturedMovieSchema)


