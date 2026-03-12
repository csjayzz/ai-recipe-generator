import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

//ALL routes are protected routes
router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/preferences', userController.updatePreferences);
router.post('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

export default router;