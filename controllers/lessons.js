const ErrorResponse = require("../utils/errorResponse");
const Lesson = require("../models/lessons");
const asyncHandler = require("../middleware/async");
const Academies = require("../models/academies");

// @desc        Get all lessons
// @route       GET /api/v1/lessons
// @route       GET /api/v1/academies/:academiesId/lessons
// @access      Public
exports.getLessons = asyncHandler(async (req, res, next) => {
  if (req.params.academiesId) {
    const lessons = await Lesson.find({ academy: req.params.academiesId });
    return res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @desc        Get single lesson
// @route       GET /api/v1/lessons/:id
// @access      Public
exports.getLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: "academy",
    select: "name description",
  });

  if (!lesson) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: lesson,
  });
});
// @desc        Add course
// @route       POST /api/v1/academies/:academiesId/lessons
// @access      Public
exports.addLesson = asyncHandler(async (req, res, next) => {
  req.body.academy = req.params.academiesId;
  req.body.user = req.user.id;

  const academy = await Academies.findById(req.params.academiesId);

  if (!academy) {
    return next(
      new ErrorResponse(`No academy with the id of ${req.params.academiesId}`),
      404
    );
  }
  // make sure owner is bootcamp owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to this academy${academy._id}`,
        401
      )
    );
  }

  const lesson = await Lesson.create(req.body);

  res.status(200).json({
    success: true,
    data: lesson,
  });
});

// @desc        Update lesson
// @route       Put /api/v1/lessons/:id
// @access      Private
exports.updateLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${req.params.id}`),
      404
    );
  }
  // make sure user is course owner
  console.log(lesson);
  if (lesson.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update lesson ${lesson._id}`,
        401
      )
    );
  }
  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: lesson,
  });
});
// @desc        Delete lesson
// @route       Put /api/v1/lessons/:id
// @access      Private
exports.deleteLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(
      new ErrorResponse(`No lesson with the id of ${req.params.id}`),
      404
    );
  }

  // make sure user is course owner
  if (lesson.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update delete lesson${lesson._id}`,
        401
      )
    );
  }
  await lesson.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
