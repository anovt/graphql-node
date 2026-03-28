const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
