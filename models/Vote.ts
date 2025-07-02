import mongoose, { Schema, model, models } from "mongoose"

const VoteSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  address: String,
  voteType: Boolean,
  timestamp: { type: Date, default: Date.now },
})

export default models.Vote || model("Vote", VoteSchema)
