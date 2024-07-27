const Ingredient = require("../models/Ingredient");

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findById(id);
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = async (req, res) => {
  try {
    const newIngredient = new Ingredient(req.body);
    const ingredient = await newIngredient.save();
    res.status(201).json({
      message: "Ingredient created successfully",
      ingredient: ingredient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndUpdate(id, req.body);
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    res.status(200).json({
      message: "Ingredient updated successfully",
      ingredient: ingredient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    res.status(200).json({
      message: "Ingredient deleted successfully",
      ingredient: ingredient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
