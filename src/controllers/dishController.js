const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");


function validateDish(dish) {
  if (typeof dish !== "object" || dish === null) {
    throw new Error("Dish must be an object");
  }
  if (typeof dish.name !== "string" || dish.name.trim() === "") {
    throw new Error("Dish name must be a non-empty string");
  }
  if (dish.category && typeof dish.category !== "string") {
    throw new Error("Dish category must be a string");
  }
  if (dish.country && typeof dish.country !== "string") {
    throw new Error("Dish country must be a string");
  }
  if (dish.ingredients && !Array.isArray(dish.ingredients)) {
    throw new Error("Dish ingredients must be an array");
  }
  if (dish.ingredients) {
    dish.ingredients.forEach((ingredient) => {
      if (typeof ingredient !== "object" || ingredient === null) {
        throw new Error("Ingredient must be an object");
      }
      if (
        typeof ingredient.name !== "string" ||
        ingredient.name.trim() === ""
      ) {
        throw new Error("Ingredient name must be a non-empty string");
      }
      if (typeof ingredient.amount !== "number" || isNaN(ingredient.amount)) {
        throw new Error("Ingredient amount must be a number");
      }
      if (
        typeof ingredient.unit !== "string" ||
        ingredient.unit.trim() === ""
      ) {
        throw new Error("Ingredient unit must be a non-empty string");
      }
    });
  }
}

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDish = async (req, res) => {
  try {
    const dish = req.body;
    validateDish(dish);
    const ingredientPromise = dish.ingredients?.map(async (ingredient) => {
      let newIngredient = new Ingredient(ingredient);
      return await newIngredient.save();
    });
    if (ingredientPromise) {
      let ingredients = await Promise.all(ingredientPromise);
      dish.ingredients = ingredients.map((ingredient) => ingredient._id);
    } else {
      dish.ingredients = [];
    }
    const newDish = new Dish(dish);
    const savedDish = await newDish.save();
    res.status(201).json({
      message: "Dish created successfully",
      dish: savedDish,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = req.body;
    validateDish(dish);
    const updatedDish = await Dish.findByIdAndUpdate(id, dish);
    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.status(200).json({
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDish = await Dish.findOneAndDelete({ _id: id });
    if (!deletedDish)
      return res.status(404).json({ message: "Dish not found" });
    res.status(200).json({
      message: "Dish deleted successfully",
      dish: deletedDish,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
};
