const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
  name: String,
  isReadyToEat: { type: Boolean, default: false },
  color: String, // you may see an object instead of a data type here which allows for extra configuration
  secondaryColor: String,
});

const Fruit = mongoose.model("Fruit", fruitSchema);

module.exports = Fruit;
