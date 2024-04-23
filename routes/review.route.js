import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { 
  createReview,
  getReviews,
  getallReviewsByproductId,
} from '../controllers/review.controller.js';

// Create a new instance of Express router
const router = express.Router();

// Route to create a new review, protected by JWT token verification middleware
router.post('/', verifyToken, createReview);

// Route to view reviews relevant to a specific addId
router.get('/single/:id', getReviews);

// Route to view all reviews relevant to a productId
router.get('/:productId', getallReviewsByproductId);

// Export the router for use in other files
export default router;
