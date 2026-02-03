import express from 'express';
import addCustomer from '../controllers/customerControllers/addCustomer.js';
import getAllCustomers from '../controllers/customerControllers/getAllCustomers.js';
import getCustomer from '../controllers/customerControllers/getCustomer.js';
import decreaseDue from '../controllers/customerControllers/decreaseDue.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Static routes first
router.post('/add-customer', isAuthenticated, addCustomer);
router.get('/get-all-customers', isAuthenticated, getAllCustomers);
router.put('/update-due', isAuthenticated, decreaseDue); // ✅ PUT route
// Dynamic route last
router.get('/:id', isAuthenticated, getCustomer);

export default router;
