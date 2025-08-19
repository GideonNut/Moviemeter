import mongoose, { Schema, model, models } from "mongoose"

const CommentSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  address: { type: String, required: true, index: true },
  content: { type: String, required: true, maxlength: 1000 },
  timestamp: { type: Date, default: Date.now },
  likes: [{ type: String }], // Array of addresses who liked the comment
  replies: [{
    address: { type: String, required: true },
    content: { type: String, required: true, maxlength: 500 },
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: String }]
  }]
}, { timestamps: true })

// Index for efficient querying
CommentSchema.index({ movieId: 1, timestamp: -1 })

export default models.Comment || model("Comment", CommentSchema)
