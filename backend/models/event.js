const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  // id: { type: String, required: true, unique: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  name: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  polls: [{ type: mongoose.Types.ObjectId, required: false, ref: "Poll" }],
  questions: [
    { type: mongoose.Types.ObjectId, required: false, ref: "Question" },
  ],
});

// eventSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Event", eventSchema);
