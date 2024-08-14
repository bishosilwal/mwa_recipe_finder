const routes = require("express").Router();
const userController = require("../controllers/userController");

routes.post("/", userController.createUser);
routes.post("/login", userController.loginUser);

module.exports = routes;
