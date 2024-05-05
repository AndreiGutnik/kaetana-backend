import express from 'express';

import productsController from '../../controllers/products-controllers.js';
import middlewares from '../../middlewares/index.js';
import {
  productAddSchema,
  productFavoriteSchema,
  productUpdateSchema,
} from '../../schemas/products-schemas.js';

const router = express.Router();

router.get('/', productsController.getAllProducts);

router.get('/:id', middlewares.isValidId, productsController.getProductById);

//middlewares.upload.single('image'),
//middlewares.upload.fields([{name:'image', maxCount: 8}]),
//middlewares.upload.array('image', 8),
router.post(
  '/',
  middlewares.upload.array('image', 8),
  middlewares.authenticate,
  middlewares.isEmptyBody,
  middlewares.validateBody(productAddSchema),
  productsController.addProduct
);

router.put(
  '/:id',
  middlewares.authenticate,
  middlewares.isValidId,
  middlewares.isEmptyBody,
  middlewares.validateBody(productUpdateSchema),
  productsController.updateProductById
);

router.patch(
  '/:id/favorite',
  middlewares.isValidId,
  middlewares.isEmptyBodyFavorite,
  middlewares.validateBody(productFavoriteSchema),
  productsController.updateProductById
);

router.delete(
  '/:id',
  middlewares.authenticate,
  middlewares.isValidId,
  productsController.deleteProductById
);

export default router;
