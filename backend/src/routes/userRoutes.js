import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import getUser from '../controllers/userController/getUser.js';

const router = express.Router();

router.get('/me',isAuthenticated,getUser)

export default router;
