import authenticate from './authenticate.js';
import { isEmptyBody } from './isEmptyBody.js';
import { isEmptyBodyFavorite } from './isEmptyBodyFavorite.js';
import { isValidId } from './isValidId.js';
import { upload } from './upload.js';
import { validateBody } from './validateBody.js';

export default {
  isValidId,
  validateBody,
  authenticate,
  isEmptyBody,
  isEmptyBodyFavorite,
  upload,
};
