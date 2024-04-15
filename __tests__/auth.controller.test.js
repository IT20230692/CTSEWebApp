// Import required modules and functions for testing
import { login } from '../controllers/auth.controller.js';
import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mocking the request and response objects
const req = {
  body: {
    username: 'testuser',
    password: 'testpassword',
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

// Mocking the User model function findOne
jest.mock('../models/user.model.js', () => ({
  findOne: jest.fn(),
}));

// Mocking the bcrypt.compareSync function
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

// Mocking the jwt.sign function
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller - Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if user is not found', async () => {
    User.findOne.mockResolvedValueOnce(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(404, 'User not found!'));
  });

  it('should return 400 if password is incorrect', async () => {
    const mockUser = { _id: 'testid', username: 'testuser', password: 'hashedpassword' };
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compareSync.mockReturnValueOnce(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(createError(400, 'Wrong password or username!'));
  });

  it('should call next with error if an error occurs', async () => {
    User.findOne.mockRejectedValueOnce('mock error');

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith('mock error');
  });
});
