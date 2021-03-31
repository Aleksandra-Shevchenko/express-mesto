const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const router = require('./routes');
const { ERROR_CODE_VALIDATION, ERROR_CODE_SERVER } = require('./errors/errorsStatus');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

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

// добавляем в каждый запрос объект user
// app.use((req, res, next) => {
//   req.user = { _id: '60522a5cb72010206ce86de4' };
//   next();
// });

// {
//   "name": "Саша",
//   "about": "Учусь",
//   "avatar": "https://pp.userapi.com/c841534/v841534121/279eb/BBho6Z1jAD8.jpg",
//   "_id": "60643a38ca749230f83bd723",
//   "email": "sasha@mail.ru",
//   "password": "$2a$10$do3x0AYnSBm1EX7VFid6gupTn5Vpe0ei4Yip5Jol/Tipe6GD.9Aiq",
//   "__v": 0
// }

// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY0M2EzOGNhNzQ5MjMwZjgzYmQ3MjMiLCJpYXQiOjE2MTcxODE0MDUsImV4cCI6MTYxNzc4NjIwNX0.Ny6pzhaqTrj6xLpqeabxp0rh7lnLhgvb3gnh5QJnszg"
// }

// роуты, не требующие авторизации
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

// корневой роут карточки и пользователи
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
