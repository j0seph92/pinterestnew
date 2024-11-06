const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
//DB create
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
    // default: "default_dp.jpg", // default profile picture
  },
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);
