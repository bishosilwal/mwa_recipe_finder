const mongoose = require("mongoose");
const ingredientSchema = require("./Ingredient");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  country: { type: String, required: false },
  ingredients: [ingredientSchema],
});

module.exports = mongoose.model("Dish", dishSchema, "dish");
