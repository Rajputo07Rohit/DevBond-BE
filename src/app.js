const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User({
    firstName: "Virat",
    lastName: "Kholi",
    emailId: "Virat@gmail.com",
    password: "Virat@123",
  });

  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection done... ");
    app.listen(3000, () => {
      console.log("Server is succesfully lsiting on port have 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
