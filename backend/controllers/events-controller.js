const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Event = require("../models/event");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

const getEventById = async (req, res, next) => {
  console.log("get Event by ID");
  const eventId = req.params.eventId;
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

  const { startDate, endDate, name } = req.body;
  const createdEvent = new Event({
    // id: uuidv4(),
    startDate,
    endDate,
    name,
    creator: req.userData.userId,
  });

  //relational: Event -> User
  let user;
  try {
    user = await User.findById(req.userData.userId);
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

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eventId;

  let event;
  try {
    event = await Event.findById(eventId).populate("creator");
    console.log("found event obj", event);
  } catch (err) {
    const error = new HttpError("sth went wrong, cannot find event", 500);
    return next(error);
  }

  if (!event) {
    const error = new HttpError("could not find event for this id", 404);
    return next(error);
  }

  try {
    await event.deleteOne();
    await event.creator.events.pull(event);
    await event.creator.save();
  } catch (err) {
    const error = new HttpError("Sth went wrong, could not delete event", 500);
    console.log(err);
    return next(error);
  }
  res.status(200).json({ message: "Deleted event" });
};

exports.getEventById = getEventById;
exports.getAllEventsByUserId = getAllEventsByUserId;
exports.createEvent = createEvent;
exports.deleteEvent = deleteEvent;
