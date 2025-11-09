const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');

const { verifyToken, isAdmin } = require('../middleware/auth');

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes - require authentication
router.get('/stats', verifyToken, isAdmin, getContactStats);
router.get('/', verifyToken, isAdmin, getAllContacts);
router.get('/:id', verifyToken, isAdmin, getContactById);
router.put('/:id', verifyToken, isAdmin, updateContact);
router.delete('/:id', verifyToken, isAdmin, deleteContact);

module.exports = router;
