const mongoose = require("mongoose");

export const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true }
});

export default mongoose.model("Ingredient", ingredientSchema, "ingredient")
