import express from 'express';
import {
  createOrder,
  // deleteOrder,
  // getOrder,
  // getOrdersByProductIds,
  // updateOrders,
} from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/jwt.js';
const router = express.Router();

router.post('/', verifyToken, createOrder);
// router.delete('/:id', verifyToken, deleteOrder);
// router.get('/single/:id', getOrder);
// router.get('/:productId', getOrdersByProductIds);
// router.put('/:id',verifyToken , updateOrders);

export default router;
