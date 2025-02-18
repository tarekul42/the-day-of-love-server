import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  loverName: {
    type: String,
  },
  loverType: {
    type: String,
    enum: ["romantic,poetic,funny"],
  },
  letter: {
    type: Object,
  },
  letterType: {
    type: String,
    enum: ["short", "medium", "long"],
  },
  language: {
    type: String,
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const Letter = mongoose.model("letters", letterSchema);

export default Letter;
