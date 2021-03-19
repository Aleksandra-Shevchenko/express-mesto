const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_CAST = 404;
const ERROR_CODE_SERVER = 404;

const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

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

// роуты
app.use('/users', userRouter);
app.use('/cards', cardRouter);

// обрабатываем ошибки
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError' || err.name === 'Error') {
    res.status(ERROR_CODE_CAST)
      .send({ message: 'карточка или пользователь по указанному _id не найден' });
  } else if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
  } else {
    res.status(ERROR_CODE_SERVER).send({ message: 'на сервере произошла ошибка' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
