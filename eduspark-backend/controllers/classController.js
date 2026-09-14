const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Enrollment = require('../models/Enrollment');

const getMyClasses = async (req, res, next) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : { mentor: req.user._id };
    const classes = await Class.find(query)
      .populate('course', 'title category')
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort({ scheduledDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      message: 'Classes retrieved successfully',
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const classRecord = await Class.findById(req.params.id)
      .populate('course', 'title category')
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (req.user.role !== 'admin' && classRecord.student.toString() !== req.user._id.toString() && classRecord.mentor && classRecord.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to access this class'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class retrieved successfully',
      data: classRecord
    });
  } catch (error) {
    next(error);
  }
};

const startClass = async (req, res, next) => {
  try {
    const classRecord = await Class.findById(req.params.id);

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors or admins can start a class'
      });
    }

    classRecord.status = 'scheduled';
    await classRecord.save();

    res.status(200).json({
      success: true,
      message: 'Class started successfully',
      data: classRecord
    });
  } catch (error) {
    next(error);
  }
};

const completeClass = async (req, res, next) => {
  try {
    const classRecord = await Class.findById(req.params.id);

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors or admins can complete a class'
      });
    }

    classRecord.status = 'completed';
    await classRecord.save();

    res.status(200).json({
      success: true,
      message: 'Class completed successfully',
      data: classRecord
    });
  } catch (error) {
    next(error);
  }
};

const updateRecording = async (req, res, next) => {
  try {
    const { recordingUrl } = req.body;
    const classRecord = await Class.findById(req.params.id);

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors or admins can add recording URLs'
      });
    }

    classRecord.recordingUrl = recordingUrl || classRecord.recordingUrl;
    await classRecord.save();

    res.status(200).json({
      success: true,
      message: 'Recording URL added successfully',
      data: classRecord
    });
  } catch (error) {
    next(error);
  }
};

const markAttendance = async (req, res, next) => {
  try {
    const { student, status, remarks } = req.body;
    const classRecord = await Class.findById(req.params.id);

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'centre' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to mark attendance'
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { class: classRecord._id, student },
      {
        class: classRecord._id,
        student,
        status,
        markedBy: req.user._id,
        remarks: remarks || ''
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (status === 'absent' && classRecord.mode === 'offline') {
      classRecord.status = 'missed';
      await classRecord.save();
    }

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyClasses,
  getClassById,
  startClass,
  completeClass,
  updateRecording,
  markAttendance
};
