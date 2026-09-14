const express = require('express');
const router = express.Router();

const {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  updateEnrollment,
  unenrollStudent
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { enrollmentValidationRules } = require('../validators/enrollmentValidator');

router.post('/', protect, authorizeRoles('student'), enrollmentValidationRules, validate, createEnrollment);
router.get('/my', protect, authorizeRoles('student'), getMyEnrollments);
router.get('/:id', protect, getEnrollmentById);
router.put('/:id', protect, authorizeRoles('student', 'admin'), updateEnrollment);
router.post('/:id/unenroll', protect, authorizeRoles('student'), unenrollStudent);

module.exports = router;
