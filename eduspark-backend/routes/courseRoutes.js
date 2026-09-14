const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  createCourseValidationRules,
  updateCourseValidationRules,
  courseFilterValidationRules
} = require('../validators/courseValidator');

router.get('/search', courseFilterValidationRules, validate, searchCourses);
router.get('/', courseFilterValidationRules, validate, getCourses);
router.post('/', protect, authorizeRoles('mentor', 'centre', 'admin'), createCourseValidationRules, validate, createCourse);
router.get('/:id', getCourseById);
router.put('/:id', protect, authorizeRoles('mentor', 'centre', 'admin'), updateCourseValidationRules, validate, updateCourse);
router.delete('/:id', protect, authorizeRoles('mentor', 'centre', 'admin'), deleteCourse);

module.exports = router;
