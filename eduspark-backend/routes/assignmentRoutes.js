const express = require('express');
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getMySubmission
} = require('../controllers/assignmentController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  createAssignmentValidationRules,
  updateAssignmentValidationRules,
  submitAssignmentValidationRules,
  gradeSubmissionValidationRules
} = require('../validators/assignmentValidator');

router.get('/my-submissions', protect, authorizeRoles('student'), getMySubmission);
router.get('/', getAssignments);
router.post('/', protect, authorizeRoles('mentor', 'admin'), createAssignmentValidationRules, validate, createAssignment);
router.get('/:id', getAssignmentById);
router.put('/:id', protect, authorizeRoles('mentor', 'admin'), updateAssignmentValidationRules, validate, updateAssignment);
router.delete('/:id', protect, authorizeRoles('mentor', 'admin'), deleteAssignment);
router.post('/:id/submit', protect, authorizeRoles('student'), submitAssignmentValidationRules, validate, submitAssignment);
router.get('/:id/submissions', protect, authorizeRoles('mentor', 'admin'), getSubmissionsForAssignment);
router.put('/submissions/:submissionId/grade', protect, authorizeRoles('mentor', 'admin'), gradeSubmissionValidationRules, validate, gradeSubmission);

module.exports = router;
