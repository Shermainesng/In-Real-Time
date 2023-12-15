const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");
const pollsController = require("../controllers/polls-controller");
const router = express.Router();

router.get("/:eventId/all", pollsController.getAllPollsByEventId);
router.get("/:pollId", pollsController.getPollById);
router.post("/:eventId/new", pollsController.createPoll);
router.patch("/:pollId", pollsController.updatePoll);
router.delete("/:pollId", pollsController.deletePoll);

module.exports = router;
