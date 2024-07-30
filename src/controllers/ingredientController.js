const Dish = require("../models/Dish");
var callbackify = require("callbackify");
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

const _getDishByIdWithCallback = callbackify(function (id) {
  return Dish.findById(id).exec();
});

const _getIngredientsByDishIdCallback = callbackify(function (dishId) {
  return Dish.findById(dishId).select("ingredients").exec();
});

const _saveDishWithCallback = callbackify(function (dish) {
  return dish.save();
});

const getAllIngredients = (req, res) => {
  try {
    _getIngredientsByDishIdCallback(
      req.params.dishId,
      function (error, ingredients) {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (!ingredients) {
          return res.status(404).json({ message: "Dish not found" });
        }

        res.status(200).json(ingredients);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIngredientById = (req, res) => {
  try {
    const { dishId, id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    _getIngredientsByDishIdCallback(dishId, function (error, dish) {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }

      const ingredient = dish.ingredients.find((i) => i._id == id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
      res.status(200).json(ingredient);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = (req, res) => {
  try {
    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    _performActionOnIngredient(
      res,
      req,
      "Ingredient created successfully",
      function (ingredients, ingredient) {
        ingredients.push({
          name: req.body.name,
          amount: req.body.amount,
          unit: req.body.unit,
        });
        return ingredients;
      },
      true
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIngredient = (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }

    const validationErrors = validateIngredientData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    _performActionOnIngredient(
      res,
      req,
      "Ingredient updated successfully",
      function (ingredients, ingredient) {
        return ingredients.map((i) => {
          if (i._id == ingredient._id) {
            ingredient.name = req.body.name;
            ingredient.amount = req.body.amount;
            ingredient.unit = req.body.unit;
            return ingredient;
          } else {
            return i;
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const partialUpdateIngredient = (req, res) => {
  try {
    const { id } = req.params;
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
      _performActionOnIngredient(
        res,
        req,
        "Ingredient updated successfully",
        function (ingredients, ingredient) {
          if (req.body.name) ingredient.name = req.body.name;
          if (req.body.amount) ingredient.amount = req.body.amount;
          if (req.body.unit) ingredient.unit = req.body.unit;

          return ingredients.map((i) => {
            if (i._id == ingredient._id) {
              return ingredient;
            } else {
              return i;
            }
          });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIngredient = (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid ingredient ID format" });
    }
    _performActionOnIngredient(
      res,
      req,
      "Ingredient deleted successfully",
      (ingredients, ingredient) => {
        return ingredients.filter((i) => i._id != ingredient?._id);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const _performActionOnIngredient = (
  res,
  req,
  msg,
  preSaveActionOnIngredient,
  isCreate = false
) => {
  const { dishId, id } = req.params;
  _getDishByIdWithCallback(dishId, function (error, dish) {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    } else {
      const ingredient = dish.ingredients.find((i) => i._id == id);
      if (!ingredient && isCreate) {
        return res.status(404).json({ message: "Ingredient not found" });
      } else {
        dish.ingredients = preSaveActionOnIngredient(
          dish.ingredients,
          ingredient
        );
        _saveDishWithCallback(dish, function (err, updatedDish) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.status(200).json({
            message: msg,
            ingredient: updatedDish.ingredients.find((i) => i._id == id),
          });
        });
      }
    }
  });
};

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  partialUpdateIngredient,
  deleteIngredient,
};
