import express from 'express';
import { 
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProducts,
} from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/jwt.js';

// Create a new instance of Express router
const router = express.Router();

// Route to handle product creation, protected by JWT token verification middleware
router.post('/', verifyToken, createProduct);

// Route to handle product deletion, protected by JWT token verification middleware
router.delete('/:id', verifyToken, deleteProduct);

// Route to retrieve a single product
router.get('/single/:id', getProduct);

// Route to retrieve all products
router.get('/', getProducts);

// Route to update a product, protected by JWT token verification middleware
router.put('/:id', verifyToken, updateProducts);

// Export the router for use in other files
export default router;
