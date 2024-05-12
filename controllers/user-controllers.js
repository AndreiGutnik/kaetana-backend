import ctrlWrapper from '../decorators/ctrlWrapper.js';
import Product from '../models/product-model.js';
import User from '../models/user-model.js';

const getCurrent = async (req, res) => {
  const { _id, firstname, lastname, email, phone } = req.user;
  console.log(req.user);
  res.json({
    id: _id,
    firstname,
    lastname,
    email,
    phone,
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  console.log(req.user);
  await User.findOneAndUpdate({ _id }, req.body);
  const user = await User.findById(_id, '-password -token');
  res.json(user);
};

const updateFavorites = async (req, res) => {
  const { id: productId } = req.params;
  const { _id: userId } = req.user;
  const product = await Product.findById(productId);
  if (!product) {
    throw HttpError(404, 'Not found');
  }
  let user = await User.findById(userId);
  const { favorites } = user;
  const userProdIdx = favorites.findIndex(item => item === productId);
  if (userProdIdx === -1) {
    await User.findByIdAndUpdate(userId, {
      favorites: [...favorites, product._id],
    });
  } else {
    favorites.splice(userProdIdx, 1);
    console.log(favorites);
    await User.findByIdAndUpdate(userId, {
      favorites: [...favorites],
    });
  }
  user = await User.findById(userId, '-password -token');
  res.json(user);
};

export default {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  updateFavorites: ctrlWrapper(updateFavorites),
};
