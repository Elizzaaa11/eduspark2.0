const express = require('express');
const router = express.Router();

const {
  getMyClasses,
  getClassById,
  startClass,
  completeClass,
  updateRecording,
  markAttendance
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/my', protect, authorizeRoles('student', 'mentor'), getMyClasses);
router.get('/:id', protect, getClassById);
router.post('/:id/start', protect, authorizeRoles('mentor', 'admin'), startClass);
router.post('/:id/complete', protect, authorizeRoles('mentor', 'admin'), completeClass);
router.put('/:id/recording', protect, authorizeRoles('mentor', 'admin'), updateRecording);
router.post('/:id/attendance', protect, authorizeRoles('mentor', 'centre', 'admin'), markAttendance);

module.exports = router;
