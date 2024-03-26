const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");
const questionController = require("../controllers/questions-controller");
const router = express.Router();

router.post("/:eventId/new", questionController.createQuestion);
router.get("/:eventId/questions", questionController.getAllQuestionByEventId);
router.post("/:questionId/responses/new", questionController.createResponse);
router.get(
  "/:questionId/responses",
  questionController.getResponsesByQuestionId
);
router.post("/:responseId/replies/new", questionController.createReply);
router.get("/:responseId/replies", questionController.getRepliesByResponseId);

module.exports = router;
