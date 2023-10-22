const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1]; //Authorization: 'Bearer TOKEN'
    if (!token) {
      const error = new HttpError("Authentication failed", 401);
    }
    //verify the token
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401); //handles error if authorization is not set and .split fails
    return next(error);
  }
};
