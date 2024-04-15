import { createOrder } from '../controllers/order.controller.js';
import Order from '../models/order.model.js';
import createError from '../utils/createError.js';

// Mock the request and response objects
const req = {
  isSeller: false, // Set to false to simulate the scenario where the user is not a seller
  userId: 'testUserId',
  body: {
    // Mock request body data
    // You can modify this object based on your requirements
    product: 'Test Product',
    quantity: 2,
    // Add any other properties required for creating an order
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

// Mock the Order model function save
jest.mock('../models/order.model.js', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Order Controller - createOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new order if the user is not a seller', async () => {
    // Mock the return value of Order.save function
    const mockSavedOrder = {
      _id: 'testOrderId',
      userId: 'testUserId',
      product: 'Test Product',
      quantity: 2,
      // Add any other properties returned after saving the order
    };
    Order.mockImplementationOnce(() => mockSavedOrder);

    await createOrder(req, res, next);

    expect(Order).toHaveBeenCalledTimes(1); // Ensure Order constructor is called
    expect(Order).toHaveBeenCalledWith({
      userId: 'testUserId',
      product: 'Test Product',
      quantity: 2,
      // Add any other properties required for creating an order
    });

    // expect(res.json).toHaveBeenCalledWith(mockSavedOrder);
  });
});
   