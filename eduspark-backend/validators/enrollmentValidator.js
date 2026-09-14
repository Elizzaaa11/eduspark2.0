const { body } = require('express-validator');

const enrollmentValidationRules = [
  body('course').notEmpty().withMessage('Course ID is required'),
  body('mode').isIn(['online', 'offline']).withMessage('Mode must be online or offline'),
  body('timeSlot').notEmpty().withMessage('Time slot ID is required'),
  body('startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('monthlyFee').isFloat({ min: 1 }).withMessage('Monthly fee must be a positive number')
];

module.exports = { enrollmentValidationRules };
