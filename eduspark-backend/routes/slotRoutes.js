const express = require('express');
const router = express.Router();

const { createSlot, getMySlots, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { slotValidationRules } = require('../validators/slotValidator');

router.post('/', protect, authorizeRoles('mentor', 'centre'), slotValidationRules, validate, createSlot);
router.get('/', protect, authorizeRoles('mentor', 'centre'), getMySlots);
router.put('/:id', protect, authorizeRoles('mentor', 'centre'), updateSlot);
router.delete('/:id', protect, authorizeRoles('mentor', 'centre'), deleteSlot);

module.exports = router;
