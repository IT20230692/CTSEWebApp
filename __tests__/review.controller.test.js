import {
  createReview,
  getReviews,
  getallReviewsByproductId
} from '../controllers/review.controller.js';
import Review from '../models/review.model.js';
import Add from '../models/add.model.js';
import createError from '../utils/createError.js';

// Mock the request and response objects
const req = {
  isSeller: false, // Assuming the user is not a seller
  userId: 'testUserId',
  params: { id: 'testReviewId', productId: 'testProductId' },
  body: {
    addId: 'testAddId',
    desc: 'Test description',
    star: 5
    // Add any other properties required for creating a review
  }
};

const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn()
};

const next = jest.fn();

// Mock the Review and Add model functions
jest.mock('../models/review.model.js');
jest.mock('../models/add.model.js');

describe('Review Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new review if the user is not a seller and the review does not exist', async () => {
    // Mocking the return value of Review.findOne function
    Review.findOne.mockResolvedValueOnce(null);

    // Mocking the return value of Review.save function
    const mockSavedReview = { _id: 'testReviewId', ...req.body };
    Review.prototype.save.mockResolvedValueOnce(mockSavedReview);

    // Mocking the return value of Add.findByIdAndUpdate function
    Add.findByIdAndUpdate.mockResolvedValueOnce({});

    await createReview(req, res, next);

    expect(Review.findOne).toHaveBeenCalledTimes(1); // Ensure Review.findOne is called
    expect(Review.findOne).toHaveBeenCalledWith({
      addId: req.body.addId,
      userId: req.userId
    });

    expect(Review.prototype.save).toHaveBeenCalledTimes(1); // Ensure Review.save is called
    expect(Review.prototype.save).toHaveBeenCalledWith();

    expect(Add.findByIdAndUpdate).toHaveBeenCalledTimes(1); // Ensure Add.findByIdAndUpdate is called
    expect(Add.findByIdAndUpdate).toHaveBeenCalledWith(req.body.addId, {
      $inc: { totalStars: req.body.star, starNumber: 1 }
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(mockSavedReview);
  });

  it('should get reviews by ID', async () => {
    // Mocking the return value of Review.findById function
    const mockReview = { _id: 'testReviewId', ...req.body };
    Review.findById.mockResolvedValueOnce(mockReview);

    await getReviews(req, res, next);

    expect(Review.findById).toHaveBeenCalledTimes(1); // Ensure Review.findById is called
    expect(Review.findById).toHaveBeenCalledWith(req.params.id);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockReview);
  });

  it('should get all reviews by product ID', async () => {
    // Mocking the return value of Review.find function
    const mockReviews = [{ _id: 'testReviewId1', ...req.body }, { _id: 'testReviewId2', ...req.body }];
    Review.find.mockResolvedValueOnce(mockReviews);

    await getallReviewsByproductId(req, res, next);

    expect(Review.find).toHaveBeenCalledTimes(1); // Ensure Review.find is called
    expect(Review.find).toHaveBeenCalledWith({ addId: req.params.productId });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockReviews);
  });
});
