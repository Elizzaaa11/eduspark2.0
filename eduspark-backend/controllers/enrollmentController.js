const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const TimeSlot = require('../models/TimeSlot');
const Class = require('../models/Class');
const Payment = require('../models/Payment');

const generateRecurringClasses = async ({ enrollment, slot, course, startDate }) => {
  const start = new Date(startDate);
  const dayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0
  };

  const targetDay = dayMap[slot.dayOfWeek];
  let currentDate = new Date(start);
  const currentDay = currentDate.getDay();

  const diff = (targetDay - currentDay + 7) % 7;
  currentDate.setDate(currentDate.getDate() + diff);

  const classRecords = [];
  for (let i = 0; i < 4; i += 1) {
    const classDate = new Date(currentDate);
    classDate.setDate(classDate.getDate() + i * 7);

    classRecords.push({
      enrollment: enrollment._id,
      course: course._id,
      student: enrollment.student,
      mentor: enrollment.mentor,
      centre: enrollment.centre,
      mode: enrollment.mode,
      timeSlot: slot._id,
      scheduledDate: classDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'scheduled',
      meetingUrl: 'https://example.com/meeting',
      notes: ''
    });
  }

  return Class.insertMany(classRecords);
};

const createEnrollment = async (req, res, next) => {
  try {
    const { course: courseId, mode, timeSlot: timeSlotId, startDate, monthlyFee } = req.body;

    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can enroll in courses'
      });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or inactive'
      });
    }

    const existingActive = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: 'active'
    });

    if (existingActive) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active enrollment for this course'
      });
    }

    const slot = await TimeSlot.findById(timeSlotId);
    if (!slot || !slot.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is unavailable'
      });
    }

    if (mode === 'online' && (!slot.mentor || slot.mode !== 'online')) {
      return res.status(400).json({
        success: false,
        message: 'Online enrollment requires a valid online mentor slot'
      });
    }

    if (mode === 'offline' && (!slot.centre || slot.mode !== 'offline')) {
      return res.status(400).json({
        success: false,
        message: 'Offline enrollment requires a valid offline centre slot'
      });
    }

    if (slot.maxStudents && slot.currentStudents >= slot.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Selected slot is full'
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      mentor: mode === 'online' ? slot.mentor : null,
      centre: mode === 'offline' ? slot.centre : null,
      timeSlot: slot._id,
      mode,
      startDate,
      monthlyFee,
      nextPaymentDate: new Date(new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000)
    });

    slot.currentStudents += 1;
    if (slot.currentStudents >= slot.maxStudents) {
      slot.isAvailable = false;
    }
    await slot.save();

    await generateRecurringClasses({ enrollment, slot, course, startDate });

    await Payment.create({
      student: req.user._id,
      enrollment: enrollment._id,
      course: courseId,
      amount: monthlyFee,
      paymentDate: new Date(),
      paymentMethod: 'mock',
      transactionId: `EDU-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'pending',
      billingMonth: new Date().toISOString().slice(0, 7)
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title category mode monthlyFee')
      .populate('mentor', 'name email')
      .populate('centre', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Your enrollments retrieved successfully',
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course', 'title category mode monthlyFee')
      .populate('mentor', 'name email')
      .populate('centre', 'name email');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to access this enrollment'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment retrieved successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (req.user.role !== 'admin' && enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this enrollment'
      });
    }

    Object.assign(enrollment, req.body);
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

const unenrollStudent = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to unenroll this student'
      });
    }

    enrollment.status = 'cancelled';
    await enrollment.save();

    const slot = await TimeSlot.findById(enrollment.timeSlot);
    if (slot) {
      slot.currentStudents = Math.max(0, slot.currentStudents - 1);
      slot.isAvailable = true;
      await slot.save();
    }

    await Class.updateMany({ enrollment: enrollment._id }, { status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: 'Student unenrolled successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  updateEnrollment,
  unenrollStudent
};
