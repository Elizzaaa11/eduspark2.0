const TimeSlot = require('../models/TimeSlot');
const Course = require('../models/Course');
const MentorProfile = require('../models/MentorProfile');
const Centre = require('../models/Centre');

const getSlotOwnerValidation = async (req, userRole) => {
  if (userRole === 'mentor') {
    const profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile || profile.verificationStatus !== 'verified') {
      return { valid: false, message: 'Only verified mentors can manage time slots' };
    }
    return { valid: true, mentor: req.user._id, centre: null };
  }

  if (userRole === 'centre') {
    const centreProfile = await Centre.findOne({ user: req.user._id });
    if (!centreProfile || centreProfile.verificationStatus !== 'verified') {
      return { valid: false, message: 'Only verified centres can manage time slots' };
    }
    return { valid: true, mentor: null, centre: req.user._id };
  }

  return { valid: false, message: 'Only mentors and centres can manage time slots' };
};

const createSlot = async (req, res, next) => {
  try {
    const { course, mode, dayOfWeek, startTime, endTime, maxStudents } = req.body;

    const ownerValidation = await getSlotOwnerValidation(req, req.user.role);
    if (!ownerValidation.valid) {
      return res.status(403).json({ success: false, message: ownerValidation.message });
    }

    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (mode === 'online' && req.user.role !== 'mentor') {
      return res.status(403).json({ success: false, message: 'Only mentors can create online slots' });
    }

    if (mode === 'offline' && req.user.role !== 'centre') {
      return res.status(403).json({ success: false, message: 'Only centres can create offline slots' });
    }

    if (mode === 'online' && courseDoc.mentor && courseDoc.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This mentor cannot create slots for another mentor course' });
    }

    if (mode === 'offline' && courseDoc.centre && courseDoc.centre.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'This centre cannot create slots for another centre course' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ success: false, message: 'Slot end time must be after start time' });
    }

    const slot = await TimeSlot.create({
      mentor: ownerValidation.mentor,
      centre: ownerValidation.centre,
      course,
      mode,
      dayOfWeek,
      startTime,
      endTime,
      maxStudents: mode === 'online' ? 1 : (maxStudents || 1),
      currentStudents: 0,
      isAvailable: true
    });

    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

const getMySlots = async (req, res, next) => {
  try {
    const filter = req.user.role === 'mentor' ? { mentor: req.user._id } : { centre: req.user._id };

    const slots = await TimeSlot.find(filter)
      .populate('course', 'title category mode monthlyFee')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      message: 'Slots retrieved successfully',
      data: slots
    });
  } catch (error) {
    next(error);
  }
};

const updateSlot = async (req, res, next) => {
  try {
    const slot = await TimeSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (req.user.role === 'mentor' && slot.mentor && slot.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update your own slots' });
    }

    if (req.user.role === 'centre' && slot.centre && slot.centre.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update your own slots' });
    }

    if (req.body.startTime && req.body.endTime && req.body.startTime >= req.body.endTime) {
      return res.status(400).json({ success: false, message: 'Slot end time must be after start time' });
    }

    Object.assign(slot, req.body);
    await slot.save();

    res.status(200).json({
      success: true,
      message: 'Slot updated successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    const slot = await TimeSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (req.user.role === 'mentor' && slot.mentor && slot.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own slots' });
    }

    if (req.user.role === 'centre' && slot.centre && slot.centre.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own slots' });
    }

    await slot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSlot,
  getMySlots,
  updateSlot,
  deleteSlot
};
