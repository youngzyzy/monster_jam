const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/review");
const asyncHandler = require("../middleware/async");
const Academies = require("../models/academies");

// @desc        Get all reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/academies/:academiesId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.academiesId) {
    const reviews = await Review.find({ academy: req.params.academiesId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @desc        Get all reviews
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "academy",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});
// @desc        Add Review
// @route       POSt /api/v1/academies/:academiesId/reviews
// @access      Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.academy = req.params.academiesId;
  req.body.user = req.user.id;

  const academy = await Academies.findById(req.params.academiesId);

  if (!academy) {
    return next(
      new ErrorResponse(
        `No academy exists with id of ${req.params.academiesId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  console.log(review);
  res.status(201).json({
    success: true,
    data: review,
  });
});
// @desc        Update Review
// @route       Put /api/v1/reviews/:id
// @access      Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review exists with id of ${req.params.id}`, 404)
    );
  }
  // make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});
// @desc        Delete Review
// @route       Put /api/v1/reviews/:id
// @access      Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review exists with id of ${req.params.id}`, 404)
    );
  }
  // make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }
  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
