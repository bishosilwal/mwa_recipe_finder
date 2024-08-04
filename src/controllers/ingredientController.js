const Dish = require("../models/Dish");

const validateObjectId = (id) => {
  // Basic validation for a MongoDB ObjectId (24 hex characters)
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const validateIngredientData = (data) => {
  const errors = [];

  if (data.name && (typeof data.name !== "string" || data.name.trim() === "")) {
    errors.push("Invalid or missing name");
  }
  if (data.amount && (typeof data.amount !== "number" || data.amount < 0)) {
    errors.push("Invalid amount");
  }

  if (data.unit && (typeof data.unit !== "string" || data.unit.trim() === "")) {
    errors.push("Invalid or missing unit");
  }
  return errors;
};

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Dish.findById(req.params.dishId).select("ingredients");
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const { dishId, id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }
    const dish = await Dish.findById(dishId);
    const ingredient = dish?.ingredients?.find(i => i._id == id);
    if(ingredient) {
      res.status(200).json(ingredient);
    } else {
      return res.status(404).json({ message: "Ingredient not found"})
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = async (req, res) => {
  try {
    const {dishId} = req.params;
    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }
    const dish = await Dish.findById(dishId);
    if(dish) {
      dish.ingredients.push({
          name: req.body.name,
          amount: req.body.amount,
          unit: req.body.unit,
        });
      const updatedDish = await dish.save();
      res.status(201).json({
        message: "Ingredient created successfully",
        ingredient: updatedDish.ingredients,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIngredient = async(req, res) => {
  try {
    const { dishId, id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    const dish = await Dish.findById(dishId);
    const ingredient = dish?.ingredients?.find(i => i._id == id);

    if(ingredient) {
      dish.ingredients = dish.ingredients.map((i) => {
          if (i._id == ingredient._id) {
            ingredient.name = req.body.name;
            ingredient.amount = req.body.amount;
            ingredient.unit = req.body.unit;
            return ingredient;
          } else {
            return i;
          }
        });
      const updatedDish = await dish.save();

      res.status(200).json({
        message: "Ingredient updated successfully",
        dish: updatedDish,
      });
    } else {
      res.status(404).json({
        message: "Ingredient not found"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const partialUpdateIngredient = async (req, res) => {
  try {
    const {dishId, id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    //check if only one field is being updated
    if (Object.keys(req.body).length !== 1) {
      return res
        .status(400)
        .json({ message: "Only one field can be updated at a time" });
    }

    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    } else {
      const dish = await Dish.findById(dishId);
      const ingredient = dish?.ingredients?.find(i => i._id == id);

      if(ingredient) {
        dish.ingredients.map(ingredient => {
          if(ingredient._id == id) {
            if (req.body.name) ingredient.name = req.body.name;
                      if (req.body.amount) ingredient.amount = req.body.amount;
                      if (req.body.unit) ingredient.unit = req.body.unit;
          }
          return ingredient;
        })
        const updatedDish = await dish.save();
        res.status(200).json({
                  message: "Ingredient updated successfully",
                  dish: updatedDish,
                });
      } else {
              return res.status(404).json({ message: "Ingredient not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const {dishId, id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const dish = await Dish.findById(dishId);
    dish.ingredients.filter(i => i._id != id);
    const udpatedDish = await dish.save();

    res.status(200).json({
      message: "Ingredient deleted successfully",
      dish: updatedDish,
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
  partialUpdateIngredient,
  deleteIngredient,
};
