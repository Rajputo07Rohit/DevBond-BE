require("dotenv").config(); // Load .env

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error saving the user");
  }
});

app.get("/user", async (req, res) => {
  console.log(req.body);
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    // const user = await User.findByIdAndDelete(userId);

    res.send("user is deleetd succesfully!");
  } catch (error) {
    res.status(400).send("Something went wrong ");
  }
});

app.patch("/user", async (req, res) => {
  console.log(req.body);
  const userID = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userID }, data, {
      runValidators: true,
    });
    // const user = await User.findByIdAndDelete(userId);

    res.send("Data is Updated succesfully!");
  } catch (error) {
    res.status(400).send("Something went wrong ");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection done...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
    console.error(err);
  });
