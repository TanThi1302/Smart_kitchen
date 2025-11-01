const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');

const promotionController = require('../controllers/promotionController');

const orderController = require('../controllers/orderController');
const postController = require('../controllers/postController');
const contactController = require('../controllers/contactController');


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


// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);

// Post routes
router.get('/posts', postController.getAllPosts);
router.get('/posts/:slug', postController.getPostBySlug);

// Contact & Other routes
router.post('/contact', contactController.createContactMessage);
router.get('/jobs', contactController.getJobPostings);
router.get('/promotions', contactController.getPromotions);

// Admin routes (in production, add authentication middleware)
// Products
router.post('/admin/products', productController.createProduct);
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

// Contact messages
router.get('/admin/contact-messages', contactController.getAllContactMessages);
router.put('/admin/contact-messages/:id/read', contactController.markMessageAsRead);

module.exports = router;

