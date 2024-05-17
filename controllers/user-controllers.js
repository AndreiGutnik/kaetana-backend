import ctrlWrapper from '../decorators/ctrlWrapper.js';
import Product from '../models/product-model.js';
import User from '../models/user-model.js';
import userService from '../service/user-service.js';

const { CLIENT_URL } = process.env;

const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

const getCurrent = async (req, res) => {
  const { _id, firstname = '', lastname = '', email, phone = '' } = req.user;
  res.json({
    ...req.user,
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
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

    await User.findByIdAndUpdate(userId, {
      favorites: [...favorites],
    });
  }
  user = await User.findById(userId, '-password -token');
  res.json(user);
};

const verify = async (req, res) => {
  const verificationLink = req.params.link;
  await userService.verify(verificationLink);
  res.redirect(CLIENT_URL);
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const userData = await userService.refresh(refreshToken);
  res.cookie('refreshToken', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 100,
    httpOnly: true,
  });
  res.json(userData);
};

export default {
  getUsers: ctrlWrapper(getUsers),
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  updateFavorites: ctrlWrapper(updateFavorites),
  verify: ctrlWrapper(verify),
  refresh: ctrlWrapper(refresh),
};
