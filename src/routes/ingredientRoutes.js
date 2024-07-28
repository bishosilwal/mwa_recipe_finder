const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const router = express.Router();

router.get("/", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);
router.post("/", ingredientController.createIngredient);
router.put("/:id", ingredientController.updateIngredient);
router.patch("/:id", ingredientController.partialUpdateIngredient);
router.delete("/:id", ingredientController.deleteIngredient);

module.exports = router;
