import express from 'express';
import addProduct from '../controllers/productControllers/addProduct.js';
const router = express.Router();
import isAuthenticated from '../middlewares/isAuthenticated.js';
import getAllProducts from '../controllers/productControllers/getAllProducts.js';
import deleteProduct from '../controllers/productControllers/deleteProduct.js';
import clearAll from '../controllers/productControllers/clearAll.js';

router.post('/add-product', isAuthenticated, addProduct);
router.get('/product/:customerId', isAuthenticated, getAllProducts);
router.delete('/delete-product', isAuthenticated, deleteProduct);
router.delete('/clear-products', isAuthenticated, clearAll);


export default router;