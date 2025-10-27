const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    // route handler
    console.log("route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("route handler 3");
    next();
  },
  (req, res) => {
    res.send("route handler 4");
  }
);

app.listen(3000, () => {
  console.log("Server is succesfully lsiting on port have 3000...");
});
