const Dish = require("../models/Dish");
var callbackify = require("callbackify");

function validateDish(dish) {
  if (typeof dish !== "object" || dish === null) {
    throw new Error("Dish must be an object");
  }
  if (dish.name && (typeof dish.name !== "string" || dish.name.trim() === "")) {
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

const _getDishByIdWithCallback = callbackify(function (id) {
  return Dish.findById(id).exec();
});

const _getDishesWithCallback = callbackify(function () {
  return Dish.find().exec();
});

const _createDishWithCallback = callbackify(function (dish) {
  return Dish.create(dish);
});

const _saveDishWithCallback = callbackify(function (dish) {
  return dish.save();
});

const getAllDishes = (req, res) => {
  try {
    _getDishesWithCallback(function (error, dishes) {
      if (error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(200).json(dishes);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDishById = (req, res) => {
  try {
    const { id } = req.params;
    _getDishByIdWithCallback(id, function (error, dish) {
      if (error) {
        res.status(500).json({ message: error.message });
      } else if (!dish) {
        res.status(404).json({ message: "Dish not found" });
      } else {
        res.status(200).json(dish);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDish = (req, res) => {
  try {
    const dish = req.body;
    validateDish(dish);
    const newDish = new Dish(dish);
    let error = newDish.validateSync();
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      // no need to manually assign req body's values, since they are validated and will not be added in document
      _createDishWithCallback(newDish, function (error, savedDish) {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(201).json({
            message: "Dish created successfully",
            dish: savedDish,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDish = (req, res) => {
  try {
    const dish = req.body;
    validateDish(dish);
    _updateOne(req, res, _fullDishUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const partialUpdateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = req.body;
    //check if only one field is being updated
    if (Object.keys(req.body).length !== 1) {
      return res
        .status(400)
        .json({ message: "Only one field can be updated at a time" });
    }
    validateDish(dish);
    _updateOne(req, res, _partialDishUpdate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const findOneDeleteCallback = callbackify(function (id) {
      return Dish.findOneAndDelete({ _id: id }).exec();
    });
    findOneDeleteCallback(id, function (error, dish) {
      const response = { status: 204, message: dish };
      if (error) {
        response.status = 500;
        response.message = error;
      } else if (!dish) {
        response.status = 404;
        response.message = { message: "Dish with ID not found" };
      } else {
        response.message = dish;
        response.status = 200;
      }

      res.status(response.status).json(response.message);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const _updateOne = function (req, res, preDishUpdateCallback) {
  const { id } = req.params;

  _getDishByIdWithCallback(id, function (error, dish) {
    const response = { status: 200, message: dish };
    if (error) {
      response.status = 500;
      response.message = error;
    } else if (!dish) {
      response.status = 404;
      response.message = { message: "Dish with ID not found" };
    }
    if (response.status !== 200) {
      return res.status(response.status).json(response.message);
    }
    dish = preDishUpdateCallback(req, dish);

    _saveDishWithCallback(dish, function (err, updatedDish) {
      const response = { status: 204, message: updatedDish };
      if (err) {
        response.status = 500;
        response.message = err;
      } else if (!updatedDish) {
        response.status = 404;
        response.message = { message: "Dish with ID not found" };
      } else {
        response.message = updatedDish;
        response.status = 200;
      }
      res.status(response.status).json(response.message);
    });
  });
};

const _fullDishUpdate = function (req, dish) {
  dish.name = req.body.name;
  dish.category = req.body.category;
  dish.country = req.body.country;
  dish.ingredients = req.body.ingredients;

  return dish;
};

const _partialDishUpdate = function (req, dish) {
  if (req.body.name) dish.name = req.body.name;
  if (req.body.category) dish.category = req.body.category;
  if (req.body.country) dish.country = req.body.country;
  if (req.body.ingredients) dish.ingredients = req.body.ingredients;

  return dish;
};

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  partialUpdateDish,
  deleteDish,
};
