const express = require('express');
const router = express.Router();
const {
  getCombos,
  getCombo,
  createCombo,
  updateCombo,
  deleteCombo,
  toggleActive,
  getComboStats,
  fixComboPrices
} = require('../controllers/comboController');

const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin routes (must come before dynamic :id routes)
router.get('/admin/stats', verifyToken, isAdmin, getComboStats);
router.post('/', verifyToken, isAdmin, createCombo);
router.put('/:id', verifyToken, isAdmin, updateCombo);
router.delete('/:id', verifyToken, isAdmin, deleteCombo);
router.patch('/:id/toggle-active', verifyToken, isAdmin, toggleActive);
router.post('/:id/fix-prices', verifyToken, isAdmin, fixComboPrices);

// Public routes
router.get('/', getCombos);
router.get('/:id', getCombo);

module.exports = router;
