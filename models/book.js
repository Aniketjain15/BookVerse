const mongoose = require("mongoose");

const book = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
     rating: { type: Number, min: 0, max: 5, default: 0 }, 

  },
  { timestamps: true }
);

module.exports = mongoose.model("books", book);
