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
    eventWithQuestions = await Event.findOne({ _id: eventId }).populate({
      path: "questions",
      options: { sort: { createdAt: -1 } }, // Sort questions by createdAt field in descending order
    });
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

//New Reply to a Response
const createReply = async (req, res, next) => {
  const responseId = req.params.responseId;

  const { replyText: responseText, replyAuthor } = req.body;
  console.log("in create reply", responseId);

  let existingResponse;
  let existingQuestion;
  try {
    // Find the question with the given responseId
    existingQuestion = await Question.findOne({
      responses: { $elemMatch: { _id: responseId } },
    });
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find the response => Traverse through that question's responses to find that particular response
    existingResponse = existingQuestion.responses.find(
      (response) => response.id === responseId
    );

    console.log("found existingResponse", existingResponse);
    if (!existingResponse) {
      return res.status(404).json({ message: "Response not found" });
    }
  } catch (err) {
    const error = new HttpError(
      "Creating response failed, please try again",
      500
    );
    return next(error);
  }

  try {
    const newReply = {
      responseText,
      author: replyAuthor ? replyAuthor : "Anonymous",
      isReply: true,
    };

    existingResponse.replies.push(newReply);
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
    replies: existingResponse.replies.map((reply) =>
      reply.toObject({ getters: true })
    ),
  });
};

const getRepliesByResponseId = async (req, res, next) => {
  const responseId = req.params.responseId;

  let existingQuestion;
  let existingResponse;
  try {
    // Find the question with the given responseId
    existingQuestion = await Question.findOne({
      responses: { $elemMatch: { _id: responseId } },
    });
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    //Find the relevant response
    existingResponse = existingQuestion.responses.find(
      (response) => response.id === responseId
    );

    if (!existingResponse) {
      return res.status(404).json({ message: "Response not found" });
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Failed to create response, please try again",
      500
    );
    return next(error);
  }

  console.log(existingResponse.replies);
  res.json({
    replies: existingResponse.replies.map((reply) =>
      reply.toObject({ getters: true })
    ),
  });
};

exports.createQuestion = createQuestion;
exports.getAllQuestionByEventId = getAllQuestionByEventId;
exports.getResponsesByQuestionId = getResponsesByQuestionId;
exports.createResponse = createResponse;
exports.createReply = createReply;
exports.getRepliesByResponseId = getRepliesByResponseId;
