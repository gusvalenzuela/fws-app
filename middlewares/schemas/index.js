import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});
export const scheduleSchema = new mongoose.Schema({
  sportrId: String,
  events: Array,
});
