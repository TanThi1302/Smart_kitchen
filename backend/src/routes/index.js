const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const promotionController = require('../controllers/promotionController');
const orderController = require('../controllers/orderController');
const postController = require('../controllers/postController');
const contactController = require('../controllers/contactController');
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/brands', productController.getBrands);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/:slug', productController.getProductBySlug);
router.get('/products/:slug/related', productController.getRelatedProducts);
router.get('/products/:slug/suggestions', productController.getProductSuggestions);
router.get('/welcome', productController.welcome);

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:slug', categoryController.getCategoryBySlug);

// Promotion routes
router.get('/promotions', promotionController.getActivePromotions);

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);

// Post routes

router.get('/posts', postController.getAllPosts);
router.get('/posts/:slug', postController.getPostBySlug);

// Upload routes
router.post('/upload-image', upload.single('image'), uploadController.uploadImage);

// Contact & Other routes
router.post('/contact', contactController.createContactMessage);
router.get('/jobs', contactController.getJobPostings);

// Admin routes (in production, add authentication middleware)
// Products
router.post('/admin/products', upload.array('images', 10), productController.createProduct);
router.put('/admin/products/:id', productController.updateProduct);
router.delete('/admin/products/:id', productController.deleteProduct);

// Product Images
router.get('/products/:productId/images', productController.getProductImages);
router.post('/admin/products/:productId/images', productController.addProductImage);
router.put('/admin/products/images/:imageId', productController.updateProductImage);
router.delete('/admin/products/images/:imageId', productController.deleteProductImage);

// Categories
router.post('/admin/categories', categoryController.createCategory);
router.put('/admin/categories/:id', categoryController.updateCategory);
router.delete('/admin/categories/:id', categoryController.deleteCategory);

// Orders
router.get('/admin/orders', orderController.getAllOrders);
router.put('/admin/orders/:id/status', orderController.updateOrderStatus);

// Posts
router.get('/admin/posts', postController.getAllPostsAdmin);
router.post('/admin/posts', postController.createPost);
router.put('/admin/posts/:id', postController.updatePost);
router.delete('/admin/posts/:id', postController.deletePost);

// Promotions
router.get('/admin/promotions', promotionController.getAllPromotions);
router.post('/admin/promotions', promotionController.createPromotion);
router.put('/admin/promotions/:id', promotionController.updatePromotion);
router.delete('/admin/promotions/:id', promotionController.deletePromotion);

// Contact messages
router.get('/admin/contact-messages', contactController.getAllContactMessages);
router.put('/admin/contact-messages/:id/read', contactController.markMessageAsRead);

module.exports = router;
