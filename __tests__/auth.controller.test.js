// Login controller tests
import { login } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mocking dependencies
jest.mock('../models/user.model.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/createError.js', () => jest.fn().mockImplementation((status, message) => ({ status, message })));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
};
const next = jest.fn();

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clears instances and calls to constructor and all methods
  });

  // Mock request object
  const req = {
    body: {
      username: 'testUser',
      password: 'testPass'
    }
  };

  it('should validate username and password are provided', async () => {
    const reqMissingFields = {
      body: {}
    };

    await login(reqMissingFields, res, next);

    expect(next).toHaveBeenCalledWith({ status: 400, message: 'Username and password are required.' });
  });

  it('should return 404 if user not found', async () => {
    // Mocking User.findOne to return null
    User.findOne = jest.fn().mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith({ status: 404, message: 'User not found!' });
  });

  it('should return 400 if password is incorrect', async () => {
    // Mocking User.findOne to return a user with hashed password
    User.findOne = jest.fn().mockResolvedValue({
      _id: '123',
      password: 'hashedPassword'
    });
    // Mocking bcrypt.compare to return false
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith({ status: 400, message: 'Wrong password or username!' });
  });

  it('should successfully log in and return a token and user info', async () => {
    // Mocking User.findOne to return a user with hashed password
    const userMock = {
      _id: '123',
      isSeller: false,
      password: 'hashedPassword',
      // Mocking toObject method to return user object
      toObject: jest.fn(() => ({
        _id: '123',
        username: 'testUser',
        isSeller: false
      }))
    };
    User.findOne = jest.fn().mockResolvedValue(userMock);
    // Mocking bcrypt.compare to return true
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    // Mocking jwt.sign to return a fake token
    jwt.sign = jest.fn().mockReturnValue('fakeToken123');

    await login(req, res, next);

    // Check if response status and json methods are called with expected values
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeToken123',
      info: {
        _id: '123',
        username: 'testUser',
        isSeller: false
      }
    });
  });
});
