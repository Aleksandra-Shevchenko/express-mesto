const router = require('express').Router();

const { ERROR_CODE_NOT_FOUND } = require('../errors/errorsStatus');
const cardRouter = require('./cards');
const userRouter = require('./users');

// роуты
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: `Запрашиваемый ресурс по адресу '${req.path}' не найден` });
});

module.exports = router;
