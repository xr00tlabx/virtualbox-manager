const express = require('express');
const { body } = require('express-validator');
const vmController = require('../controllers/vmController');
const router = express.Router();

// Validation middleware
const createVMValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('VM name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('VM name must be between 1 and 100 characters'),
  
  body('osType')
    .isIn(['Windows', 'Linux', 'MacOS', 'Other'])
    .withMessage('Invalid OS type'),
  
  body('memory')
    .isInt({ min: 512 })
    .withMessage('Memory must be at least 512 MB'),
  
  body('cpus')
    .isInt({ min: 1, max: 32 })
    .withMessage('CPU count must be between 1 and 32'),
  
  body('diskSize')
    .isInt({ min: 1 })
    .withMessage('Disk size must be at least 1 GB')
];

const updateVMValidation = [
  body('memory')
    .optional()
    .isInt({ min: 512 })
    .withMessage('Memory must be at least 512 MB'),
  
  body('cpus')
    .optional()
    .isInt({ min: 1, max: 32 })
    .withMessage('CPU count must be between 1 and 32')
];

// Routes
router.get('/', vmController.getAllVMs);
router.get('/:id', vmController.getVMById);
router.post('/', createVMValidation, vmController.createVM);
router.put('/:id', updateVMValidation, vmController.updateVM);
router.delete('/:id', vmController.deleteVM);

// VM control operations
router.post('/:id/start', vmController.startVM);
router.post('/:id/stop', vmController.stopVM);
router.post('/:id/restart', vmController.restartVM);
router.post('/:id/pause', vmController.pauseVM);
router.post('/:id/resume', vmController.resumeVM);

// VM utilities
router.get('/:id/screenshot', vmController.getVMScreenshot);
router.post('/:id/execute', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('command').notEmpty().withMessage('Command is required')
], vmController.executeCommand);

module.exports = router;
