import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const Token = model('token', tokenSchema);

export default Token;
