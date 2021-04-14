// код для авторизации запроса

const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AuthError('Токен остутствует или некорректен'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'd6b5d9064c9d700530a9421b4db0c066');
  } catch (err) {
    next(new AuthError('Токен не верифицирован, авторизация не пройдена'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
