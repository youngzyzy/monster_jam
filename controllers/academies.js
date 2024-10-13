const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Academies = require("../models/academies");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");
const { request } = require("express");

// @desc        Get all academies
// @route       GET /api/v1/academies
// @access      Public
exports.getAcademies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get a academy
// @route       GET /api/v1/academies/:id4
// @access      Public
exports.getAcademy = asyncHandler(async (req, res, next) => {
  const academy = await Academies.findById(req.params.id);
  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: academy });
});

// @desc        Create a academy
// @route       GET /api/v1/academies
// @access      Private
exports.createAcademy = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;

  // check for published academies
  const publishedAcademies = await Academies.findOne({ user: req.user.id });

  // if user not admin, can only create one academy
  if (publishedAcademies && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The User with ID ${req.user.id} has already published an academy`,
        400
      )
    );
  }

  const academy = await Academies.create(req.body);
  res.status(201).json({
    success: true,
    data: academy,
  });
});

// @desc        Update an academy
// @route       GET /api/v1/academies/:id
// @access      Private
exports.updateAcademy = asyncHandler(async (req, res, next) => {
  let academy = await Academies.findById(req.params.id);
  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
    );
  }
  // make sure owner is bootcamp owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  academy = await Academies.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: academy,
  });
});

// @desc        Delete an academy
// @route       GET /api/v1/academies/:id
// @access      Private
exports.deleteAcademy = asyncHandler(async (req, res, next) => {
  const academy = await Academies.findById(req.params.id);
  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
    );
  }
  // make sure owner is bootcamp owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }
  await academy.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc        Get academy within a radius
// @route       GET /api/v1/academies/radius/:zipcode/:distance
// @access      Private
exports.getAcademiesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat/lng from geocoder

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // divide distance by radius of earth
  // earth radius = 3,663 mi
  const radius = distance / 3963;

  const academies = await Academies.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: academies.length,
    data: academies,
  });
});

// @desc        Upload photo for academy
// @route       Put /api/v1/academies/:id/photo
// @access      Private
exports.academyPhotoUpload = asyncHandler(async (req, res, next) => {
  const academy = await Academies.findById(req.params.id);
  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
    );
  }

  // make sure owner is bootcamp owner
  if (academy.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  // make sure request is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // create custom file name
  file.name = `photo_${academy._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Academies.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
