const express = require("express");
const {
  getAcademies,
  getAcademy,
  createAcademy,
  updateAcademy,
  deleteAcademy,
  getAcademiesInRadius,
  academyPhotoUpload,
} = require("../controllers/academies");

const Academies = require("../models/academies");

// include other resouse routers
const lessonsRouter = require("./lessons");
const reviewRouter = require("./reviews");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// reroute into other resource routers
router.use("/:academiesId/lessons", lessonsRouter);
router.use("/:academiesId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getAcademiesInRadius);

router
  .route("/")
  .get(advancedResults(Academies, "lessons"), getAcademies)
  .post(protect, authorize("publisher", "admin"), createAcademy);

router
  .route("/:id")
  .get(getAcademy)
  .put(protect, authorize("publisher", "admin"), updateAcademy)
  .delete(protect, authorize("publisher", "admin"), deleteAcademy);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), academyPhotoUpload);

module.exports = router;
