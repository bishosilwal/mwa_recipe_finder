const express = require("express");
const dishController = require("../controllers/dishController");
const router = express.Router();

router.get("/", dishController.getAllDishes);
router.get("/:id", dishController.getDishById);
router.post("/", dishController.createDish);
router.put("/:id", dishController.updateDish);
router.patch("/:id", dishController.partialUpdateDish);
router.delete("/:id", dishController.deleteDish);

module.exports = router;
