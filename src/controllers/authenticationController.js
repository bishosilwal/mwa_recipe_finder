const jwt = require("jsonwebtoken");

const authenticateHeaderToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) throw new Error("Authentication error");
    next();
  });
};

module.exports = { authenticateUser: authenticateHeaderToken };
