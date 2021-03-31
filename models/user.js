const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// описание схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: [true, 'поле с именем не может быть пустым'],
    minlength: [2, 'имя пользователя не может быть короче двух символов'],
    maxlength: [30, 'имя пользователя не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: [true, 'поле с именем не может быть пустым'],
    minlength: [2, 'информация о пользователе не может быть короче двух символов'],
    maxlength: [30, 'информация о пользователе не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: [true, 'ссылка на фото обязательна'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function getUserIfAuth(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль 401'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль 401'));
          }
          return user;
        });
    });
};

userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
