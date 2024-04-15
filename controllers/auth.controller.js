import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//user registration
export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send('User has been created Successfully....');
  } catch (err) {
    next(err);
  }
};


//login for users
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return next(createError(400, 'Username and password are required.'));
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    // Compare passwords
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return next(createError(400, 'Wrong password or username!'));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    // Respond with token and user info
    const { password: userPassword, ...userInfo } = user.toObject(); // Exclude password from user info
    res.status(200).json({ token, info: userInfo });
  } catch (err) {
    next(err);
  }
};
