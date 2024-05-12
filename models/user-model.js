import { Schema, model } from 'mongoose';

import { handleSaveError, preUpdate } from './hooks.js';

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const phoneRegexp = /^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/;

const userchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Set name for user'],
    },
    lastname: {
      type: String,
      required: [true, 'Set last name for user'],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      match: phoneRegexp,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    favorites: [
      {
        type: String,
      },
    ],
    token: {
      type: String,
      default: '',
    },
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationToken: {
    //   type: String,
    // },
  },
  { versionKey: false, timestamps: true }
);

userchema.post('save', handleSaveError);

userchema.pre('findOneAndUpdate', preUpdate);

userchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userchema);

export default User;
