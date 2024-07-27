const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", function () {
  console.log("connected to db " + process.env.DB_NAME);
});

mongoose.connection.on("disconnected", function () {
  console.log("disconnected from db " + process.env.DB_NAME);
});

mongoose.connection.on("error", function (err) {
  console.log("error in db connection " + err);
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(process.env.SIGINT_MESSAGE);
    process.exit(0);
  });
});

process.on("SIGTERM", function () {
  mongoose.connection.close(function () {
    console.log(process.env.SIGTERM_MESSAGE);
    process.exit(0);
  });
});

module.exports = mongoose;
