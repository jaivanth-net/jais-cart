import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Mobiles', 'Laptops', 'Gaming', 'Audio', 'Cameras', 'TV & Appliances', 'Wearables'],
    default: 'Mobiles'
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  // Live Working Condition description
  workingCondition: {
    type: String,
    required: true
  },
  // Disclosed Problems / Defects
  problems: {
    type: String,
    required: true
  },
  // Model Image URL
  imageUrl: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerPhone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Mumbai'
  },
  healthScore: {
    type: Number,
    default: 90
  },
  grade: {
    type: String,
    default: 'Grade A Refurbished'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
