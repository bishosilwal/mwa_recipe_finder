const mongoose = require("mongoose");
const ingredientSchema = require("./Ingredient");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  category: { type: String, required: false },
  country: { type: String, rerquired: false },
  ingredients: [ingredientSchema]
});


module.exports = mongoose.model("Dish", dishSchema, "dish");

