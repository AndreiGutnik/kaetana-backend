import exprtss from 'express';

import userControllers from '../../controllers/user-controllers.js';
import middlewares from '../../middlewares/index.js';
import { updateUserSchema } from '../../schemas/users-schemas.js';

const router = exprtss.Router();

router.get('/users', middlewares.authenticate, userControllers.getUsers);

router.get('/current', middlewares.authenticate, userControllers.getCurrent);

router.get('/verify/:link', userControllers.verify);

router.get('/refresh', userControllers.refresh);

router.patch(
  '/',
  middlewares.authenticate,
  middlewares.isEmptyBody,
  middlewares.validateBody(updateUserSchema),
  userControllers.updateUser
);

router.patch(
  '/:id/favorites',
  middlewares.authenticate,
  middlewares.isValidId,
  userControllers.updateFavorites
);

export default router;
