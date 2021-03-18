const router = require('express').Router();
const {
  getUsers,
  findUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователя по _id
router.get('/:userId', findUser);

// создаёт пользователя
router.post('/', createUser);

// обновляет профиль
router.patch('/me', updateUserProfile);

// обновляет аватар
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
