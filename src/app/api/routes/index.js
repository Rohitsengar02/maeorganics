const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const reviewRoutes = require('./reviews');
const homePageSettingsRoutes = require('./homePageSettings');
const cartRoutes = require('./cart');
const couponRoutes = require('./coupons');
const addressRoutes = require('./addresses');
const orderRoutes = require('./orders');
const offlineOrderRoutes = require('./offlineOrders');
const contactRoutes = require('./contact');
const comboRoutes = require('./combos');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/homepage-settings', homePageSettingsRoutes);
router.use('/cart', cartRoutes);
router.use('/coupons', couponRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/offline-orders', offlineOrderRoutes);
router.use('/contact', contactRoutes);
router.use('/combos', comboRoutes);

module.exports = router;
