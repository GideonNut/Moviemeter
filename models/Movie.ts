import mongoose, { Schema, model, models } from "mongoose"

const MovieSchema = new Schema({
  title: String,
  description: String,
  posterUrl: String,
}, { timestamps: true })

export default models.Movie || model("Movie", MovieSchema)
