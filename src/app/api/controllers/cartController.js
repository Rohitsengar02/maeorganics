const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.dbUser._id });
    
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }
    
    // Migration: Fix old cart items without itemType
    let needsSave = false;
    cart.items = cart.items.map(item => {
      if (!item.itemType) {
        needsSave = true;
        // If it has a product field, it's a product
        if (item.product) {
          item.itemType = 'product';
        } else if (item.combo) {
          item.itemType = 'combo';
        } else {
          // Invalid item, will be filtered out
          return null;
        }
      }
      return item;
    }).filter(item => item !== null);
    
    if (needsSave) {
      console.log('[CART] Migrating old cart items to new format');
      await cart.save();
    }
    
    // Now populate
    await cart.populate('items.product');
    await cart.populate({
      path: 'items.combo',
      populate: {
        path: 'products.product',
        select: 'name images'
      }
    });
    
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('[CART] Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addItemToCart = async (req, res) => {
  console.log('[CART] Add item to cart - START');
  console.log('[CART] Request body:', req.body);
  console.log('[CART] User:', req.user?.dbUser?.email);
  
  const { productId, comboId, quantity } = req.body;
  const itemType = comboId ? 'combo' : 'product';
  const itemId = comboId || productId;
  
  console.log('[CART] Item details:', { itemType, itemId, quantity });

  if (!itemId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Either productId or comboId is required' 
    });
  }

  try {
    console.log('[CART] Finding cart for user...');
    let cart = await Cart.findOne({ user: req.user.dbUser._id });

    if (cart) {
      // Cart exists for user
      let itemIndex = cart.items.findIndex(item => {
        if (itemType === 'combo') {
          return item.combo && item.combo.toString() === itemId;
        } else {
          return item.product && item.product.toString() === itemId;
        }
      });

      if (itemIndex > -1) {
        // Item exists in the cart, update the quantity
        cart.items[itemIndex].quantity = quantity;
      } else {
        // Item does not exist in cart, add new item
        const newItem = {
          quantity,
          itemType
        };
        if (itemType === 'combo') {
          newItem.combo = itemId;
        } else {
          newItem.product = itemId;
        }
        cart.items.push(newItem);
      }
      cart = await cart.save();
      await cart.populate('items.product');
      await cart.populate({
        path: 'items.combo',
        populate: {
          path: 'products.product',
          select: 'name images'
        }
      });
      return res.status(200).json({ success: true, data: cart });
    } else {
      // No cart for user, create new cart
      const newItem = {
        quantity,
        itemType
      };
      if (itemType === 'combo') {
        newItem.combo = itemId;
      } else {
        newItem.product = itemId;
      }
      const newCart = await Cart.create({
        user: req.user.dbUser._id,
        items: [newItem]
      });
      await newCart.populate('items.product');
      await newCart.populate({
        path: 'items.combo',
        populate: {
          path: 'products.product',
          select: 'name images'
        }
      });
      return res.status(201).json({ success: true, data: newCart });
    }
  } catch (error) {
    console.error('[CART] Error adding item to cart:', error);
    console.error('[CART] Error stack:', error.stack);
    console.error('[CART] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeItemFromCart = async (req, res) => {
  console.log('[CART] Remove item from cart - START');
  const { itemId } = req.params;
  const { itemType } = req.query; // 'product' or 'combo'
  
  console.log('[CART] Remove params:', { itemId, itemType });
  console.log('[CART] User:', req.user?.dbUser?.email);

  try {
    let cart = await Cart.findOne({ user: req.user.dbUser._id });
    console.log('[CART] Cart found:', cart ? 'Yes' : 'No');
    console.log('[CART] Items before filter:', cart?.items?.length || 0);

    if (cart) {
      const initialLength = cart.items.length;
      
      // Filter out the item to remove
      const filteredItems = cart.items.filter(item => {
        if (itemType === 'combo') {
          const itemComboId = item.combo ? item.combo.toString() : null;
          const shouldKeep = itemComboId !== itemId;
          console.log('[CART] Checking combo item:', { 
            itemComboId, 
            targetId: itemId, 
            shouldKeep 
          });
          return shouldKeep;
        } else {
          const itemProductId = item.product ? item.product.toString() : null;
          const shouldKeep = itemProductId !== itemId;
          console.log('[CART] Checking product item:', { 
            itemProductId, 
            targetId: itemId, 
            shouldKeep 
          });
          return shouldKeep;
        }
      });
      
      console.log('[CART] Items after filter:', filteredItems.length);
      console.log('[CART] Items removed:', initialLength - filteredItems.length);
      
      if (filteredItems.length === initialLength) {
        console.log('[CART] WARNING: No items were removed!');
      }
      
      cart.items = filteredItems;
      cart.markModified('items'); // Explicitly mark items as modified
      
      cart = await cart.save();
      await cart.populate('items.product');
      await cart.populate({
        path: 'items.combo',
        populate: {
          path: 'products.product',
          select: 'name images'
        }
      });
      
      console.log('[CART] Cart saved and populated successfully');
      console.log('[CART] Final item count:', cart.items.length);
      return res.status(200).json({ success: true, data: cart });
    }

    console.log('[CART] Cart not found for user');
    res.status(404).json({ success: false, message: 'Cart not found' });
  } catch (error) {
    console.error('[CART] Error removing item from cart:', error);
    console.error('[CART] Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
