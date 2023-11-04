const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const pollSchema = new Schema({
  event: { type: mongoose.Types.ObjectId, required: true, ref: "Event" }, //each poll belongs to 1 event
  question: { type: String, required: true },
  options: [{ type: mongoose.Types.ObjectId, required: false, ref: "Option" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Poll", pollSchema);
