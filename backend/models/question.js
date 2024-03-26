const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//replies and responses are embedded within the questions collection as subdocuments - don't need separate collections
const replySchema = new mongoose.Schema({
  responseText: { type: String, required: true },
  author: { type: String, required: false },
  isReply: { type: Boolean, required: true },
});

const responseSchema = new mongoose.Schema({
  responseText: { type: String, required: true },
  author: { type: String, required: false },
  replies: [replySchema], // Array of replies
});

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  responses: { type: [responseSchema], required: false },
  author: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
