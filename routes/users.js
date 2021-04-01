const router = require('express').Router();
const {
  getUsers,
  findUser,
  findCurrentUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает информацию о текущем пользователе
router.get('/me', findCurrentUser);

// возвращает пользователя по _id
router.get('/:userId', findUser);

// обновляет профиль
router.patch('/me', updateUserProfile);

// обновляет аватар
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
