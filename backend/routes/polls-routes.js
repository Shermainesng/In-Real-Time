const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");
const pollsController = require("../controllers/polls-controller");
const router = express.Router();

console.log("reached polls routes");

router.get("/:eventId", pollsController.getAllPollsByEventId);
router.post("/:eventId/new", pollsController.createPoll);

module.exports = router;
