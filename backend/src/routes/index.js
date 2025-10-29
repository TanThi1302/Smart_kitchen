const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const promotionController = require('../controllers/promotionController');

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:slug', productController.getProductBySlug);
router.get('/categories/:slug/products', productController.getProductsByCategory);

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Promotion routes
router.get('/promotions', promotionController.getActivePromotions);

module.exports = router;

