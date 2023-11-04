const express = require("express");
const { check } = require("express-validator");

// const usersController = require("../controllers/users-controller");
const HttpError = require("../models/http-error");
const eventsController = require("../controllers/events-controller");

const router = express.Router();

console.log("reached events routes");

router.get("/:userId", eventsController.getAllEventsByUserId);

router.get("/:eventId/polls", eventsController.getEventById);

router.post(
  "/new",
  [
    check("startDate").not().isEmpty(),
    check("endDate").not().isEmpty(),
    check("name").not().isEmpty(),
  ],
  eventsController.createEvent
);

module.exports = router;
