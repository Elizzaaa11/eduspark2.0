const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      default: null
    },
    scheduledDate: {
      type: Date,
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
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'missed', 'rescheduled'],
      default: 'scheduled'
    },
    recordingUrl: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    isRescheduled: {
      type: Boolean,
      default: false
    },
    originalClassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null
    },
    meetingUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

classSchema.index({ student: 1, scheduledDate: 1 });
classSchema.index({ mentor: 1, scheduledDate: 1 });

module.exports = mongoose.model('Class', classSchema);
