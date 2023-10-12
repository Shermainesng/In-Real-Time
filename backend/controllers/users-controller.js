const { validationResult } = require("express-validator");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    // users = User.find({}, 'name email') //display all data except password
    users = await User.find({}, "-password"); //display all data except password
  } catch (err) {
    const error = new HttpError("Fetching users failed, try again", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, check data", 422));
  }
  //return next passes the error to the next middleware in the request-response cycle.

  const { email, name, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, pls try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists alr, pls log in", 422);
    return next(error);
  }

  const createdUser = new User({
    email,
    name,
    // image: "https://unsplash.com/photos/ZHvM3XIOHoE",
    password,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("signing up failed, try again", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email + "email");
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("logging failed, pls try again later", 500);
    return next(error);
  }

  console.log(existingUser.password + "PASSWORD");
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
