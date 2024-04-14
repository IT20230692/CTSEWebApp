import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// //user registration
// export const register = async (req, res, next) => {
//   try {
//     const hash = bcrypt.hashSync(req.body.password, 5);
//     const newUser = new User({
//       ...req.body,
//       password: hash,
//     });

//     await newUser.save();
//     res.status(201).send('User has been created Successfully....');
//   } catch (err) {
//     next(err);
//   }
// };

//login for users
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, 'User not found!'));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, 'Wrong password or username!'));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );
    console.log(req.body.username)

    const { password, ...info } = user._doc;
    res.status(200).json({ token, info });
  } catch (err) {
    next(err);
  }
};