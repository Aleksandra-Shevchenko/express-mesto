const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_CODE_VALIDATION, ERROR_CODE_SERVER } = require('./errors/errorsStatus');

const { PORT = 3000 } = process.env;
const app = express();

// парсим данные (собираем пакеты)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// добавляем в каждый запрос объект user
app.use((req, res, next) => {
  req.user = { _id: '60522a5cb72010206ce86de4' };
  next();
});

// корневой роут
app.use(router);

// обрабатываем ошибки
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({ message: 'Переданы некорректные данные' });
  } else if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
  } else {
    const { statusCode = ERROR_CODE_SERVER, message } = err;
    res.status(statusCode)
      .send({ message: statusCode === ERROR_CODE_SERVER ? 'На сервере произошла ошибка' : message });
  }
  next();
});

app.listen(PORT, () => PORT);
