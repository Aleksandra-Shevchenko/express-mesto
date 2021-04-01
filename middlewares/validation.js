const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

// вспомогательная ф-ия проверки id
const checkedId = Joi.string()
  .required()
  .custom((value, helpers) => {
    if (ObjectId.isValid(value)) return value;
    return helpers.message('Невалидный id');
  });

const validateAuth = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

const validateCard = celebrate({
  params: Joi.object().keys({
    cardId: checkedId,
  }),
});

const validateUser = celebrate({
  params: Joi.object().keys({
    userId: checkedId,
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

module.exports = {
  validateCreateCard,
  validateCard,
  validateUser,
  validateSignup,
  validateSignin,
  validateAuth,
  validateUserProfile,
  validateUserAvatar,
};
