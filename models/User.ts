import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  address: { type: String, required: true, unique: true, index: true },
  nickname: { type: String, trim: true },
  points: { type: Number, default: 0 },
}, { timestamps: true })

export type UserProfile = {
  address: string
  nickname?: string
  points: number
}

export default models.User || model("User", UserSchema)


