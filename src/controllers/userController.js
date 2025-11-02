// Importa o modelo User
const User = require('../models/User.js');

/**
 * Cria um novo usuário no banco de dados.
 * Valida a entrada e trata erros de duplicidade ou falha de validação.
 * @param {object} req - O objeto de requisição (request) do Express.
 * @param {object} res - O objeto de resposta (response) do Express.
 * @returns {Promise<void>}
 */
const createUser = async (req, res) => {
  // Extrai nome, email e senha do corpo da requisição
  const { nome, email, senha } = req.body;

  try {
    // Tenta criar o usuário com os dados fornecidos
    // A criptografia da senha é tratada pelo "hook" pre-save no Modelo
    const novoUsuario = await User.create({
      nome,
      email,
      senha,
    });

    // Retorna o novo usuário criado com status 201 (Created)
    // A senha não será incluída graças ao `select: false` no Schema
    res.status(201).json(novoUsuario);
  
  } catch (error) {
    // Em caso de erro (ex: validação do Mongoose, email duplicado)
    // Retorna um status 400 (Bad Request) com a mensagem de erro
    res.status(400).json({ 
      message: 'Erro ao criar usuário', 
      error: error.message 
    });
  }
};

// Exporta as funções do controlador
module.exports = {
  createUser,
};