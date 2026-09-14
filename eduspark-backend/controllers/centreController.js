const Centre = require('../models/Centre');

const createOrUpdateCentreProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'centre') {
      return res.status(403).json({
        success: false,
        message: 'Only centres can create or update a centre profile'
      });
    }

    const centreData = {
      ...req.body,
      user: req.user._id
    };

    const existingCentre = await Centre.findOne({ user: req.user._id });

    let centre;
    if (existingCentre) {
      centre = await Centre.findByIdAndUpdate(
        existingCentre._id,
        centreData,
        { new: true, runValidators: true }
      );
    } else {
      centre = await Centre.create(centreData);
    }

    res.status(existingCentre ? 200 : 201).json({
      success: true,
      message: existingCentre ? 'Centre profile updated successfully' : 'Centre profile created successfully',
      data: centre
    });
  } catch (error) {
    next(error);
  }
};

const getAllCentres = async (req, res, next) => {
  try {
    const centres = await Centre.find()
      .populate('user', 'name email phone role isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Centres retrieved successfully',
      data: centres
    });
  } catch (error) {
    next(error);
  }
};

const getCentreById = async (req, res, next) => {
  try {
    const centre = await Centre.findById(req.params.id).populate('user', 'name email phone role isActive');

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: 'Centre profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Centre profile retrieved successfully',
      data: centre
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateCentreProfile,
  getAllCentres,
  getCentreById
};
