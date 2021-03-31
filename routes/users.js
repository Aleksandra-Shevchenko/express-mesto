const router = require('express').Router();
const {
  getUsers,
  findUser,
  updateUserAvatar,
  updateUserProfile,
  currentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователя по _id
router.get('/:userId', findUser);

// возвращает информацию о текущем пользователе
router.get('/me', currentUser);

// обновляет профиль
router.patch('/me', updateUserProfile);

// обновляет аватар
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
