const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const pollSchema = new Schema({
  event: { type: mongoose.Types.ObjectId, required: true, ref: "Event" }, //each poll belongs to 1 event
  question: { type: String, required: true },
  options: { type: [String], required: false },
  results: { type: [Number], required: false },
  responses: { type: [String], required: false },
  type: { type: String, required: true },
});

// pollSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Poll", pollSchema);
