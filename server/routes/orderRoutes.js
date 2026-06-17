import express from 'express';
import { getOrders, createOrder, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', adminAuth, updateOrderStatus);
router.delete('/:id', cancelOrder);

export default router;
