import express from 'express';
import { DataStore } from '../dataStore.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all Pre-owned / refurbished electronics listings
router.get('/', async (req, res) => {
  try {
    const { category, search, city } = req.query;
    const products = await DataStore.getProducts({ category, search, city });
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch electronics listings.'
    });
  }
});

// @route   POST /api/products
// @desc    Publish a new Pre-owned / refurbished electronic item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { 
      title, 
      category, 
      brand, 
      price, 
      originalPrice, 
      workingCondition, 
      problems, 
      imageUrl, 
      sellerPhone, 
      city,
      healthScore,
      grade
    } = req.body;

    if (!title || !price || !workingCondition || !problems || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required electronic item fields: Title, Price, Live Working Condition, Problems, Image URL.'
      });
    }

    const newProductData = {
      title,
      category: category || 'Mobiles',
      brand: brand || 'Generic Brand',
      price: Number(price),
      originalPrice: Number(originalPrice || Math.round(Number(price) * 1.5)),
      workingCondition,
      problems,
      imageUrl,
      sellerId: req.user.id,
      sellerName: req.user.username,
      sellerPhone: sellerPhone || '+91 98765 43210',
      city: city || 'Mumbai',
      healthScore: Number(healthScore || 92),
      grade: grade || 'Grade A Certified'
    };

    const createdProduct = await DataStore.createProduct(newProductData);
    return res.status(201).json({
      success: true,
      message: 'Pre-owned electronic item posted successfully to JAI\'s Cart!',
      product: createdProduct
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create electronics listing.'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a listing owned by user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await DataStore.deleteProduct(productId, req.user.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized to delete.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Electronics listing removed successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error removing listing.'
    });
  }
});

export default router;
