const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const router = express.Router();


router.get("/:dishId/ingredients/", ingredientController.getAllIngredients);
router.get("/:dishId/ingredients/:id", ingredientController.getIngredientById);
router.post("/:dishId/ingredients/", ingredientController.createIngredient);
router.put("/:dishId/ingredients/:id", ingredientController.updateIngredient);
router.patch(
  "/:dishId/ingredients/:id",
  ingredientController.partialUpdateIngredient
);
router.delete(
  "/:dishId/ingredients/:id",
  ingredientController.deleteIngredient
);

module.exports = router;
