import { HttpError } from '../helpers/HttpError.js';

export const isEmptyBodyFavorite = async (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1 && keys[0] !== 'favorite') {
    return next(HttpError(400, 'missing field favorite'));
  }
  next();
};
