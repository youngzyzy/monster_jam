const ErrorResponse = require("../utils/errorResponse");
const Academies = require("../models/academies");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @desc        Get all academies
// @route       GET /api/v1/academies
// @access      Public
exports.getAcademies = asyncHandler(async (req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  console.log(queryStr);

  query = Academies.find(JSON.parse(queryStr)).populate("lessons");

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  // limit
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Academies.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // execute query
  const academies = await query;

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: academies.length,
    pagination,
    data: academies,
  });
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
  const academy = await Academies.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators4: true,
  });
  if (!academy) {
    return next(
      new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
    );
  }
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

  academy.remove();

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
