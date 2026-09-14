const MentorProfile = require('../models/MentorProfile');
const User = require('../models/User');

const createOrUpdateMentorProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can create or update a mentor profile'
      });
    }

    const profileData = {
      ...req.body,
      user: req.user._id
    };

    const existingProfile = await MentorProfile.findOne({ user: req.user._id });

    let profile;
    if (existingProfile) {
      profile = await MentorProfile.findByIdAndUpdate(
        existingProfile._id,
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      profile = await MentorProfile.create(profileData);
    }

    res.status(existingProfile ? 200 : 201).json({
      success: true,
      message: existingProfile ? 'Mentor profile updated successfully' : 'Mentor profile created successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const getAllMentors = async (req, res, next) => {
  try {
    const mentors = await MentorProfile.find()
      .populate('user', 'name email phone role isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Mentors retrieved successfully',
      data: mentors
    });
  } catch (error) {
    next(error);
  }
};

const getMentorById = async (req, res, next) => {
  try {
    const mentor = await MentorProfile.findById(req.params.id).populate('user', 'name email phone role isActive');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mentor profile retrieved successfully',
      data: mentor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateMentorProfile,
  getAllMentors,
  getMentorById
};
