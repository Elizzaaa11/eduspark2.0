const express = require('express');
const router = express.Router();

const { createOrUpdateMentorProfile, getAllMentors, getMentorById } = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/profile', protect, authorizeRoles('mentor'), createOrUpdateMentorProfile);
router.get('/', protect, authorizeRoles('admin', 'student'), getAllMentors);
router.get('/:id', protect, authorizeRoles('admin', 'student', 'mentor'), getMentorById);
router.put('/profile', protect, authorizeRoles('mentor'), createOrUpdateMentorProfile);

module.exports = router;
