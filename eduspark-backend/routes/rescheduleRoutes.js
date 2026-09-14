const express = require('express');
const router = express.Router();

const { rescheduleClass, catchUpClass } = require('../controllers/rescheduleController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/:id/reschedule', protect, authorizeRoles('student', 'mentor', 'admin'), rescheduleClass);
router.post('/:id/catchup', protect, authorizeRoles('student', 'mentor', 'centre', 'admin'), catchUpClass);

module.exports = router;
