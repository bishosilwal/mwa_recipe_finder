const Dish = require("../models/Dish");
const httpCode = require("../utils/httpStatusCodes");

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
      ingredient.amount = parseFloat(ingredient.amount);
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

const _sendResponse = (res, responseData) => {
  res.status(responseData.status).json(responseData.data);
};

const responseData = {
  status: httpCode.SUCCESS,
  data: {},
};

const _setErrorResponse = (error) => {
  responseData.status = httpCode.INTERNAL_SERVER_ERROR;
  responseData.data = { message: error.message };
};

const getAllDishes = async (req, res) => {
  try {
    let offset = 0;
    let count = 5;
    if (req.query && req.query.offset) {
      offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
      count = parseInt(req.query.count, 10);
    }
    const dishes = await Dish.find().skip(offset).limit(count);
    const totalCount = await Dish.countDocuments();
    responseData.data = {
      dishes: dishes,
      offset: offset,
      count: count,
      totalCount: totalCount,
    };
  } catch (error) {
    responseData.status = httpCode.INTERNAL_SERVER_ERROR;
    responseData.data = { message: error.message };
  }
  _sendResponse(res, responseData);
};

const getBySearch = async (req, res, next) => {
  try {
    if (!!req.query?.search) {
      const dishes = await Dish.find({
        name: new RegExp("." + req.query.search + ".*", "i"),
      });
      responseData.data = {
        dishes: dishes,
      };
    } else {
      res.redirect("/api/dishes");
      next();
    }
  } catch (error) {
    _setErrorResponse(error);
  }
  _sendResponse(res, responseData);
};

const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    responseData.data = {
      dish: dish,
    };
    if (!dish) {
      responseData.status = httpCode.NOT_FOUND;
      responseData.data = { message: "Dish not found" };
    }
  } catch (error) {
    _setErrorResponse(error);
    responseData.status = httpCode.INTERNAL_SERVER_ERROR;
    responseData.data = { message: error.message };
  }
  _sendResponse(res, responseData);
};

const createDish = async (req, res) => {
  try {
    const dish = req.body;
    validateDish(dish);
    const newDish = new Dish(dish);
    let error = newDish.validateSync();
    if (error) {
      responseData.status = httpCode.BAD_REQUEST;
      responseData.data = { message: error.message };
    } else {
      const newDish = new Dish(dish);
      const savedDish = await newDish.save();
      responseData.data = {
        dish: savedDish,
        message: "Dish created successfully",
      };
      responseData.status = httpCode.CREATED;
    }
  } catch (error) {
    _setErrorResponse(error);
  }
  _sendResponse(res, responseData);
};

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = req.body;
    validateDish(dish);
    dish.name = req.body.name;
    dish.category = req.body.category;
    dish.country = req.body.country;
    dish.ingredients = req.body.ingredients;
    const updatedDish = await Dish.findByIdAndUpdate(id, dish);
    responseData.data = {
      dish: dish,
      message: "Dish updated successfully",
    };
    if (!updatedDish) {
      responseData.status = httpCode.NOT_FOUND;
      responseData.data = { message: "Dish not found" };
    }
  } catch (error) {
    _setErrorResponse(error);
  }
  _sendResponse(res, responseData);
};

const partialUpdateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = req.body;
    //check if only one field is being updated
    if (Object.keys(req.body).length !== 1) {
      responseData.status = httpCode.BAD_REQUEST;
      responseData.data = {
        message: "Only one field can be updated at a time",
      };
      return _sendResponse(res, responseData);
    }
    validateDish(dish);
    if (req.body.name) dish.name = req.body.name;
    if (req.body.category) dish.category = req.body.category;
    if (req.body.country) dish.country = req.body.country;
    if (req.body.ingredients) dish.ingredients = req.body.ingredients;
    const updatedDish = await Dish.findByIdAndUpdate(id, dish, { new: true });
    responseData.data = {
      dish: updatedDish,
      message: "Dish updated successfully",
    };
    if (!updatedDish) {
      responseData.status = httpCode.NOT_FOUND;
      responseData.data = { message: "Dish not found" };
    }
  } catch (error) {
    _setErrorResponse(error);
  }
  _sendResponse(res, responseData);
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDish = await Dish.findOneAndDelete({ _id: id });
    responseData.data = {
      message: "Dish deleted successfully",
      dish: deletedDish,
    };
    if (!deletedDish) {
      responseData.status = httpCode.NOT_FOUND;
      responseData.data = { message: "Dish not found" };
    }
  } catch (error) {
    _setErrorResponse(error);
  }
  _sendResponse(res, responseData);
};

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  partialUpdateDish,
  deleteDish,
  getBySearch,
};
