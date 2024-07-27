const mongoose = require("mongoose");
const ingredient = require("./Ingredient");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false, default: 0 },
  category: { type: String, required: false },
  country: { type: String, rerquired: false },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
});

// Pre-delete middleware to remove related ingredients
dishSchema.pre("findOneAndDelete", async function (next) {
  const dish = await this.model.findOne(this.getFilter());
  await ingredient.deleteMany({ _id: { $in: dish.ingredients } });
  next();
});

module.exports = mongoose.model("Dish", dishSchema, "dish");
