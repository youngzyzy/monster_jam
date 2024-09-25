const express = require("express");
const {
  getAcademies,
  getAcademy,
  createAcademy,
  updateAcademy,
  deleteAcademy,
} = require("../controllers/academies");
const router = express.Router();

router.route("/").get(getAcademies).post(createAcademy);

router.route("/:id").get(getAcademy).put(updateAcademy).delete(deleteAcademy);

module.exports = router;
