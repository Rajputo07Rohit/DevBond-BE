const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the  namste node server");
});

app.listen(3000, () => {
  console.log("Server is succesfully lsiting on port have 3000...");
});
