const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users.map((user) => {
        const { name, about, avatar, _id } = user;
        return { _id, name, about, avatar };
      }));
    })
    .catch(next);
};

const findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      const { _id, name, about, avatar } = user;
      res.send({ _id, name, about, avatar });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
