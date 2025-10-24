const express = require("express");

const app = express();

app.get("/user/:userId", (req, res) => {
  console.log(req.params);

  res.send({ first_name: "Rohit", last_name: "Singh" });
});

app.listen(3000, () => {
  console.log("Server is succesfully lsiting on port have 3000...");
});
