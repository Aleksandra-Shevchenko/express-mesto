const mongoose = require('mongoose');

// описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле с именем не может быть пустым'],
    minlength: [2, 'имя пользователя не может быть короче двух символов'],
    maxlength: [30, 'имя пользователя не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'поле с именем не может быть пустым'],
    minlength: [2, 'информация о пользователе не может быть короче двух символов'],
    maxlength: [30, 'информация о пользователе не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
