// Review controller tests
import { createReview, getReviews, getallReviewsByproductId } from '../controllers/review.controller';
import Review from '../models/review.model';
import Add from '../models/add.model';

// Mocking dependencies
jest.mock('../models/review.model');
jest.mock('../models/add.model');
jest.mock('../utils/createError', () => jest.fn().mockImplementation((status, message) => Error(`${status}: ${message}`)));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
const next = jest.fn();

describe('createReview', () => {
  const req = {
    isSeller: false,
    userId: 'user123',
    body: {
      addId: 'add123',
      desc: 'Great product',
      star: 5
    }
  };

  it('should successfully create a review', async () => {
    // Mocking Review model's findOne and save methods
    Review.findOne = jest.fn().mockResolvedValue(null);
    Review.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        userId: req.userId,
        ...req.body
      })
    }));
    // Mocking Add model's findByIdAndUpdate method
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue({});

    await createReview(req, res, next);

    // Expectations for successful review creation
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      userId: 'user123',
      addId: 'add123',
      desc: 'Great product',
      star: 5
    });
  });

  it('should not allow sellers to create a review', async () => {
    // Creating a request object with isSeller as true
    const sellerReq = { ...req, isSeller: true };

    await createReview(sellerReq, res, next);

    // Expectation for error when seller tries to create a review
    expect(next).toHaveBeenCalledWith(new Error('403: Sellers can\'t create a review!'));
  });

  it('should not allow duplicate reviews', async () => {
    // Mocking Review model's findOne method to return true (existing review)
    Review.findOne = jest.fn().mockResolvedValue(true);

    await createReview(req, res, next);

    // Expectation for error when trying to create a duplicate review
    expect(next).toHaveBeenCalledWith(new Error('403: You have already created a review for this add!'));
  });
});

describe('getReviews', () => {
  const req = {
    params: { id: 'review123' }
  };

  it('should retrieve reviews successfully', async () => {
    // Mocking Review model's findById method to return a review
    Review.findById = jest.fn().mockResolvedValue({ desc: 'Great product', star: 5 });

    await getReviews(req, res, next);

    // Expectations for successful retrieval of reviews
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ desc: 'Great product', star: 5 });
  });

  it('should handle errors when fetching reviews', async () => {
    // Mocking Review model's findById method to throw an error
    Review.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    await getReviews(req, res, next);

    // Expectations for error handling when fetching reviews
    expect(next).toHaveBeenCalledWith(new Error('Database error'));
  });
});

describe('getallReviewsByproductId', () => {
  const req = {
    params: { productId: 'add123' }
  };

  it('should retrieve all reviews for a product successfully', async () => {
    // Mocking Review model's find method to return reviews for a product
    Review.find = jest.fn().mockResolvedValue([{ desc: 'Nice product', star: 4 }]);

    await getallReviewsByproductId(req, res, next);

    // Expectations for successful retrieval of reviews for a product
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ desc: 'Nice product', star: 4 }]);
  });

  it('should return error if no reviews found for the product', async () => {
    // Mocking Review model's find method to return an empty array (no reviews found)
    Review.find = jest.fn().mockResolvedValue([]);

    await getallReviewsByproductId(req, res, next);

    // Expectations for error when no reviews found for the product
    expect(next).toHaveBeenCalledWith(new Error('404: No reviews Found for the product!'));
  });
});
