const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const { ERROR_CODE_VALIDATION, ERROR_CODE_SERVER, ERROR_CODE_USER_EXIST } = require('./errors/errorsStatus');

const { PORT = 3000 } = process.env;
const app = express();

// парсим данные (собираем пакеты)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

// корневой роут
app.use(router);

// обработчики ошибок celebrate
app.use(errors());

// обрабатываем ошибки
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({ message: 'Переданы некорректные данные' });
  } else if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
  } else if (err.name === 'MongoError' && err.code === 11000) {
    res.status(ERROR_CODE_USER_EXIST)
      .send({ message: 'Пользователь с таким email уже существует' });
  } else {
    const { statusCode = ERROR_CODE_SERVER, message } = err;
    res.status(statusCode)
      .send({ message: statusCode === ERROR_CODE_SERVER ? 'На сервере произошла ошибка' : message });
  }
  next();
});

app.listen(PORT, () => PORT);
