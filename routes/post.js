const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  pinTitle: {
    type: String,
    required: true,
  },
  pinImage: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  pinDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Post", postSchema);
