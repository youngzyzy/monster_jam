const ErrorResponse = require("../utils/errorResponse");
const Academies = require("../models/academies");

// @desc        Get all academies
// @route       GET /api/v1/academies
// @access      Public
exports.getAcademies = async (req, res, next) => {
  try {
    const academies = await Academies.find();

    res.status(200).json({
      success: true,
      count: academies.length,
      data: academies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc        Get a academy
// @route       GET /api/v1/academies/:id
// @access      Public
exports.getAcademy = async (req, res, next) => {
  try {
    const academy = await Academies.findById(req.params.id);
    if (!academy) {
      return next(
        new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: academy });
  } catch (error) {
    next(error);
  }
};

// @desc        Create a academy
// @route       GET /api/v1/academies
// @access      Private
exports.createAcademy = async (req, res, next) => {
  try {
    const academy = await Academies.create(req.body);
    res.status(201).json({
      success: true,
      data: academy,
    });
  } catch (error) {
    console.log("hitting create error");
    next(error);
  }
};

// @desc        Update an academy
// @route       GET /api/v1/academies/:id
// @access      Private
exports.updateAcademy = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc        Delete an academy
// @route       GET /api/v1/academies/:id
// @access      Private
exports.deleteAcademy = async (req, res, next) => {
  try {
    const academy = await Academies.findByIdAndDelete(req.params.id);
    if (!academy) {
      return next(
        new ErrorResponse(`Academy not found with ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
