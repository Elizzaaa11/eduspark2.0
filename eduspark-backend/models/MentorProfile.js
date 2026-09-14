const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      default: ''
    },
    qualifications: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      default: 0
    },
    courses: {
      type: [String],
      default: []
    },
    onlineAvailable: {
      type: Boolean,
      default: false
    },
    offlineAvailable: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: ''
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
