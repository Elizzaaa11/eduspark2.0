const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    centre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    maxStudents: {
      type: Number,
      required: true,
      default: 1
    },
    currentStudents: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

timeSlotSchema.index({ mentor: 1, dayOfWeek: 1, startTime: 1 });
timeSlotSchema.index({ centre: 1, dayOfWeek: 1, startTime: 1 });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
