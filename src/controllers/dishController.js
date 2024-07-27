const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");

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
    const ingredientPromise = req.body?.ingredients?.map(async (ingredient) => {
      let newIngredient = new Ingredient(ingredient);
      return await newIngredient.save();
    });
    if (ingredientPromise) {
      let ingredients = await Promise.all(ingredientPromise);
      req.body.ingredients = ingredients.map((ingredient) => ingredient._id);
    } else {
      req.body.ingredients = [];
    }

    const newDish = new Dish(req.body);
    const dish = await newDish.save();
    res.status(201).json({
      message: "Dish created successfully",
      dish: dish,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndUpdate(id, req.body);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json({
      message: "Dish updated successfully",
      dish: dish,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndDelete(id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json({
      message: "Dish deleted successfully",
      dish: dish,
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
