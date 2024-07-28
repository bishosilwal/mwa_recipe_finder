require("dotenv").config();
require("./src/data/db");

const express = require("express");

const dishRouter = require("./src/routes/dishRoutes");
const ingredientRouter = require("./src/routes/ingredientRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dishes", dishRouter);
app.use("/api/ingredients", ingredientRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
