import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import getUser from '../controllers/userController/getUser.js';
import updateProfile from '../controllers/userController/updateProfile.js';
import upload from '../middlewares/multer.js';
import getStates from '../controllers/userController/getStates.js';
import adminLogin from '../controllers/userController/adminLogin.js';
import getAllUsers from '../controllers/userController/getAllUsers.js';
const router = express.Router();

router.get('/me',isAuthenticated,getUser)
router.put('/update-profile',isAuthenticated,upload.single('profilePicture'),updateProfile)
router.get("/getStates",isAuthenticated,getStates)
router.post("/admin/login", adminLogin);
router.get("/admin/users", getAllUsers);
export default router;
