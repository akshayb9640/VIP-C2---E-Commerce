import express from 'express';
import { getMetrics, getAdminSettings, updateAdminSettings, getUsersList } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/metrics', getMetrics);
router.get('/settings', getAdminSettings);
router.post('/settings', updateAdminSettings);
router.get('/users', getUsersList);

export default router;
