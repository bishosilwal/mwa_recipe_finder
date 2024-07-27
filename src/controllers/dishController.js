const Dish = require("../models/Dish");

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
    const newDish = new Dish(req.body);
    const dish = await newDish.save();
    res.status(201).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndUpdate(id, req.body);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndDelete(id);
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.status(200).json(dish);
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
