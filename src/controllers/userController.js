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
    const novoUsuario = await User.create({
      nome,
      email,
      senha,
    });
    
    // A senha não será incluída graças ao `select: false` no Schema
    res.status(201).json(novoUsuario);
  
  } catch (error) {
    // Retorna um status 400 (Bad Request) com a mensagem de erro
    res.status(400).json({ 
      message: 'Erro ao criar usuário', 
      error: error.message 
    });
  }
};

/**
 * Busca e retorna todos os usuários do banco de dados.
 * As senhas são omitidas da resposta (devido ao `select: false` no Schema).
 * @param {object} req - O objeto de requisição (request) do Express.
 * @param {object} res - O objeto de resposta (response) do Express.
 * @returns {Promise<void>}
 */
const getAllUsers = async (req, res) => {
  try {
    // .find() sem argumentos busca todos os documentos na coleção
    const usuarios = await User.find();

    // Retorna a lista de usuários com status 200 (OK)
    res.status(200).json(usuarios);

  } catch (error) {
    // Em caso de erro no servidor ou banco de dados
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuários',
      error: error.message,
    });
  }
};

/**
 * Busca e retorna um usuário específico pelo seu ID.
 * A senha é omitida da resposta.
 * @param {object} req - O objeto de requisição (request) do Express.
 * @param {object} res - O objeto de resposta (response) do Express.
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  // O ID é pego dos "parâmetros" da URL (ex: /usuarios/12345)
  const { id } = req.params;

  try {
    const usuario = await User.findById(id);

    // Validação (Requisito b): Retornar erro se não encontrar
    if (!usuario) {
      // Status 404 (Not Found) é o correto para "recurso não encontrado"
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna o usuário encontrado com status 200 (OK)
    res.status(200).json(usuario);

  } catch (error) {
    // Erro pode ser um ID mal formatado (Mongoose) ou erro de servidor
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuário',
      error: error.message,
    });
  }
};


// Exporta TODAS as funções do controlador
module.exports = {
  createUser,
  getAllUsers,   // <-- Nova função
  getUserById, // <-- Nova função
};