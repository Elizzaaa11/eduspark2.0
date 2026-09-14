const express = require('express');
const router = express.Router();

const { createOrUpdateCentreProfile, getAllCentres, getCentreById } = require('../controllers/centreController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/profile', protect, authorizeRoles('centre'), createOrUpdateCentreProfile);
router.get('/', protect, authorizeRoles('admin', 'student'), getAllCentres);
router.get('/:id', protect, authorizeRoles('admin', 'student', 'centre'), getCentreById);
router.put('/profile', protect, authorizeRoles('centre'), createOrUpdateCentreProfile);

module.exports = router;
