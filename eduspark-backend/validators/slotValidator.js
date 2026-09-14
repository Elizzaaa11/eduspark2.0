const { body } = require('express-validator');

const slotValidationRules = [
  body('course').notEmpty().withMessage('Course ID is required'),
  body('mode').isIn(['online', 'offline']).withMessage('Mode must be online or offline'),
  body('dayOfWeek').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day of week'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Start time must be in HH:MM 24-hour format'),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('End time must be in HH:MM 24-hour format'),
  body('maxStudents').optional().isInt({ min: 1 }).withMessage('Max students must be at least 1')
];

module.exports = { slotValidationRules };
