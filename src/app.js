require("dotenv").config(); // Load .env

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Signup route
app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    if (user?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Cred");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Cred");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@0870", {
        expiresIn: "1d",
      });

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, { expires: true });
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid Cred");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
  const userID = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userID }, data, {
      runValidators: true,
    });

    // const user = await User.findByIdAndDelete(userId);

    res.send("Data is Updated succesfully!");
  } catch (error) {
    res.status(400).send("Something went wrong " + error);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong " + error);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sending a Connection request ");
    res.send(user.firstName + " send the Connection Request Sent!");
  } catch (error) {
    res.status(400).send("ERROR  : " + error.message);
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
