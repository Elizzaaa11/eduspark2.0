const { body, query } = require('express-validator');

const createCourseValidationRules = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('description').trim().notEmpty().withMessage('Course description is required'),
  body('category').trim().notEmpty().withMessage('Course category is required'),
  body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid course level'),
  body('mode').isIn(['online', 'offline', 'both']).withMessage('Invalid course mode'),
  body('durationInWeeks').isInt({ min: 1 }).withMessage('Duration in weeks must be at least 1'),
  body('monthlyFee').isFloat({ min: 1 }).withMessage('Monthly fee must be a positive number')
];

const updateCourseValidationRules = [
  body('title').optional().trim().notEmpty().withMessage('Course title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Course description cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Course category cannot be empty'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid course level'),
  body('mode').optional().isIn(['online', 'offline', 'both']).withMessage('Invalid course mode'),
  body('durationInWeeks').optional().isInt({ min: 1 }).withMessage('Duration in weeks must be at least 1'),
  body('monthlyFee').optional().isFloat({ min: 1 }).withMessage('Monthly fee must be a positive number')
];

const courseFilterValidationRules = [
  query('category').optional().trim(),
  query('mode').optional().isIn(['online', 'offline', 'both']).withMessage('Invalid course mode'),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid course level'),
  query('minFee').optional().isFloat({ min: 0 }).withMessage('Minimum fee must be a valid number'),
  query('maxFee').optional().isFloat({ min: 0 }).withMessage('Maximum fee must be a valid number')
];

module.exports = {
  createCourseValidationRules,
  updateCourseValidationRules,
  courseFilterValidationRules
};
