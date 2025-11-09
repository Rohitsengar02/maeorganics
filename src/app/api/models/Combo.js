const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Combo title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  }],
  bannerImage: {
    type: String,
    required: [true, 'Banner image is required']
  },
  images: [{
    type: String
  }],
  originalPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  finalPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  savings: {
    type: Number,
    default: 0
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['seasonal', 'bestseller', 'limited', 'special', 'clearance', 'other'],
    default: 'other'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
comboSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate final price and savings only if originalPrice exists
  if (this.originalPrice && (this.isModified('originalPrice') || this.isModified('discountValue') || this.isModified('discountType'))) {
    console.log('[COMBO MODEL] Calculating prices:', {
      originalPrice: this.originalPrice,
      discountType: this.discountType,
      discountValue: this.discountValue
    });
    
    if (this.discountType === 'percentage') {
      const discountAmount = this.originalPrice * (this.discountValue / 100);
      this.finalPrice = this.originalPrice - discountAmount;
      console.log('[COMBO MODEL] Percentage discount:', discountAmount, 'Final:', this.finalPrice);
    } else {
      this.finalPrice = this.originalPrice - this.discountValue;
      console.log('[COMBO MODEL] Fixed discount:', this.discountValue, 'Final:', this.finalPrice);
    }
    
    // Ensure final price is never negative
    if (this.finalPrice < 0) {
      console.warn('[COMBO MODEL] Final price is negative! Setting to 0');
      this.finalPrice = 0;
    }
    
    this.savings = this.originalPrice - this.finalPrice;
    
    console.log('[COMBO MODEL] Final calculation:', {
      originalPrice: this.originalPrice,
      finalPrice: this.finalPrice,
      savings: this.savings
    });
  }
  
  next();
});

// Indexes for better query performance
comboSchema.index({ slug: 1 });
comboSchema.index({ isActive: 1 });
comboSchema.index({ isFeatured: 1 });
comboSchema.index({ startDate: 1, endDate: 1 });
comboSchema.index({ category: 1 });
comboSchema.index({ createdAt: -1 });

// Virtual for checking if combo is currently active
comboSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         (!this.startDate || this.startDate <= now) && 
         (!this.endDate || this.endDate >= now);
});

// Prevent model overwrite in Next.js serverless environment
const Combo = mongoose.models.Combo || mongoose.model('Combo', comboSchema);

module.exports = Combo;
