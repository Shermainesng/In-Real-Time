const HttpError = require("../models/http-error");
const Poll = require("../models/poll");
const Event = require("../models/event");

const getAllPollsByEventId = async (req, res, next) => {
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

const getPollById = async (req, res, next) => {
  const pollId = req.params.pollId;
  console.log("getpollbyid");

  let poll;
  try {
    poll = await Poll.findById(pollId);
    console.log("FOUND POLL", poll);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  //if results are null, fill the length of options with 0 and return it - [0,0,0]
  let pollResults;
  if (
    (poll.results.length === 0 || poll.results[0] === null) &&
    poll.options &&
    poll.options.length > 0
  ) {
    console.log("poll does not have results yet - initializing array");
    pollResults = new Array(poll.options.length).fill(0);
  } else {
    pollResults = poll.results;
  }
  console.log(pollResults);
  res.status(201).json({ poll, pollResults });
};

const createPoll = async (req, res, next) => {
  const { question, options, type } = req.body;
  const event = req.params.eventId;
  const createdPoll = new Poll({
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

const updatePoll = async (req, res, next) => {
  const pollId = req.params.pollId;
  const { question, options, response, resultsData } = req.body;
  let updatedPoll;
  try {
    const updateObject = {
      $set: { question, options, results: resultsData },
    };
    if (response !== "") {
      updateObject.$push = { responses: response };
    }

    updatedPoll = await Poll.findByIdAndUpdate(pollId, updateObject, {
      new: true,
      runValidators: true,
    });
    if (!updatedPoll) {
      const error = new HttpError("Poll not found.", 404);
      return next(error);
    }
    res.status(200).json({ poll: updatedPoll.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a poll.",
      500
    );
    return next(error);
  }
};

const deletePoll = async (req, res, next) => {
  console.log("reached deletePoll");
  const pollId = req.params.pollId;

  let deletedPoll;
  try {
    deletedPoll = await Poll.deleteOne({ _id: pollId });
    console.log(deletedPoll);
    if (deletedPoll.deletedCount > 0) {
      res
        .status(200)
        .json({ pollId: pollId, message: "Poll deleted successfully" });
    } else {
      res.status(404).json({ message: "Poll not found or not deleted" });
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a poll.",
      500
    );
    return next(error);
  }
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

exports.createPoll = createPoll;
exports.updatePoll = updatePoll;
exports.getPollById = getPollById;
exports.deletePoll = deletePoll;
exports.getAllPollsByEventId = getAllPollsByEventId;
