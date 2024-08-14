require("dotenv").config();
require("./src/data/db");
const express = require("express");
var cors = require("cors");
const dishRouter = require("./src/routes/dishRoutes");
const ingredientRouter = require("./src/routes/ingredientRoutes");
const userRouter = require("./src/routes/userRoutes");

const app = express();

// CORS configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dishes", dishRouter);
app.use("/api/dishes/", ingredientRouter);
app.use("/api/users", userRouter);

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
