import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import UserDto from '../dtos/user-dto.js';
import { HttpError } from '../helpers/HttpError.js';
import User from '../models/user-model.js';
import mailService from '../service/mail-service.js';

import tokenService from './token-service.js';

class UserService {
  async signup(email, password) {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, 'Email already in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationLink = uuidv4();

    const newUser = await User.create({ email, password: hashPassword, verificationLink });
    await mailService.sendVerifyMail(
      email,
      `${process.env.API_URL}/api/user/verify/${verificationLink}`
    );
    // await mailService.sendVerifyMailSendgrid(
    //   email,
    //   `${process.env.API_URL}/api/user/verify/${verificationLink}`
    // );

    const userDto = new UserDto(newUser);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }

  async verify(verificationLink) {
    const user = await User.findOne({ verificationLink });
    if (!user) {
      throw HttpError(409, 'Verification link is not correct');
    }
    user.verify = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, 'Email or password is wrong');
    }
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      ...tokens,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
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

  async getAllUsers() {
    const users = await User.find();
    return users;
  }
}

export default new UserService();
