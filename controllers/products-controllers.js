import path from 'path';

import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/HttpError.js';
import cloudinary from '../helpers/cloudinary.js';
import Product from '../models/product-model.js';
import fs from 'fs/promises';

const { CLOUDINARY_FOLDER_PRODUCTS } = process.env;

const imagesPath = path.resolve('public', 'images', 'products');

const getAllProducts = async (req, res) => {
  //const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  //const filter = { owner, ...filterParams };
  const filter = { ...filterParams };
  // const result = await Product.find(filter, '-createdAt, -updatedAt', { skip, limit }).populate(
  //   'owner',
  //   'name email'
  // );
  const result = await Product.find(filter, '-createdAt, -updatedAt', { skip, limit });
  const total = await Product.countDocuments(filter);
  res.json({
    result,
    total,
  });
};

const getProductById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Product.findOne({ _id: id, owner });
  //const result = await Product.findById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const addProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const images = await Promise.all(
    req.files.map(async file => {
      const { url } = await cloudinary.uploader.upload(file.path, {
        folder: CLOUDINARY_FOLDER_PRODUCTS,
      });
      await fs.unlink(file.path);
      return url;
    })
  );
  const result = await Product.create({ ...req.body, images, owner });
  res.status(201).json(result);
};

const updateProductById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Product.findOneAndUpdate({ _id: id, owner }, req.body);
  //const result = await Product.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const deleteProductById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Product.findOneAndDelete({ _id: id, owner });
  //const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  // res.status(204).send();
  res.json({
    message: 'Product deleted',
  });
};

export default {
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductById: ctrlWrapper(getProductById),
  addProduct: ctrlWrapper(addProduct),
  updateProductById: ctrlWrapper(updateProductById),
  deleteProductById: ctrlWrapper(deleteProductById),
};
