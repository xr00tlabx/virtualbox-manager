const express = require('express');
const { body } = require('express-validator');
const snapshotController = require('../controllers/snapshotController');
const router = express.Router();

// Validation middleware
const createSnapshotValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Snapshot name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Snapshot name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateSnapshotValidation = [
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('schedule.enabled')
    .optional()
    .isBoolean()
    .withMessage('Schedule enabled must be a boolean'),
  
  body('schedule.frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid schedule frequency'),
  
  body('schedule.maxSnapshots')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Max snapshots must be between 1 and 30')
];

// Routes
router.get('/', snapshotController.getAllSnapshots);
router.get('/:id', snapshotController.getSnapshotById);
router.put('/:id', updateSnapshotValidation, snapshotController.updateSnapshot);
router.delete('/:id', snapshotController.deleteSnapshot);

// Snapshot operations
router.post('/:id/restore', snapshotController.restoreSnapshot);

// VM-specific snapshot routes
router.get('/vm/:vmId', snapshotController.getVMSnapshots);
router.post('/vm/:vmId', createSnapshotValidation, snapshotController.createSnapshot);
router.post('/vm/:vmId/sync', snapshotController.syncSnapshots);

module.exports = router;
