const express = require("express");
const {
  getLessons,
  getLesson,
  addCourse,
  addLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessons");

const Lessons = require("../models/lessons");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Lessons, {
      path: "academy",
      select: "name description",
    }),
    getLessons
  )
  .post(protect, authorize("publisher", "admin"), addLesson);
router
  .route("/:id")
  .get(getLessons)
  .put(protect, authorize("publisher", "admin"), updateLesson)
  .delete(protect, authorize("publisher", "admin"), deleteLesson);

module.exports = router;
