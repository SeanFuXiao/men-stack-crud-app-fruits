require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");
const app = express();

//Middleware
//this check s the incoming reuest for form data and turns it
//into req.body
app.use(express.urlencoded({ extended: false }));

//connect to mongodb by using out MONGODB_URI  .env file

mongoose.connect(process.env.MONGODB_URI);
//testing connect
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.log(`fail to connevct due to ${err}`);
});

const Fruit = require("./models/fruit.js");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//index route:
app.get("/fruits", async (req, res) => {
  const fruits = await Fruit.find({});
  //   res.send(fruits);
  res.render("fruits/index.ejs", {
    title: "this is the Fruits page",
    allFruits: fruits,
  });
});

//fruits routes.
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.post("/fruits", async (req, res) => {
  //req.body allows us to take valuse from the user rather
  //its json or form data

  console.log(req.body, "this is the req.body");
  if (req.body.doYouLike === "on") {
    req.body.doYouLike = true;
  } else {
    req.body.doYouLike = false;
  }
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  const fruit = await Fruit.create(req.body);
  //   res.json(fruit);
  res.redirect("/fruits");
});

app.listen(3000, () => {
  console.log(`server runing on port 3000`);
});
