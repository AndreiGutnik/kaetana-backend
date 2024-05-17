import { Schema, model } from 'mongoose';

import { handleSaveError, preUpdate } from './hooks.js';

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const phoneRegexp = /^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      default: 'User',
    },
    lastname: {
      type: String,
      default: '',
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
    verify: {
      type: Boolean,
      default: false,
    },
    verificationLink: {
      type: String,
    },
    // accessToken: {
    //   type: String,
    //   default: '',
    // },
    // verificationToken: {
    //   type: String,
    // },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', preUpdate);

userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;
