const express = require('express');
const router = express.Router();

const { getAllUsers, verifyMentor, verifyCentre, getDashboardSummary } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/dashboard', protect, authorizeRoles('admin'), getDashboardSummary);
router.put('/mentors/:id/verify', protect, authorizeRoles('admin'), verifyMentor);
router.put('/centres/:id/verify', protect, authorizeRoles('admin'), verifyCentre);

module.exports = router;
