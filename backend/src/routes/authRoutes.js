const express = require('express');
const router = express.Router();

// Simple auth routes for now - can be expanded later
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'dummy-token-for-development'
  });
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com'
    }
  });
});

module.exports = router;
