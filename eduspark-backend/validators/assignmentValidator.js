const { body } = require('express-validator');

const createAssignmentValidationRules = [
  body('title').trim().notEmpty().withMessage('Assignment title is required'),
  body('description').trim().notEmpty().withMessage('Assignment description is required'),
  body('course').notEmpty().withMessage('Course is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  body('maxMarks').optional().isFloat({ min: 1 }).withMessage('Max marks must be a positive number')
];

const updateAssignmentValidationRules = [
  body('title').optional().trim().notEmpty().withMessage('Assignment title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Assignment description cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('maxMarks').optional().isFloat({ min: 1 }).withMessage('Max marks must be a positive number')
];

const submitAssignmentValidationRules = [
  body('content').optional().trim(),
  body('fileUrl').optional().isURL().withMessage('Submission file URL must be valid')
];

const gradeSubmissionValidationRules = [
  body('grade').isFloat({ min: 0 }).withMessage('Grade must be 0 or greater'),
  body('feedback').optional().trim().notEmpty().withMessage('Feedback cannot be empty')
];

module.exports = {
  createAssignmentValidationRules,
  updateAssignmentValidationRules,
  submitAssignmentValidationRules,
  gradeSubmissionValidationRules
};
