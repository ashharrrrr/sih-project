require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (!hashedPassword) {
    res.status(500).send("Something went wrong (DURING HASHING)");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  if (!user) {
    res.status(500).send("Something went wrong (DURING USER CREATION)");
  }

  res.status(200).send(user);
});

app.listen(3000, () => {
  console.log("Listening on PORT 3000");
});

app.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(500).send("Something went wrong (DURING LOGIN)");
  }

  const response = await User.find({ email: req.body.email });

  if (!response.length) {
    return res.status(500).send("User does not exist");
  }

  const user = response[0];

  const result = await bcrypt.compare(req.body.password, user.password);

  if (!result) {
    return res.status(500).send("Invalid password");
  }

  return res.status(200).send("Logged in");
});
