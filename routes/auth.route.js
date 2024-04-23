import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

// Create a new instance of Express router
const router = express.Router();

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

// Export the router for use in other files
export default router;
