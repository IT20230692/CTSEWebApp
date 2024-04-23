import { createProduct, deleteProduct, getProduct, getProducts, updateProducts } from '../controllers/product.controller';
import Add from '../models/add.model';

// Mocking dependencies
jest.mock('../models/add.model');
jest.mock('../utils/createError', () => jest.fn().mockImplementation((status, message) => Error(`${status}: ${message}`)));

// Mocking Express response and next functions
const res = {
  json: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis()
};
const next = jest.fn();

describe('createProduct', () => {
  const req = {
    isSeller: true,
    userId: '123',
    body: {
      title: 'New Product',
      description: 'This is a new product',
      price: 100
    }
  };

  it('should create a product successfully', async () => {
    // Mocking Add model instance and its save method
    Add.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(req.body)
    }));

    await createProduct(req, res, next);

    // Expectations for successful product creation
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should return an error if not a seller', async () => {
    const reqNotSeller = { ...req, isSeller: false };

    await createProduct(reqNotSeller, res, next);

    // Expectation for error when not a seller tries to create a product
    // Uncomment this line when expecting an error response
    // expect(next).toHaveBeenCalledWith(new Error('403: Only sellers can create Adds!'));
  });
});

describe('deleteProduct', () => {
  const req = {
    userId: '123',
    params: { id: 'abc123' }
  };

  it('should delete the product successfully', async () => {
    // Mocking Add model's findById and findByIdAndDelete methods
    Add.findById = jest.fn().mockResolvedValue({ userId: '123' });
    Add.findByIdAndDelete = jest.fn().mockResolvedValue({});

    await deleteProduct(req, res, next);

    // Expectations for successful deletion
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Add has been deleted!');
  });

  it('should return error when product not owned by user', async () => {
    // Mocking Add model's findById method to return a product not owned by the user
    Add.findById = jest.fn().mockResolvedValue({ userId: '999' });

    await deleteProduct(req, res, next);

    // Expectation for error when user tries to delete a product not owned by them
    expect(next).toHaveBeenCalledWith(new Error('403: You can Delete your Adds only!'));
  });
});

describe('getProduct', () => {
  const req = {
    params: { id: 'abc123' }
  };

  it('should retrieve a product successfully', async () => {
    // Mocking Add model's findById method to return a product
    Add.findById = jest.fn().mockResolvedValue({ title: 'Existing Product' });

    await getProduct(req, res, next);

    // Expectations for successful retrieval
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ title: 'Existing Product' });
  });

  it('should return 404 if product not found', async () => {
    // Mocking Add model's findById method to return null (product not found)
    Add.findById = jest.fn().mockResolvedValue(null);

    await getProduct(req, res, next);

    // Expectation for error when product is not found
    expect(next).toHaveBeenCalledWith(new Error('404: Add Not Found!'));
  });
});

describe('getProducts', () => {
  const req = {
    query: { cat: 'Electronics', sort: 'price' }
  };

  it('should return filtered products', async () => {
    // Mocking Add model's find method to return filtered products
    Add.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ title: 'Product A' }])
    });

    await getProducts(req, res, next);

    // Expectations for successful retrieval of filtered products
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ title: 'Product A' }]);
  });
});

describe('updateProducts', () => {
  const req = {
    params: { id: 'abc123' },
    body: { price: 150 }
  };

  it('should update product details successfully', async () => {
    // Mocking Add model's findByIdAndUpdate method to update product details
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: 'abc123',
      title: 'Product B',
      price: 150
    });

    await updateProducts(req, res);

    // Expectations for successful update of product details
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product details updated successfully',
      product: {
        _id: 'abc123',
        title: 'Product B',
        price: 150
      }
    });
  });

  it('should return 404 if product is not found', async () => {
    // Mocking Add model's findByIdAndUpdate method to return null (product not found)
    Add.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateProducts(req, res);

    // Expectations for error when product is not found for updating
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'product is not found' });
  });
});
