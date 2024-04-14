import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import {
  createReview,
  getReviews,
  // deleteReview,
  // updateReviews,
  getallReviewsByproductId,
} from '../controllers/review.controller.js';

const router = express.Router();

//create new review route
router.post('/', verifyToken, createReview);

//view review relavernt addId route
router.get('/single/:id', getReviews);

// //delete revire route
// router.delete('/:id', verifyToken, deleteReview);

// //update relavernt addId route
// router.put('/:id',verifyToken, updateReviews);

//view allreview relavernt addId route
router.get('/:productId', getallReviewsByproductId);

export default router;
