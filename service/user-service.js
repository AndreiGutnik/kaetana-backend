import UserDto from '../dtos/user-dto.js';
import { HttpError } from '../helpers/HttpError.js';
import User from '../models/user-model.js';

import tokenService from './token-service.js';

class UserService {
  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async verify(verificationLink) {
    const user = await User.findOne({ verificationLink });
    if (!user) {
      throw HttpError(409, 'Verification link is not correct');
    }
    user.verify = true;
    await user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw HttpError(401, 'Not authorized');
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw HttpError(401, 'Not authorized');
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }
}

export default new UserService();
