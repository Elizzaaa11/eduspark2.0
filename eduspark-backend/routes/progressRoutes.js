const express = require('express');
const router = express.Router();

const { updateProgress, getMyProgress, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/update', protect, authorizeRoles('student'), updateProgress);
router.get('/my', protect, authorizeRoles('student'), getMyProgress);
router.get('/course/:courseId', protect, authorizeRoles('mentor', 'admin'), getCourseProgress);

module.exports = router;
