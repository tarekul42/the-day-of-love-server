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
  },
  letter: {
    type: Object,
  },
  letterType: {
    type: String,
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
