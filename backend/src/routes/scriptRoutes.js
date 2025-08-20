const express = require('express');
const { body } = require('express-validator');
const scriptController = require('../controllers/scriptController');
const router = express.Router();

// Validation middleware
const createScriptValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Script name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Script name must be between 1 and 100 characters'),
  
  body('type')
    .isIn(['powershell', 'batch', 'vbs', 'javascript', 'bash'])
    .withMessage('Invalid script type'),
  
  body('content')
    .notEmpty()
    .withMessage('Script content is required')
    .isLength({ max: 50000 })
    .withMessage('Script content cannot exceed 50000 characters'),
  
  body('trigger')
    .isIn(['startup', 'shutdown', 'manual', 'scheduled'])
    .withMessage('Invalid script trigger'),
  
  body('timeout')
    .optional()
    .isInt({ min: 1, max: 3600 })
    .withMessage('Timeout must be between 1 and 3600 seconds'),
  
  body('executionOrder')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Execution order must be between 0 and 100')
];

const updateScriptValidation = [
  body('content')
    .optional()
    .isLength({ max: 50000 })
    .withMessage('Script content cannot exceed 50000 characters'),
  
  body('trigger')
    .optional()
    .isIn(['startup', 'shutdown', 'manual', 'scheduled'])
    .withMessage('Invalid script trigger'),
  
  body('timeout')
    .optional()
    .isInt({ min: 1, max: 3600 })
    .withMessage('Timeout must be between 1 and 3600 seconds'),
  
  body('executionOrder')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Execution order must be between 0 and 100')
];

const executeScriptValidation = [
  body('vmId')
    .optional()
    .isMongoId()
    .withMessage('Invalid VM ID'),
  
  body('environment')
    .optional()
    .isObject()
    .withMessage('Environment must be an object')
];

// Routes
router.get('/', scriptController.getAllScripts);
router.get('/:id', scriptController.getScriptById);
router.post('/', createScriptValidation, scriptController.createScript);
router.put('/:id', updateScriptValidation, scriptController.updateScript);
router.delete('/:id', scriptController.deleteScript);

// Script execution
router.post('/:id/execute', executeScriptValidation, scriptController.executeScript);

// Script statistics and history
router.get('/:id/history', scriptController.getExecutionHistory);
router.get('/:id/stats', scriptController.getScriptStats);

module.exports = router;
