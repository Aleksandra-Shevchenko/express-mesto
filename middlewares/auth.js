// код для авторизации запроса
// Он должен верифицировать токен из заголовков.
// Если с токеном всё в порядке, мидлвэр должен добавлять пейлоуд токена в объект запроса и вызывать next.

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401).send({ message: 'нет заголовка ' });
  }

  // сохранили в переменную token наш jwt
  const token = authorization.replace('Bearer ', '');

  // верифицируем токен
  let payload;

  try {
    payload = jwt.verify(token, 'd6b5d9064c9d700530a9421b4db0c066');
  } catch (err) {
    return res
      .status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  // console.log(req.user._id);

  next();
};

module.exports = {
  auth,
};
