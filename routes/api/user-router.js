import exprtss from 'express';

import userControllers from '../../controllers/user-controllers.js';
import middlewares from '../../middlewares/index.js';
import { updateUserSchema } from '../../schemas/users-schemas.js';

const router = exprtss.Router();

router.get('/current', middlewares.authenticate, userControllers.getCurrent);

router.patch(
  '/',
  middlewares.authenticate,
  middlewares.isEmptyBody,
  middlewares.validateBody(updateUserSchema),
  userControllers.updateUser
);

// router.patch(
//   '/favorites',
//   middlewares.authenticate,
//   middlewares.isEmptyBody,
//   validateBody(updateUserWaterRateSchema),
//   userControllers.updateFavorites,
// );

export default router;
