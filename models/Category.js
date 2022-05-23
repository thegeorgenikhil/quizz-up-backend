const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  questionOptions: {
    type: [String],
    required: true,
  },
  questionAnswer: {
    type: String,
    required: true,
  },
});
const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    categoryLevel: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
