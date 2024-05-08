import express from 'express';

import userControllers from '../../controllers/auth-controllers.js';
import middlewares from '../../middlewares/index.js';
import { userSigninSchema, userSignupSchema } from '../../schemas/users-schemas.js';

const router = express.Router();

router.post(
  '/signup',
  middlewares.isEmptyBody,
  middlewares.validateBody(userSignupSchema),
  userControllers.signup
);

router.post(
  '/login',
  middlewares.isEmptyBody,
  middlewares.validateBody(userSigninSchema),
  userControllers.login
);

router.post('/logout', middlewares.authenticate, userControllers.logout);

export default router;
