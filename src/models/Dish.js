const mongoose = require("mongoose");
const ingredientModel = require("./Ingredient");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false, default: 0 },
  category: { type: String, required: false },
  country: { type: String, rerquired: false },
  ingredients: [ingredientModel.schema],
});

module.exports = mongoose.model("Dish", dishSchema, "dish");
