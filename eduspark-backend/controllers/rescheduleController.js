const Class = require('../models/Class');
const TimeSlot = require('../models/TimeSlot');

const rescheduleClass = async (req, res, next) => {
  try {
    const { newDate, newStartTime, newEndTime, reason } = req.body;
    const currentClass = await Class.findById(req.params.id).populate('timeSlot');

    if (!currentClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (currentClass.mode !== 'online') {
      return res.status(400).json({
        success: false,
        message: 'Only online classes can be rescheduled'
      });
    }

    if (req.user.role !== 'student' && req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only student, mentor, or admin can request a reschedule'
      });
    }

    if (newStartTime >= newEndTime) {
      return res.status(400).json({
        success: false,
        message: 'New end time must be after new start time'
      });
    }

    const newScheduledDate = new Date(newDate);
    if (Number.isNaN(newScheduledDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'New date is invalid'
      });
    }

    const existingSlot = await TimeSlot.findOne({
      mentor: currentClass.mentor,
      mode: 'online',
      dayOfWeek: new Date(newScheduledDate).toLocaleDateString('en-US', { weekday: 'long' }),
      startTime: newStartTime,
      endTime: newEndTime
    });

    if (!existingSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected reschedule time is not available for the mentor'
      });
    }

    currentClass.isRescheduled = true;
    currentClass.status = 'rescheduled';
    currentClass.originalClassId = currentClass.originalClassId || currentClass._id;
    await currentClass.save();

    const replacementClass = await Class.create({
      enrollment: currentClass.enrollment,
      course: currentClass.course,
      student: currentClass.student,
      mentor: currentClass.mentor,
      centre: currentClass.centre,
      mode: currentClass.mode,
      timeSlot: currentClass.timeSlot,
      scheduledDate: newScheduledDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'scheduled',
      notes: reason || 'Rescheduled by request',
      isRescheduled: true,
      originalClassId: currentClass.originalClassId || currentClass._id,
      meetingUrl: currentClass.meetingUrl || 'https://example.com/meeting'
    });

    res.status(200).json({
      success: true,
      message: 'Class rescheduled successfully',
      data: {
        originalClass: currentClass,
        replacementClass
      }
    });
  } catch (error) {
    next(error);
  }
};

const catchUpClass = async (req, res, next) => {
  try {
    const classRecord = await Class.findById(req.params.id).populate('enrollment');

    if (!classRecord) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (classRecord.mode !== 'offline') {
      return res.status(400).json({
        success: false,
        message: 'Catch-up is only available for offline missed classes'
      });
    }

    const enrollment = await require('../models/Enrollment').findById(classRecord.enrollment);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (classRecord.status !== 'missed') {
      return res.status(400).json({
        success: false,
        message: 'Catch-up is only valid for missed classes'
      });
    }

    const originalDate = new Date(classRecord.scheduledDate);
    const catchUpDate = new Date(originalDate);
    catchUpDate.setDate(catchUpDate.getDate() + 7);
    catchUpDate.setHours(16, 30, 0, 0);

    const catchUpClass = await Class.create({
      enrollment: classRecord.enrollment,
      course: classRecord.course,
      student: classRecord.student,
      mentor: classRecord.mentor,
      centre: classRecord.centre,
      mode: classRecord.mode,
      timeSlot: classRecord.timeSlot,
      scheduledDate: catchUpDate,
      startTime: '16:30',
      endTime: '17:00',
      status: 'scheduled',
      notes: 'Catch-up session for missed class',
      originalClassId: classRecord._id,
      meetingUrl: 'https://example.com/catchup'
    });

    res.status(200).json({
      success: true,
      message: 'Catch-up class created successfully',
      data: catchUpClass
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rescheduleClass,
  catchUpClass
};
