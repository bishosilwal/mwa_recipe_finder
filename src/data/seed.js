const Dish = require("../models/Dish");
const Ingredient = require("../models/Ingredient");

const seedDatabase = async () => {
  try {
    // Check if the database is empty
    const dishCount = await Dish.countDocuments();
    const ingredientCount = await Ingredient.countDocuments();

    if (dishCount > 0 || ingredientCount > 0) {
      console.log("Database already seeded");
      return;
    }

    // Create dummy ingredients
    const ingredients = [
      { name: "Spaghetti", amount: 200, unit: "grams" },
      { name: "Bacon", amount: 100, unit: "grams" },
      { name: "Parmesan Cheese", amount: 50, unit: "grams" },
      { name: "Eggs", amount: 2, unit: "units" },
      { name: "Olive Oil", amount: 1, unit: "tablespoon" },
      { name: "Garlic", amount: 2, unit: "cloves" },
      { name: "Tomatoes", amount: 4, unit: "units" },
      { name: "Onion", amount: 1, unit: "unit" },
      { name: "Chicken Breast", amount: 250, unit: "grams" },
      { name: "Rice", amount: 200, unit: "grams" },
      { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
      { name: "Ginger", amount: 1, unit: "teaspoon" },
      { name: "Carrots", amount: 2, unit: "units" },
      { name: "Bell Pepper", amount: 1, unit: "unit" },
      { name: "Beef", amount: 300, unit: "grams" },
      { name: "Potatoes", amount: 3, unit: "units" },
      { name: "Butter", amount: 2, unit: "tablespoons" },
      { name: "Milk", amount: 200, unit: "ml" },
      { name: "Flour", amount: 100, unit: "grams" },
      { name: "Salt", amount: 1, unit: "teaspoon" },
      { name: "Pepper", amount: 1, unit: "teaspoon" },
    ];

    const savedIngredients = await Promise.all(
      ingredients.map(async (ingredient) => {
        let newIngredient = new Ingredient(ingredient);
        return await newIngredient.save();
      })
    );

    // Create dummy dishes
    const dishes = [
      {
        name: "Spaghetti Carbonara",
        category: "Pasta",
        country: "Italy",
        ingredients: [
          savedIngredients[0]._id, // Spaghetti
          savedIngredients[1]._id, // Bacon
          savedIngredients[2]._id, // Parmesan Cheese
          savedIngredients[3]._id, // Eggs
          savedIngredients[4]._id, // Olive Oil
          savedIngredients[5]._id, // Garlic
        ],
      },
      {
        name: "Chicken Fried Rice",
        category: "Rice Dish",
        country: "China",
        ingredients: [
          savedIngredients[8]._id, // Chicken Breast
          savedIngredients[9]._id, // Rice
          savedIngredients[10]._id, // Soy Sauce
          savedIngredients[11]._id, // Ginger
          savedIngredients[12]._id, // Carrots
          savedIngredients[13]._id, // Bell Pepper
        ],
      },
      {
        name: "Beef Stroganoff",
        category: "Meat Dish",
        country: "Russia",
        ingredients: [
          savedIngredients[14]._id, // Beef
          savedIngredients[6]._id, // Tomatoes
          savedIngredients[7]._id, // Onion
          savedIngredients[4]._id, // Olive Oil
          savedIngredients[19]._id, // Salt
          savedIngredients[20]._id, // Pepper
        ],
      },
      {
        name: "Mashed Potatoes",
        category: "Side Dish",
        country: "USA",
        ingredients: [
          savedIngredients[15]._id, // Potatoes
          savedIngredients[16]._id, // Butter
          savedIngredients[17]._id, // Milk
          savedIngredients[18]._id, // Flour
          savedIngredients[19]._id, // Salt
          savedIngredients[20]._id, // Pepper
        ],
      },
      {
        name: "Vegetable Stir Fry",
        category: "Vegetable Dish",
        country: "Thailand",
        ingredients: [
          savedIngredients[9]._id, // Rice
          savedIngredients[12]._id, // Carrots
          savedIngredients[13]._id, // Bell Pepper
          savedIngredients[4]._id, // Olive Oil
          savedIngredients[5]._id, // Garlic
          savedIngredients[10]._id, // Soy Sauce
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
