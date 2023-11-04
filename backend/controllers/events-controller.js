const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Event = require("../models/event");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

const getEventById = async (req, res, next) => {
  const eventId = req.params.eventId;
  console.log("meet here");
  let event;
  try {
    event = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find event",
      500
    );
    return next(error);
  }

  if (!event) {
    const error = new HttpError("Could not find an error for provided ID", 404);
    return next(error);
  }
  res.json({ event: event.toObject({ getters: true }) });
};

const getAllEventsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  let userWithEvents;
  try {
    userWithEvents = await User.findOne({ _id: userId }).populate("events"); //give us user.events to use
    console.log(userWithEvents);
    // res.json(userWithEvents);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a event.",
      500
    );
    return next(error);
  }

  if (!userWithEvents) {
    return next(new HttpError("Could not find events for the user ID", 404));
  }
  res.json({
    events: userWithEvents.events.map((event) =>
      event.toObject({ getters: true })
    ),
  });
};

const createEvent = async (req, res, next) => {
  console.log(req.body);
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     console.log(errors);
  //     res.status(422);
  //     throw new HttpError("Invalid inputs passed", 422);
  //   }

  const { startDate, endDate, name, creator } = req.body;
  const createdEvent = new Event({
    // id: uuidv4(),
    startDate,
    endDate,
    name,
    creator,
  });

  //relational: Event -> User
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating event failed, please try again", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    await createdEvent.save();
    user.events.push(createdEvent);
    await user.save();
    console.log(createdEvent);
    console.log(user.events);
  } catch (err) {
    console.log(err);
    const error = new HttpError("can't save event, try again", 500);
    return next(error);
  }

  res.status(201).json({ event: createdEvent });
};

exports.getEventById = getEventById;
exports.getAllEventsByUserId = getAllEventsByUserId;
exports.createEvent = createEvent;
