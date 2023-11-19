const express = require("express");
const { check } = require("express-validator");

// const usersController = require("../controllers/users-controller");
const HttpError = require("../models/http-error");
const eventsController = require("../controllers/events-controller");

const router = express.Router();

console.log("reached events routes");

router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "get data has succesfully",
    });
  } catch (err) {
    console.log(error);
    return res.status(500).send("server error");
  }
});
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
