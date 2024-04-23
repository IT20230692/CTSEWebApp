import express from 'express';
import { createOrder } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/jwt.js';

// Create a new instance of Express router
const router = express.Router();

// Route to handle order creation, protected by JWT token verification middleware
router.post('/', verifyToken, createOrder);

// Export the router for use in other files
export default router;
