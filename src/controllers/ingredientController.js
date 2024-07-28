const Ingredient = require("../models/Ingredient");

const validateObjectId = (id) => {
  // Basic validation for a MongoDB ObjectId (24 hex characters)
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const validateIngredientData = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Invalid or missing name");
  }
  if (data.amount && (typeof data.amount !== "number" || data.amount < 0)) {
    errors.push("Invalid amount");
  }

  if (!data.unit || typeof data.unit !== "string" || data.unit.trim() === "") {
    errors.push("Invalid or missing unit");
  }

  return errors;
};

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
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = async (req, res) => {
  try {
    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

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
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    const ingredient = await Ingredient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

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
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

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
