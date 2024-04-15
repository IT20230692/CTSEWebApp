import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProducts
} from '../controllers/product.controller.js';
import Add from '../models/add.model.js';
import createError from '../utils/createError.js';

// Mock the request and response objects
const req = {
  isSeller: true, // Assuming the user is a seller
  userId: 'testUserId',
  params: { id: 'testAddId' },
  body: {
    // Mock request body data
    title: 'Test Product',
    desc: 'Test description',
    cat: 'Test category',
    price: 100,
    cover: 'test-cover.jpg',
    availableQuntity: 10,
    shortTitle: 'Short Title',
    // Add any other properties required for creating an add
  },
  query: {
    // Mock query parameters if needed
  }
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
};

const next = jest.fn();

// Mock the Add model functions
jest.mock('../models/add.model.js');

describe('Product Controller - createProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new product if the user is a seller', async () => {
    // Mocking the Add model constructor and save function
    const mockSavedAdd = { _id: 'testAddId', ...req.body };
    Add.mockReturnValueOnce(mockSavedAdd);

    await createProduct(req, res, next);

    expect(Add).toHaveBeenCalledTimes(1); // Ensure Add constructor is called
    expect(Add).toHaveBeenCalledWith({
      userId: 'testUserId',
      ...req.body
    });

    // expect(res.status).toHaveBeenCalledWith(201);
    // expect(res.json).toHaveBeenCalledWith(mockSavedAdd);
  });
});

// You can add similar test cases for other controller functions (deleteProduct, getProduct, getProducts, updateProducts)
