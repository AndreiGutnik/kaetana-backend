import { Schema, model } from 'mongoose';

import { handleSaveError, preUpdate } from './hooks.js';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for product'],
    },
    price: {
      type: Number,
      required: [true, 'Set price for product'],
    },
    desc: {
      type: String,
      required: [true, 'Set description for product'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productSchema.post('save', handleSaveError);

productSchema.pre('findOneAndUpdate', preUpdate);

productSchema.post('findOneAndUpdate', handleSaveError);

const Product = model('product', productSchema);

export default Product;
