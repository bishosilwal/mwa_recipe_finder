const User = require("../models/User");
var bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.email || !user.password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        const newUser = new User(user);
        newUser
          .save()
          .then((savedUser) => {
            res.status(201).json({
              message: "User created successfully",
              user: savedUser,
            });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (result) {
        res.status(200).json({
          message: "Login successful",
          user: user,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, loginUser };
