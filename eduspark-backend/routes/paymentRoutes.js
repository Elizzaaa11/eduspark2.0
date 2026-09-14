const express = require('express');
const router = express.Router();

const { getMyPayments, createMockPayment, getPaymentSummary } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/my', protect, authorizeRoles('student'), getMyPayments);
router.post('/mock', protect, authorizeRoles('student', 'admin'), createMockPayment);
router.get('/summary', protect, authorizeRoles('admin'), getPaymentSummary);

module.exports = router;
