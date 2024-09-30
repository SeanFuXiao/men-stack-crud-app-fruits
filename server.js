require("dotenv").config(); // loadings in env variables AKA MONGODB_URI
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
// Middleware
// this checks the incoming request for form data and turns it into req.body
app.use(express.urlencoded({ extended: false }));
// morgan logging
app.use(morgan("tiny"));
// method override to look for _method in the query string to override POST and GET
app.use(methodOverride("_method"));
// express static allows us to serve public files like css and images and js
app.use(express.static(path.join(__dirname, "public")));
// Connect to MongoDB using out MONGODB_URI from the .env file
mongoose.connect(process.env.MONGODB_URI);
console.log(process.env.CREDIT_CARD);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.log(`Failed to connect due to ${err}.`);
});

// Import Models
const Fruit = require("./models/fruit.js");

// GET request HOME
app.get("/", (req, res) => {
  // res.send('Fruits app Home Page')
  res.status(200).render("index.ejs");
});

// I.N.D.U.C.E.S
//GET -  Index /fruits
//GET -  New /fruits/new
//DELETE -  Delete /fruits/:id
//PUT -  Update /fruits/:id
//POST -  Create /fruits/
//GET - Edit /fruits/:id/edit
//GET Show /fruits/:id

// FRUITS ROUTES
// Index Route
app.get("/fruits", async (req, res) => {
  const fruits = await Fruit.find({}); // find will search the data base for all fruits or fruits matching a query
  // res.send(fruits)
  res.render("fruits/index.ejs", {
    title: "This is the Fruits page",
    allFruits: fruits,
  });
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.delete("/fruits/:id", (req, res) => {
  // alternative to async await
  Fruit.findByIdAndDelete(req.params.id).then((responseFromDb) => {
    console.log(responseFromDb);
    res.redirect("/fruits");
  });
});

app.put("/fruits/:id", async (req, res) => {
  // formdata is inside of req.body
  // res.send(req.body)

  // handle the isReadyToEat checkbox (checkboxes return 'on' if checked)
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  // findByIdAndUpdate take 3 arguments
  // 1. the id of the document we want to update
  // 2. the new data we want to update with
  // 3. an object with options (new: true) to return the updated document
  const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.redirect(`/fruits/${req.params.id}`);
});

app.post("/fruits", async (req, res) => {
  // req.body allows us to take values from the user rather
  // its json or form data
  // req.body === formDate // { name : 'apple', color: 'red', isReadyToEat: 'on' }
  console.log(req.body, "this is the req.body");
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  const fruit = await Fruit.create(req.body);
  //   res.json(fruit);
  res.redirect("/fruits"); // redirect to all fruits page
});

// FRUITS EDIT FORM
app.get("/fruits/:id/edit", async (req, res) => {
  const fruit = await Fruit.findById(req.params.id);
  res.render("fruits/edit.ejs", {
    fruit,
  });
});

// FRUITS SHOW
app.get("/fruits/:id", async (req, res) => {
  const fruit = await Fruit.findById(req.params.id);
  res.render("fruits/show.ejs", {
    fruit,
    // fruit: fruit - this is the same as above
  });
});

app.listen(3000, () =>
  console.log("Building a CRUD Fruits app using port 3000")
);
