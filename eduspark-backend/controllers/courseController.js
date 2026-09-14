const Course = require('../models/Course');
const MentorProfile = require('../models/MentorProfile');
const Centre = require('../models/Centre');

const isVerifiedMentor = async (userId) => {
  const profile = await MentorProfile.findOne({ user: userId });
  return profile && profile.verificationStatus === 'verified';
};

const isVerifiedCentre = async (userId) => {
  const centre = await Centre.findOne({ user: userId });
  return centre && centre.verificationStatus === 'verified';
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, mode, durationInWeeks, monthlyFee, mentor, centre } = req.body;

    if (req.user.role === 'admin') {
      const course = await Course.create({
        title,
        description,
        category,
        level,
        mode,
        durationInWeeks,
        monthlyFee,
        mentor,
        centre
      });

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });
    }

    if (req.user.role === 'mentor') {
      const verified = await isVerifiedMentor(req.user._id);
      if (!verified) {
        return res.status(403).json({
          success: false,
          message: 'Only verified mentors can create courses'
        });
      }
    }

    if (req.user.role === 'centre') {
      const verified = await isVerifiedCentre(req.user._id);
      if (!verified) {
        return res.status(403).json({
          success: false,
          message: 'Only verified centres can create courses'
        });
      }
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'centre') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors, centres, or admins can create courses'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      mode,
      durationInWeeks,
      monthlyFee,
      mentor: req.user.role === 'mentor' ? req.user._id : mentor || null,
      centre: req.user.role === 'centre' ? req.user._id : centre || null
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const filters = { isActive: true };

    if (req.query.category) filters.category = req.query.category;
    if (req.query.mode) filters.mode = req.query.mode;
    if (req.query.level) filters.level = req.query.level;
    if (req.query.minFee || req.query.maxFee) {
      filters.monthlyFee = {};
      if (req.query.minFee) filters.monthlyFee.$gte = Number(req.query.minFee);
      if (req.query.maxFee) filters.monthlyFee.$lte = Number(req.query.maxFee);
    }

    const courses = await Course.find(filters)
      .populate('mentor', 'name email')
      .populate('centre', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('centre', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'admin') {
      const isMentorOwner = course.mentor && course.mentor.toString() === req.user._id.toString();
      const isCentreOwner = course.centre && course.centre.toString() === req.user._id.toString();

      if (!isMentorOwner && !isCentreOwner) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own course'
        });
      }
    }

    Object.assign(course, req.body);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'admin') {
      const isMentorOwner = course.mentor && course.mentor.toString() === req.user._id.toString();
      const isCentreOwner = course.centre && course.centre.toString() === req.user._id.toString();

      if (!isMentorOwner && !isCentreOwner) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own course'
        });
      }
    }

    course.isActive = false;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const searchCourses = async (req, res, next) => {
  try {
    const query = { isActive: true };

    if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.category) query.category = { $regex: req.query.category, $options: 'i' };
    if (req.query.level) query.level = req.query.level;
    if (req.query.mode) query.mode = req.query.mode;
    if (req.query.maxFee || req.query.minFee) {
      query.monthlyFee = {};
      if (req.query.minFee) query.monthlyFee.$gte = Number(req.query.minFee);
      if (req.query.maxFee) query.monthlyFee.$lte = Number(req.query.maxFee);
    }

    const courses = await Course.find(query)
      .populate('mentor', 'name email')
      .populate('centre', 'name email');

    const results = courses.map((course) => ({
      course,
      mentor: course.mentor,
      centre: course.centre,
      mode: course.mode,
      monthlyFee: course.monthlyFee,
      level: course.level,
      location: course.centre ? 'Centre-based' : 'Mentor-based'
    }));

    res.status(200).json({
      success: true,
      message: 'Courses found successfully',
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses
};
