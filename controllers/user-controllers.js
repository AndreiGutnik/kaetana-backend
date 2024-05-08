import ctrlWrapper from '../decorators/ctrlWrapper.js';

const getCurrent = async (req, res) => {
  const { _id, firstname, lastname, email } = req.user;
  res.json({
    id: _id,
    firstname,
    lastname,
    email,
  });
};

const updateUser = async (req, res) => {};

export default {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
};
