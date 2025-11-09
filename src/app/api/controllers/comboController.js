const Combo = require('../models/Combo');
const Product = require('../models/Product');

// @desc    Get all combos
// @route   GET /api/combos
// @access  Public
exports.getCombos = async (req, res) => {
  try {
    const { 
      isActive, 
      isFeatured, 
      category,
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (category) query.category = category;

    // Check if combo is within date range
    const now = new Date();
    if (isActive === 'true') {
      query.$or = [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null }
      ];
    }

    const combos = await Combo.find(query)
      .populate('products.product', 'name images regularPrice discountedPrice stock')
      .populate('coupon', 'code discountType discountValue')
      .populate('createdBy', 'displayName email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Combo.countDocuments(query);

    res.status(200).json({
      success: true,
      data: combos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[COMBO] Get all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combos',
      error: error.message
    });
  }
};

// @desc    Get single combo by ID or slug
// @route   GET /api/combos/:id
// @access  Public
exports.getCombo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let combo = await Combo.findById(id)
      .populate('products.product', 'name images regularPrice discountedPrice stock description')
      .populate('coupon', 'code discountType discountValue minPurchase maxDiscount')
      .populate('createdBy', 'displayName email')
      .populate('updatedBy', 'displayName email');

    if (!combo) {
      combo = await Combo.findOne({ slug: id })
        .populate('products.product', 'name images regularPrice discountedPrice stock description')
        .populate('coupon', 'code discountType discountValue minPurchase maxDiscount')
        .populate('createdBy', 'displayName email')
        .populate('updatedBy', 'displayName email');
    }

    if (!combo) {
      return res.status(404).json({
        success: false,
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: combo
    });
  } catch (error) {
    console.error('[COMBO] Get by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch combo',
      error: error.message
    });
  }
};

// @desc    Create new combo
// @route   POST /api/combos
// @access  Private/Admin
exports.createCombo = async (req, res) => {
  try {
    console.log('[COMBO] Creating new combo');
    console.log('[COMBO] Request body:', JSON.stringify(req.body, null, 2));
    console.log('[COMBO] User:', req.user?.email);
    
    const {
      title,
      description,
      shortDescription,
      products,
      bannerImage,
      images,
      discountType,
      discountValue,
      coupon,
      isActive,
      isFeatured,
      startDate,
      endDate,
      stock,
      tags,
      category,
      seo
    } = req.body;

    // Validate products
    if (!products || products.length === 0) {
      console.log('[COMBO] Validation error: No products provided');
      return res.status(400).json({
        success: false,
        message: 'At least one product is required'
      });
    }

    // Calculate original price from products
    console.log('[COMBO] Calculating original price from products:', products);
    let originalPrice = 0;
    for (const item of products) {
      console.log('[COMBO] Processing product item:', item);
      
      if (!item.product) {
        console.log('[COMBO] Error: Product ID is missing');
        return res.status(400).json({
          success: false,
          message: 'Product ID is required for each product'
        });
      }
      
      const product = await Product.findById(item.product).select('name regularPrice discountedPrice');
      console.log('[COMBO] Found product:', product ? `${product.name} - Regular: ₹${product.regularPrice}, Discounted: ₹${product.discountedPrice}` : 'NOT FOUND');
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      
      // Use discounted price if available, otherwise regular price
      const productPrice = product.discountedPrice || product.regularPrice;
      
      if (!productPrice || isNaN(productPrice)) {
        console.log('[COMBO] Error: Product price is invalid:', productPrice);
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} has invalid price: ${productPrice}`
        });
      }
      
      const itemTotal = productPrice * (item.quantity || 1);
      console.log(`[COMBO] Item total: ₹${productPrice} × ${item.quantity || 1} = ₹${itemTotal}`);
      originalPrice += itemTotal;
    }
    
    console.log('[COMBO] Total original price: ₹${originalPrice}');
    
    if (isNaN(originalPrice) || originalPrice <= 0) {
      console.log('[COMBO] Error: Invalid original price calculated:', originalPrice);
      return res.status(400).json({
        success: false,
        message: `Invalid original price calculated: ${originalPrice}`
      });
    }

    // Create combo
    const combo = await Combo.create({
      title,
      description,
      shortDescription,
      products,
      bannerImage,
      images,
      originalPrice,
      discountType,
      discountValue,
      coupon: coupon || undefined,
      isActive,
      isFeatured,
      startDate,
      endDate,
      stock,
      tags,
      category,
      seo,
      createdBy: req.user?.dbUser?._id
    });

    const populatedCombo = await Combo.findById(combo._id)
      .populate('products.product', 'name images regularPrice discountedPrice')
      .populate('coupon', 'code discountType discountValue');

    console.log('[COMBO] Combo created successfully:', combo._id);

    res.status(201).json({
      success: true,
      message: 'Combo created successfully',
      data: populatedCombo
    });
  } catch (error) {
    console.error('[COMBO] Create error:', error);
    console.error('[COMBO] Error stack:', error.stack);
    console.error('[COMBO] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create combo',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update combo
// @route   PUT /api/combos/:id
// @access  Private/Admin
exports.updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If products are updated, recalculate original price
    if (updateData.products && updateData.products.length > 0) {
      let originalPrice = 0;
      for (const item of updateData.products) {
        const product = await Product.findById(item.product).select('regularPrice discountedPrice');
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`
          });
        }
        const productPrice = product.discountedPrice || product.regularPrice;
        originalPrice += productPrice * item.quantity;
      }
      updateData.originalPrice = originalPrice;
    }

    updateData.updatedBy = req.user?.dbUser?._id;

    const combo = await Combo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('products.product', 'name images regularPrice discountedPrice')
      .populate('coupon', 'code discountType discountValue')
      .populate('updatedBy', 'displayName email');

    if (!combo) {
      return res.status(404).json({
        success: false,
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Combo updated successfully',
      data: combo
    });
  } catch (error) {
    console.error('[COMBO] Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update combo',
      error: error.message
    });
  }
};

// @desc    Delete combo
// @route   DELETE /api/combos/:id
// @access  Private/Admin
exports.deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;

    const combo = await Combo.findByIdAndDelete(id);

    if (!combo) {
      return res.status(404).json({
        success: false,
        message: 'Combo not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Combo deleted successfully'
    });
  } catch (error) {
    console.error('[COMBO] Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete combo',
      error: error.message
    });
  }
};

// @desc    Toggle combo active status
// @route   PATCH /api/combos/:id/toggle-active
// @access  Private/Admin
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    const combo = await Combo.findById(id);
    if (!combo) {
      return res.status(404).json({
        success: false,
        message: 'Combo not found'
      });
    }

    combo.isActive = !combo.isActive;
    combo.updatedBy = req.user?.dbUser?._id;
    await combo.save();

    res.status(200).json({
      success: true,
      message: `Combo ${combo.isActive ? 'activated' : 'deactivated'} successfully`,
      data: combo
    });
  } catch (error) {
    console.error('[COMBO] Toggle active error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle combo status',
      error: error.message
    });
  }
};

// @desc    Fix combo prices (recalculate)
// @route   POST /api/combos/:id/fix-prices
// @access  Private/Admin
exports.fixComboPrices = async (req, res) => {
  try {
    const { id } = req.params;
    
    const combo = await Combo.findById(id);
    if (!combo) {
      return res.status(404).json({
        success: false,
        message: 'Combo not found'
      });
    }
    
    console.log('[COMBO] Fixing prices for:', combo.title);
    console.log('[COMBO] Current values:', {
      originalPrice: combo.originalPrice,
      discountType: combo.discountType,
      discountValue: combo.discountValue,
      finalPrice: combo.finalPrice,
      savings: combo.savings
    });
    
    // Force recalculation by marking fields as modified
    combo.markModified('originalPrice');
    combo.markModified('discountValue');
    combo.markModified('discountType');
    
    await combo.save();
    
    console.log('[COMBO] Fixed values:', {
      originalPrice: combo.originalPrice,
      finalPrice: combo.finalPrice,
      savings: combo.savings
    });
    
    res.status(200).json({
      success: true,
      message: 'Prices recalculated successfully',
      data: combo
    });
  } catch (error) {
    console.error('[COMBO] Fix prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix prices',
      error: error.message
    });
  }
};

// @desc    Get combo statistics
// @route   GET /api/combos/stats
// @access  Private/Admin
exports.getComboStats = async (req, res) => {
  try {
    const total = await Combo.countDocuments();
    const active = await Combo.countDocuments({ isActive: true });
    const featured = await Combo.countDocuments({ isFeatured: true });
    const inactive = await Combo.countDocuments({ isActive: false });

    const topSelling = await Combo.find()
      .sort({ soldCount: -1 })
      .limit(5)
      .populate('products.product', 'name images');

    const byCategory = await Combo.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSales: { $sum: '$soldCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        featured,
        inactive,
        topSelling,
        byCategory
      }
    });
  } catch (error) {
    console.error('[COMBO] Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
