const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const router = express.Router();
const { authenticateUser } = require("../controllers/authenticationController");

router.get("/:dishId/ingredients/", ingredientController.getAllIngredients);
router.get("/:dishId/ingredients/:id", ingredientController.getIngredientById);
router.post(
  "/:dishId/ingredients/",
  authenticateUser,
  ingredientController.createIngredient
);
router.put(
  "/:dishId/ingredients/:id",
  authenticateUser,
  ingredientController.updateIngredient
);
router.patch(
  "/:dishId/ingredients/:id",
  authenticateUser,
  ingredientController.partialUpdateIngredient
);
router.delete(
  "/:dishId/ingredients/:id",
  authenticateUser,
  ingredientController.deleteIngredient
);

module.exports = router;
