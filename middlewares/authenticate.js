import jwt from 'jsonwebtoken';

import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/HttpError.js';
import User from '../models/user-model.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!authorization) {
    next(HttpError(401, 'Not authorized')); //Authorization header not found
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized')); //Authorization header invalid
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, 'Not authorized')); //user not found
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export default ctrlWrapper(authenticate);
