import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoute from './routes/product.route.js';
import authRoute from './routes/auth.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import getSecret from './config/secrets.js';

const app = express();
dotenv.config(); // Load environment variables from .env file

mongoose.set('strictQuery', true); // Enable strict query mode for mongoose

// Connect to MongoDB
const connect = async () => {
    try {
        // Retrieve secret for MongoDB connection
        const secret = await getSecret();
        // Use the secret to connect to MongoDB
        await mongoose.connect(secret.MONGO_URL);
        console.log("MongoDB Connected successfully!");
    } catch (error) {
        console.log(error);
    }
};

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5000/products'], // Set allowed origin
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Set allowed headers
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Set allowed HTTP methods
    credentials: true // Allow sending cookies
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/products', productRoute); // Product routes
app.use('/auth', authRoute); // Authentication routes
app.use('/review', reviewRoute); // Review routes
app.use('/order', orderRoute); // Order routes

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong!';
    return res.status(errorStatus).send(errorMessage);
});

// Start server
app.listen(5000, () => {
    connect(); // Connect to MongoDB
    console.log('Backend server is running!');
});
