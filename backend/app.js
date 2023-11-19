const express = require("express");
// const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const eventsRoutes = require("./routes/events-routes");
const pollsRoutes = require("./routes/polls-routes");
const HttpError = require("./models/http-error");
const app = express();
app.use(bodyParser.json());
// app.use(cors());

// handling CORS error - exchange of data between different servers prohibited by browser
// app.use(cors(
//   {
//     origin: ["https://deploy-mern-"]
//   }
// ))
// if (process.env.ENV === "dev") require("dotenv").config();
require("dotenv").config();

/* Display message in the console if the connection is successful. */
mongoose.connection.once("open", () => {
  console.log("connected!");
});

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
app.use("/api/polls", pollsRoutes);

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

// mongoose
//   .connect(
//     "mongodb+srv://mainUser:newuser@cluster0.807aapy.mongodb.net/?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     app.listen(7005);
//   })
//   .catch((err) => {
//     console.log("error is here " + err);
//   });
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });
