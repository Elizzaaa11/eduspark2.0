const Progress = require('../models/Progress');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');

const updateProgress = async (req, res, next) => {
  try {
    const { courseId, completedLessons, totalLessons, attendanceRate } = req.body;

    const courseEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: 'active'
    });

    if (!courseEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'Active course enrollment not found'
      });
    }

    const submissions = await Submission.find({
      student: req.user._id,
      course: courseId,
      grade: { $ne: null }
    });

    const assignmentAverage = submissions.length
      ? submissions.reduce((sum, item) => sum + (item.grade || 0), 0) / submissions.length
      : 0;

    const completedLessonsValue = Number(completedLessons || 0);
    const totalLessonsValue = Number(totalLessons || 0);
    const attendanceRateValue = Number(attendanceRate || 0);
    const progressPercent = totalLessonsValue
      ? Math.min(100, (completedLessonsValue / totalLessonsValue) * 100)
      : 0;

    const overallProgress = Math.min(
      100,
      (progressPercent * 0.5) + (attendanceRateValue * 0.3) + (assignmentAverage * 0.2)
    );

    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, course: courseId },
      {
        student: req.user._id,
        course: courseId,
        completedLessons: completedLessonsValue,
        totalLessons: totalLessonsValue,
        attendanceRate: attendanceRateValue,
        assignmentAverage,
        overallProgress,
        lastUpdated: new Date(),
        status: overallProgress >= 100 ? 'completed' : overallProgress > 0 ? 'in_progress' : 'not_started'
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

const getMyProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ student: req.user._id }).populate('course', 'title category');

    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ course: req.params.courseId }).populate('student', 'name email');

    res.status(200).json({
      success: true,
      message: 'Course progress retrieved successfully',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProgress,
  getMyProgress,
  getCourseProgress
};
