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
    console.log(error);
    res.status(400).json({
      success: false,
    });
  }
};

// @desc        Get a academy
// @route       GET /api/v1/academies/:id
// @access      Public
exports.getAcademy = async (req, res, next) => {
  try {
    const academy = await Academies.findById(req.params.id);
    if (!academy) {
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({ success: true, data: academy });
  } catch (error) {
    res.status(400).json({ success: false });
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
    console.log(error);
    res.status(400).json({
      success: false,
    });
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
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: academy,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
    });
  }
};

// @desc        Delete an academy
// @route       GET /api/v1/academies/:id
// @access      Private
exports.deleteAcademy = async (req, res, next) => {
  try {
    const academy = await Academies.findByIdAndDelete(req.params.id);
    if (!academy) {
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
    });
  }
};
