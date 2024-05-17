import express from 'express';

import authControllers from '../../controllers/auth-controllers.js';
import middlewares from '../../middlewares/index.js';
import { userSigninSchema, userSignupSchema } from '../../schemas/users-schemas.js';

const router = express.Router();

router.post(
  '/signup',
  middlewares.isEmptyBody,
  middlewares.validateBody(userSignupSchema),
  authControllers.signup
);

router.post(
  '/login',
  middlewares.isEmptyBody,
  middlewares.validateBody(userSigninSchema),
  authControllers.login
);

router.post('/logout', middlewares.authenticate, authControllers.logout);

export default router;
