import Order from '../models/order.model.js';
import createError from '../utils/createError.js';

//create a new delivery for sellers
export const createOrder = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, 'Only users can create Order option!'));

  const newOrder = new Order({
    userId: req.userId,
    ...req.body,
  });
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

//create delete function for sellers' deliverys
// export const deleteOrder = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (order.userId !== req.userId)
//       return next(createError(403, 'You can Delete your Order details only!'));
//     await Order.findByIdAndDelete(req.params.id);
//     res.status(200).send('Order record  has been deleted!');
//   } catch (err) {
//     next(err);
//   }
// };

// //get seleted order from order model
// export const getOrder = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return next(createError(404, 'Order Not Found!'));
//     res.status(200).send(order);
//   } catch (err) {
//     next(err);
//   }
// };


// //get orders containing specific product IDs from order model
// export const getOrdersByProductIds = async (req, res, next) => {
//   try {
//     const productIds = req.params.productId.split(','); // Split the string of product IDs
//     console.log(productIds);
//     const orders = await Order.find({ productIds: { $all: productIds } }); // Find orders containing all specified product IDs
//     if (!orders || orders.length === 0) return next(createError(404, 'No Orders Found for the Product(s)!'));
//     res.status(200).send(orders);
//   } catch (err) {
//     next(err);
//   }
// };





// //create update selected product
// export const updateOrders = async (req, res, next) => {
//   try {
//     const orderId = req.params.id;

//     // Find product by ID and update product details
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return next(createError(404, 'Order not found'));
//     }

//     if (updatedOrder.userId !== req.userId) {
//       return next(createError(403, 'You can update your own orders only'));
//     }

//     return res.json({
//       message: 'Order details updated successfully',
//       product: updatedOrder,
//     });

//   } catch (err) {
//     next(err);
//   }
// };

