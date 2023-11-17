const HttpError = require("../models/http-error");
const Poll = require("../models/poll");
const Event = require("../models/event");

const getAllPollsByEventId = async (req, res, next) => {
  console.log("getting all polls by Event ID");
  const eventId = req.params.eventId;
  let eventWithPolls;
  try {
    eventWithPolls = await Event.findOne({ _id: eventId }).populate("polls"); //give us event.polls to use
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a event.",
      500
    );
    return next(error);
  }

  if (!eventWithPolls) {
    return next(new HttpError("Could not find events for the user ID", 404));
  }
  res.json({
    events: eventWithPolls.polls.map((poll) =>
      poll.toObject({ getters: true })
    ),
  });
};

const createPoll = async (req, res, next) => {
  const { question, options, type } = req.body;
  const event = req.params.eventId;
  console.log(type + "look here");
  const createdPoll = new Poll({
    // id: uuidv4(),
    event,
    question,
    options,
    type,
  });

  let ExistingEvent;
  try {
    ExistingEvent = await Event.findById(event);
    console.log(ExistingEvent);
  } catch (err) {
    const error = new HttpError("Creating poll failed, please try again", 500);
    return next(error);
  }
  if (!ExistingEvent) {
    const error = new HttpError("Could not find poll for provided id", 404);
    return next(error);
  }

  try {
    await createdPoll.save();
    ExistingEvent.polls.push(createdPoll);
    await ExistingEvent.save();
    console.log(createdPoll);
    console.log(ExistingEvent.polls);
  } catch (err) {
    console.log(err);
    const error = new HttpError("can't save poll, try again", 500);
    return next(error);
  }

  res.status(201).json({ poll: createdPoll });
};

const getPollScores = async (req, res, next) => {
  //if no scores yet, add results as an array of 0s and return it
  const pollId = req.params.pollId;
  let pollResults;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      console.log("poll not found");
      return null;
    }
    console.log(poll.results);
    if (poll.results.length === 0) {
      console.log("poll does not have results yet");
      pollResults = new Array(poll.options.length).fill(0);
    } else {
      pollResults = poll.results;
    }
    console.log(pollResults);
  } catch (err) {
    console.log(err);
    const error = new HttpError("can't save poll, try again", 500);
    return next(error);
  }
  res.status(201).json(pollResults);
};

const updatePollScores = async (req, res, next) => {
  const { resultsData } = req.body;
  const pollId = req.params.pollId;
  console.log(pollId);
  let updatedPoll;
  try {
    const filter = { _id: pollId };
    if (!filter) {
      console.log("poll not found");
      return null;
    }
    const update = { $set: { results: resultsData } };
    const updatedData = await Poll.updateOne(filter, update);
    console.log("updated");
    updatedPoll = await Poll.findOne(filter);
    console.log(updatedPoll);
  } catch (err) {
    console.log(err);
    const error = new HttpError("sth went wrong with retrieving poll", 500);
    return next(error);
  }
  res.status(201).json(updatedPoll);
};

exports.createPoll = createPoll;
exports.getAllPollsByEventId = getAllPollsByEventId;
exports.getPollScores = getPollScores;
exports.updatePollScores = updatePollScores;
