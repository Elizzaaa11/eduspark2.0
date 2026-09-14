const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
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
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      default: null
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'completed'],
      default: 'active'
    },
    monthlyFee: {
      type: Number,
      required: true
    },
    nextPaymentDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.index({ student: 1, course: 1, status: 1 });

enrollmentSchema.index({ timeSlot: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
