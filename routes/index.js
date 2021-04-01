const router = require('express').Router();
const { ERROR_CODE_NOT_FOUND } = require('../errors/errorsStatus');
const auth = require('../middlewares/auth');
const { validateSignup, validateSignin, validateAuth } = require('../middlewares/validation');

const { createUser, login } = require('../controllers/users');
const cardRouter = require('./cards');
const userRouter = require('./users');

// роуты, не требующие авторизации
router.post('/signup', validateSignup, createUser);

router.post('/signin', validateSignin, login);

// авторизация
router.use(validateAuth, auth);

// роуты требующие автоизации
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: `Запрашиваемый ресурс по адресу '${req.path}' не найден` });
});

module.exports = router;
