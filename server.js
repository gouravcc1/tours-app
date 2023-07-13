const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("unCaught exception");
    process.exit(1);
});
dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATA_BASE.replace(
  "PASSWORD",
  process.env.DATA_BASE_PASSWORD
  );
  mongoose
  .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
        console.log("success conection");
    });
    const server = app.listen(8000, "127.0.0.1", () => {
  console.log("app is working");
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("unhandled rejection");
    server.close(() => {
      process.exit(1);
    });
  });
