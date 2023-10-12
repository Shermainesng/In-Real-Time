const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");

const app = express();
app.use(bodyParser.json());

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

app.use("/api/users", usersRoutes);
