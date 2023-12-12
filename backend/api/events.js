const express = require("express");
const { check } = require("express-validator");

// const usersController = require("../controllers/users-controller");
const HttpError = require("../models/http-error");
const eventsController = require("../controllers/events-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//link to check if prod can access APIs
router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "get data has succesfully ok",
    });
  } catch (err) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

//middleware to check if incoming request has a valid token
router.use(checkAuth);

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
router.patch("/:eventId", eventsController.updateEvent);
router.delete("/:eventId", eventsController.deleteEvent);

module.exports = router;
