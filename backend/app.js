const express = require("express");
// const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const eventsRoutes = require("./routes/events-routes");
const HttpError = require("./models/http-error");

const app = express();
app.use(bodyParser.json());
// app.use(cors());

// handling CORS error - exchange of data between different servers prohibited by browser
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
// app.options("*", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   res.sendStatus(200);
// });

app.use("/api/users", usersRoutes);
app.use("/api/events", eventsRoutes);

//error handling for undefined routes
app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

//error handling. will only be executed if any middleware in front of it has an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred" });
});

mongoose
  .connect(
    "mongodb+srv://mainUser:newuser@cluster0.807aapy.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(7005);
  })
  .catch((err) => {
    console.log("error is here " + err);
  });
