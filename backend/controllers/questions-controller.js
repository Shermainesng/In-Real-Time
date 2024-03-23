const Question = require("../models/question");
const Event = require("../models/event");
const HttpError = require("../models/http-error");

const createQuestion = async (req, res, next) => {
  const { questionText, author } = req.body;
  const eventId = req.params.eventId;
  const createdQuestion = new Question({
    questionText,
    author: author ? author : "Anonymous",
  });

  let existingEvent;
  try {
    //save question in events
    existingEvent = await Event.findById(eventId);
    console.log(existingEvent);
  } catch (err) {
    const error = new HttpError(
      "Creating question failed, please try again",
      500
    );
    return next(error);
  }
  if (!existingEvent) {
    const error = new HttpError("Could not find event for provided id", 404);
    return next(error);
  }

  try {
    await createdQuestion.save();
    existingEvent.questions.push(createdQuestion);
    await existingEvent.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("can't save question, try again", 500);
    return next(error);
  }
  res.status(201).json({ question: createdQuestion });
};

const getAllQuestionByEventId = async (req, res, next) => {
  const eventId = req.params.eventId;
  let eventWithQuestions;
  try {
    eventWithQuestions = await Event.findOne({ _id: eventId }).populate(
      "questions"
    ); //give us event.polls to use
    // console.log(eventWithQuestions);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a event.",
      500
    );
    return next(error);
  }

  if (!eventWithQuestions) {
    return next(new HttpError("Could not find questions for the event", 404));
  }
  res.json({
    questions: eventWithQuestions.questions.map((qns) =>
      qns.toObject({ getters: true })
    ),
  });
};
const getResponsesByQuestionId = async (req, res, next) => {
  const questionId = req.params.questionId;
  console.log("in create response", questionId);

  let questionWithResponse;
  try {
    questionWithResponse = await Question.findOne({ _id: questionId }).populate(
      "responses"
    ); //give us question.responses to use
    console.log(questionWithResponse);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a event.",
      500
    );
    return next(error);
  }
  if (!questionWithResponse) {
    const error = new HttpError("Could not find question for provided id", 404);
    return next(error);
  }

  res.json({
    responses: questionWithResponse.responses.map((response) =>
      response.toObject({ getters: true })
    ),
  });
};
const createResponse = async (req, res, next) => {
  const questionId = req.params.questionId;
  const { responseText, responseAuthor } = req.body;

  console.log("author in backend", responseAuthor);

  let existingQuestion;
  try {
    existingQuestion = await Question.findById(questionId);
    console.log(existingQuestion);
  } catch (err) {
    const error = new HttpError(
      "Creating response failed, please try again",
      500
    );
    return next(error);
  }

  if (!existingQuestion) {
    const error = new HttpError("Could not find question for provided id", 404);
    return next(error);
  }

  try {
    const newResponse = {
      responseText,
      author: responseAuthor ? responseAuthor : "Anonymous",
      replies: [], // Empty array for potential replies
    };

    existingQuestion.responses.push(newResponse);
    await existingQuestion.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Failed to create response, please try again",
      500
    );
    return next(error);
  }
  res.json({
    responses: existingQuestion.responses.map((response) =>
      response.toObject({ getters: true })
    ),
  });
};

exports.createQuestion = createQuestion;
exports.getAllQuestionByEventId = getAllQuestionByEventId;
exports.getResponsesByQuestionId = getResponsesByQuestionId;
exports.createResponse = createResponse;
