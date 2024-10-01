const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({
  path: "./config/config.env",
});

const Academies = require("./models/academies");
const Lessons = require("./models/lessons");

// connect to db
mongoose.connect(process.env.MONGO_URI);

// read json files
const academies = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/academies.json`),
  "utf-8"
);

// read json files
const lessons = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/lessons.json`),
  "utf-8"
);

// import into DB
const importData = async () => {
  try {
    await Academies.create(academies);
    await Lessons.create(lessons);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// delete data
const deleteData = async () => {
  try {
    await Academies.deleteMany();
    await Lessons.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
