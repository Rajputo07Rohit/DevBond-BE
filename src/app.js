const express = require("express");

const app = express();

const { adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data is Sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted User");
});
app.listen(3000, () => {
  console.log("Server is succesfully lsiting on port have 3000...");
});
