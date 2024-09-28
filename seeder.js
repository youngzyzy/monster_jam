const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({
  path: "./config/config.env",
});

const Academies = require("./models/academies");

// connect to db
mongoose.connect(process.env.MONGO_URI);

// read josn files
const academies = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/academies.json`),
  "utf-8"
);

// import into DB
const importData = async () => {
  try {
    await Academies.create(academies);

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
