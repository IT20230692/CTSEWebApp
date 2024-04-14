import createError from '../utils/createError.js';
import Review from '../models/review.model.js';
import Add from '../models/add.model.js';

export const createReview = async (req, res, next) => {
  console.log('create review');
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    addId: req.body.addId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      addId: req.body.addId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, 'You have already created a review for this add!')      
      );

    //TODO: check if the user purchased the add.

    const savedReview = await newReview.save();

    await Add.findByIdAndUpdate(req.body.addId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findById(req.params.id); 
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


// Get reviews by address
export const getallReviewsByproductId = async (req, res, next) => {
  try {
    const addId = req.params.productId;
    console.log(addId);
    // Find all delivery records with the specified address
    const reviews = await Review.find({ addId: addId });

    if (!reviews || reviews.length === 0) {
      return next(createError(404, 'No reviews Found for the product!'));
    }

    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};


// export const deleteReview = async (req, res, next) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return next(createError(404, 'Review not found'));
//     }

//     if (review.userId !== req.userId)
//       return next(createError(403, 'You can delete your own reviews only'));
//     await Review.findByIdAndDelete(req.params.id);
//     res.status(200).send('Review has been deleted successfully');
//   } catch (err) {
//     next(err);
//   }
// };


//create update selected product
// export const updateReviews = async (req, res, next) => {
//   try {
//     const reviewId = req.params.id;

//     // Find product by ID and update product details
//     const updatedReview = await Review.findByIdAndUpdate(
//       reviewId,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );

//     if (!updatedReview) {
//       return next(createError(404, 'Review not found'));
//     }

//     if (updatedReview.userId !== req.userId) {
//       return next(createError(403, 'You can Review buy products only'));
//     }

//     return res.json({
//       message: 'Review details updated successfully',
//       product: updatedReview,
//     });

//   } catch (err) {
//     next(err);
//   }
// };
