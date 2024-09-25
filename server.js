const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");

// load env vars
dotenv.config({
  path: "./config/config.env",
});

// connect to db
connectDB();

//route files
const academies = require("./routes/academies");
const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// mount routers
app.use("/api/v1/academies", academies);

const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// handle unhandeled promise rejections
process.on("unhandeledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});
