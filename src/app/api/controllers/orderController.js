const Order = require('../models/Order');

// Create order
exports.createOrder = async (req, res) => {
  console.log('[ORDER] Create order - START');
  try {
    const userId = req.user.id;
    const { items, address, payment, amounts, coupon, notes } = req.body;

    console.log('[ORDER] User ID:', userId);
    console.log('[ORDER] Items count:', items?.length);
    console.log('[ORDER] Items:', JSON.stringify(items, null, 2));

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!address || !payment || !amounts) {
      return res.status(400).json({ success: false, message: 'Address, payment and amounts are required' });
    }

    const order = await Order.create({
      userId,
      items,
      address,
      payment,
      amounts,
      coupon: coupon || null,
      notes: notes || ''
    });

    console.log('[ORDER] Order created successfully:', order._id);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('[ORDER] Create order error:', error);
    console.error('[ORDER] Error message:', error.message);
    console.error('[ORDER] Error stack:', error.stack);
    if (error.name === 'ValidationError') {
      console.error('[ORDER] Validation errors:', error.errors);
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ADMIN: Get single order by ID (no user scoping)
exports.adminGetOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: Update any order status
exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single order by ID (no user scoping per requirement)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update order status (simple user cancel allowed)
exports.updateOrder = async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status; // e.g., 'cancelled'
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete order (optional; allow only if still created/cancelled)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user.id, status: { $in: ['created', 'cancelled'] } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found or cannot be deleted' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
