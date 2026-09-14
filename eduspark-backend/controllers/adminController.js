const MentorProfile = require('../models/MentorProfile');
const Centre = require('../models/Centre');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');

const verifyMentor = async (req, res, next) => {
  try {
    const { verificationStatus } = req.body;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'verificationStatus must be either verified or rejected'
      });
    }

    const mentorProfile = await MentorProfile.findById(req.params.id).populate('user');

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    mentorProfile.verificationStatus = verificationStatus;
    await mentorProfile.save();

    res.status(200).json({
      success: true,
      message: `Mentor verification status updated to ${verificationStatus}`,
      data: mentorProfile
    });
  } catch (error) {
    next(error);
  }
};

const verifyCentre = async (req, res, next) => {
  try {
    const { verificationStatus } = req.body;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: 'verificationStatus must be either verified or rejected'
      });
    }

    const centre = await Centre.findById(req.params.id).populate('user');

    if (!centre) {
      return res.status(404).json({
        success: false,
        message: 'Centre not found'
      });
    }

    centre.verificationStatus = verificationStatus;
    await centre.save();

    res.status(200).json({
      success: true,
      message: `Centre verification status updated to ${verificationStatus}`,
      data: centre
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const [totalUsers, totalCourses, activeEnrollments, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments({ status: 'active' }),
      Payment.aggregate([
        { $match: { status: 'successful' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const summary = {
      totalUsers,
      totalCourses,
      activeEnrollments,
      totalRevenue: totalRevenue[0]?.total || 0,
      students: await User.countDocuments({ role: 'student' }),
      mentors: await User.countDocuments({ role: 'mentor' }),
      centres: await User.countDocuments({ role: 'centre' })
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyMentor,
  verifyCentre,
  getAllUsers,
  getDashboardSummary
};
