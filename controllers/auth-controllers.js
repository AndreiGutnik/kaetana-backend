import ctrlWrapper from '../decorators/ctrlWrapper.js';
import userService from '../service/user-service.js';

const signup = async (req, res) => {
  const { email, password } = req.body;
  const userData = await userService.signup(email, password);

  res.cookie('refreshToken', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 100,
    httpOnly: true,
  });
  res.status(201).json(userData);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userData = await userService.login(email, password);
  res.cookie('refreshToken', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 100,
    httpOnly: true,
  });
  res.json(userData);
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  const token = await userService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(200).json({
    message: 'Logout success',
    ...token,
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
