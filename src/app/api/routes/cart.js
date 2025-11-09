const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.route('/')
  .get(verifyToken, getCart)
  .post(verifyToken, addItemToCart);

router.route('/:itemId')
  .delete(verifyToken, removeItemFromCart);

module.exports = router;
