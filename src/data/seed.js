const mongoose = require("mongoose");
const Dish = require("../models/Dish");

const seedDatabase = async () => {
  try {
    // Check if the database is empty
    const dishCount = await Dish.countDocuments();

    if (dishCount > 0) {
      console.log("Database already seeded");
      return;
    }

    // Create dummy dishes with embedded ingredients
    const dishes = [
      {
        name: "Spaghetti Carbonara",
        category: "Pasta",
        country: "Italy",
        ingredients: [
          { name: "Spaghetti", amount: 200, unit: "grams" },
          { name: "Bacon", amount: 100, unit: "grams" },
          { name: "Parmesan Cheese", amount: 50, unit: "grams" },
          { name: "Eggs", amount: 2, unit: "units" },
          { name: "Olive Oil", amount: 1, unit: "tablespoon" },
          { name: "Garlic", amount: 2, unit: "cloves" },
        ],
      },
      {
        name: "Chicken Fried Rice",
        category: "Rice Dish",
        country: "China",
        ingredients: [
          { name: "Chicken Breast", amount: 250, unit: "grams" },
          { name: "Rice", amount: 200, unit: "grams" },
          { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
          { name: "Ginger", amount: 1, unit: "teaspoon" },
          { name: "Carrots", amount: 2, unit: "units" },
          { name: "Bell Pepper", amount: 1, unit: "unit" },
        ],
      },
      {
        name: "Beef Stroganoff",
        category: "Meat Dish",
        country: "Russia",
        ingredients: [
          { name: "Beef", amount: 300, unit: "grams" },
          { name: "Tomatoes", amount: 4, unit: "units" },
          { name: "Onion", amount: 1, unit: "unit" },
          { name: "Olive Oil", amount: 1, unit: "tablespoon" },
          { name: "Salt", amount: 1, unit: "teaspoon" },
          { name: "Pepper", amount: 1, unit: "teaspoon" },
        ],
      },
      {
        name: "Mashed Potatoes",
        category: "Side Dish",
        country: "USA",
        ingredients: [
          { name: "Potatoes", amount: 3, unit: "units" },
          { name: "Butter", amount: 2, unit: "tablespoons" },
          { name: "Milk", amount: 200, unit: "ml" },
          { name: "Flour", amount: 100, unit: "grams" },
          { name: "Salt", amount: 1, unit: "teaspoon" },
          { name: "Pepper", amount: 1, unit: "teaspoon" },
        ],
      },
      {
        name: "Vegetable Stir Fry",
        category: "Vegetable Dish",
        country: "Thailand",
        ingredients: [
          { name: "Rice", amount: 200, unit: "grams" },
          { name: "Carrots", amount: 2, unit: "units" },
          { name: "Bell Pepper", amount: 1, unit: "unit" },
          { name: "Olive Oil", amount: 1, unit: "tablespoon" },
          { name: "Garlic", amount: 2, unit: "cloves" },
          { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
        ],
      },
    ];

    await Dish.insertMany(dishes);

    console.log("Database seeded with dummy data");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

module.exports = seedDatabase;
