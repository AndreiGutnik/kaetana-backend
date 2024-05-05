import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/HttpError.js';
import User from '../models/user-model.js';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({
    name,
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  //res.status(204).send();
  res.json({
    message: 'Logout success',
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
