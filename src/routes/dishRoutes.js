const express = require("express");
const dishController = require("../controllers/dishController");
const router = express.Router();
const { authenticateUser } = require("../controllers/authenticationController");

router.get("/", dishController.getAllDishes);
router.get("/search", dishController.getBySearch);
router.get("/:id", dishController.getDishById);
router.post("/", authenticateUser, dishController.createDish);
router.put("/:id", authenticateUser, dishController.updateDish);
router.patch("/:id", authenticateUser, dishController.partialUpdateDish);
router.delete("/:id", authenticateUser, dishController.deleteDish);

module.exports = router;
