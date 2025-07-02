import mongoose, { Schema, model, models } from "mongoose"

const MovieSchema = new Schema({
  title: String,
  description: String,
  posterUrl: String,
})

export default models.Movie || model("Movie", MovieSchema)
