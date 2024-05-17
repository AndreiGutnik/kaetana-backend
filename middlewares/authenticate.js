import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/HttpError.js';
import tokenService from '../service/token-service.js';

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(HttpError(401, 'Not authorized')); //Authorization header not found
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized')); //Authorization header invalid
  }
  try {
    const userData = await tokenService.validateAccessToken(token);
    if (!userData) {
      next(HttpError(401, 'Not authorized')); //token is not found or valid
    }
    req.user = userData;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

export default ctrlWrapper(authenticate);
