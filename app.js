const express = require('express');
const mongoose = require('mongoose');

const ERROR_CODE_VALIDATION = 400;
const ERROR_CODE_CAST = 404;
const ERROR_CODE_SERVER = 404;

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
});

// добавляем в каждый запрос объект user
app.use((req, res, next) => {
  req.user = { _id: '60522a5cb72010206ce86de4' };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// обрабатываем ошибки
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError') {
    res.status(ERROR_CODE_CAST)
      .send({ message: 'Карточка или пользователь не найден' });
  }
  if (err.name === 'ValidationError') {
    res.status(ERROR_CODE_VALIDATION)
      .send({
        message: `Переданы некорректные данные в методы создания карточки,
          пользователя, обновления аватара пользователя или профиля`,
      });
  }
  res.status(ERROR_CODE_SERVER).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
