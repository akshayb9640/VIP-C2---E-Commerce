import express from 'express';
import { getCart, addToCart, updateCartItem, deleteCartItem, clearCart } from '../controllers/cartController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);
router.delete('/', clearCart);

export default router;
