const express = require("express");
const {
  getAcademies,
  getAcademy,
  createAcademy,
  updateAcademy,
  deleteAcademy,
  getAcademiesInRadius,
} = require("../controllers/academies");

// include other resouse routers
const lessonsRouter = require("./lessons");

const router = express.Router();

// reroute into other resource routers
router.use("/:academiesId/lessons", lessonsRouter);

router.route("/radius/:zipcode/:distance").get(getAcademiesInRadius);

router.route("/").get(getAcademies).post(createAcademy);

router.route("/:id").get(getAcademy).put(updateAcademy).delete(deleteAcademy);

module.exports = router;
