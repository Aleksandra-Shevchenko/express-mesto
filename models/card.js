const mongoose = require('mongoose');

// описание схемы карточки
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле с названием не может быть пустым'],
    minlength: [2, 'название карточки не может быть короче двух символов'],
    maxlength: [30, 'название карточки не может быть длиннее 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'ссылка на фото обязательна'],
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
