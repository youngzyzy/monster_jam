const ErrorResponse = require("../utils/errorResponse");
const Lesson = require("../models/lessons");
const asyncHandler = require("../middleware/async");

// @desc        Get all academies
// @route       GET /api/v1/lessons
// @route       GET /api/v1/academies/:academiesId/lessons
// @access      Public
exports.getLessons = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.academiesId) {
    query = Lesson.find({ academy: req.params.academiesId });
  } else {
    query = Lesson.find().populate({
      path: "academy",
      select: "name description",
    });
  }

  const lessons = await query;

  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons,
  });
});
