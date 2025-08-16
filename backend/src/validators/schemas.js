const Joi = require('joi');

// Schema para validação de produtos
const produtoSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Nome do produto é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  valor: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Valor deve ser positivo',
      'any.required': 'Valor é obrigatório'
    }),
  quantidade_estoque: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.integer': 'Quantidade deve ser um número inteiro',
      'number.min': 'Quantidade não pode ser negativa',
      'any.required': 'Quantidade em estoque é obrigatória'
    }),
  ativo: Joi.boolean().default(true)
});

// Schema para validação de controle de estoque
const estoqueSchema = Joi.object({
  id_produto: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.positive': 'ID do produto deve ser positivo',
      'any.required': 'ID do produto é obrigatório'
    }),
  quantidade: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.positive': 'Quantidade deve ser positiva',
      'any.required': 'Quantidade é obrigatória'
    }),
  data_compra: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.max': 'Data de compra não pode ser no futuro',
      'any.required': 'Data de compra é obrigatória'
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.positive': 'ID do usuário deve ser positivo',
      'any.required': 'ID do usuário é obrigatório'
    })
});

// Schema para validação de usuário
const usuarioSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  senha: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.max': 'Senha deve ter no máximo 128 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  administrador: Joi.boolean().default(false)
});

// Schema para login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  senha: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha é obrigatória'
    })
});

// Middleware de validação
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        sucesso: false,
        error: 'Dados inválidos',
        detalhes: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  produtoSchema,
  estoqueSchema,
  usuarioSchema,
  loginSchema,
  validate
};
