const User = require('../models/User.js');

// No topo do userController.js (após const User = require...)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- NOVO

// OBTEM A CHAVE SECRETA DO .env
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

// Função Auxiliar para criar o JWT (Usaremos no login e registro)
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

// --- 1. CREATE (Registro de Novo Usuário) ---

/**
 * Cria um novo usuário no banco de dados.
 * A senha é criptografada pelo hook pre('save') no modelo User.
 * @param {object} req - O objeto de requisição (request).
 * @param {object} res - O objeto de resposta (response).
 * @returns {Promise<void>}
 */
const createUser = async (req, res) => {
  // Extrai nome, email e senha do corpo da requisição (req.body)
  const { nome, email, senha } = req.body;

  try {
    const novoUsuario = await User.create({
      nome,
      email,
      senha,
    });
    
    // Retorna 201 Created. A senha é automaticamente omitida pela configuração select: false.
    res.status(201).json(novoUsuario);
  
  } catch (error) {
    // Retorna 400 Bad Request em caso de erro de validação (ex: email duplicado, campos vazios)
    res.status(400).json({ 
      message: 'Erro ao criar usuário', 
      error: error.message 
    });
  }
};

// --- 2. READ (Buscar Usuários) ---

/**
 * Busca e retorna todos os usuários do banco de dados.
 * @param {object} req - O objeto de requisição (request).
 * @param {object} res - O objeto de resposta (response).
 * @returns {Promise<void>}
 */
const getAllUsers = async (req, res) => {
  try {
    // .find() sem argumentos busca todos.
    const usuarios = await User.find();

    // Retorna 200 OK
    res.status(200).json(usuarios);

  } catch (error) {
    // 500 Internal Server Error para erros de servidor ou banco
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuários',
      error: error.message,
    });
  }
};

/**
 * Busca e retorna um usuário específico pelo seu ID.
 * @param {object} req - O objeto de requisição (request).
 * @param {object} res - O objeto de resposta (response).
 * @returns {Promise<void>}
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await User.findById(id);

    if (!usuario) {
      // Retorna 404 Not Found se o ID não corresponder a nenhum recurso
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna 200 OK
    res.status(200).json(usuario);

  } catch (error) {
    // Retorna 500 para IDs mal formatados ou erros de servidor
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuário',
      error: error.message,
    });
  }
};

// --- 3. UPDATE (Atualizar Usuário) ---

/**
 * Atualiza um usuário existente pelo seu ID (PUT/PATCH).
 * Utiliza .save() para garantir que a senha seja criptografada se for alterada.
 * @param {object} req - O objeto de requisição (request).
 * @param {object} res - O objeto de resposta (response).
 * @returns {Promise<void>}
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body; 

  try {
    // 1. Encontra o usuário, forçando a inclusão da senha para o hook funcionar
    const usuario = await User.findById(id).select('+senha');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // 2. Atualiza os campos do objeto
    Object.keys(updates).forEach((key) => {
      // Ignora chaves que não deveriam ser alteradas
      if (key !== '_id' && key !== 'createdAt' && key in usuario) { 
        usuario[key] = updates[key];
      }
    });

    // 3. Salva: dispara validadores e o hook do bcrypt para a senha
    const usuarioAtualizado = await usuario.save();

    // Retorna 200 OK
    res.status(200).json(usuarioAtualizado);

  } catch (error) {
    // 400 Bad Request para erros de validação
    res.status(400).json({ 
      message: 'Erro ao atualizar usuário', 
      error: error.message 
    });
  }
};

// --- 4. DELETE (Excluir Usuário) ---

/**
 * Deleta um usuário específico pelo seu ID.
 * @param {object} req - O objeto de requisição (request).
 * @param {object} res - O objeto de resposta (response).
 * @returns {Promise<void>}
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Encontra e remove o documento
    const usuarioDeletado = await User.findByIdAndDelete(id);

    if (!usuarioDeletado) {
      // Retorna 404 Not Found se o usuário não existir
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna 200 OK e a confirmação de que foi excluído
    res.status(200).json({ message: 'Usuário deletado com sucesso' });

  } catch (error) {
    // 500 Internal Server Error
    res.status(500).json({
      message: 'Erro interno do servidor ao deletar usuário',
      error: error.message,
    });
  }
};

// --- 5. AUTH (Login de Usuário) ---

/**
 * Autentica o usuário pelo email e senha e retorna um token JWT.
 * @param {object} req - O objeto de requisição (contém email e senha).
 * @param {object} res - O objeto de resposta (retorna o token).
 * @returns {Promise<void>}
 */
const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Buscar o usuário pelo email, forçando a inclusão da senha (.select('+senha'))
    const usuario = await User.findOne({ email }).select('+senha');

    // 2. Verifica se o usuário existe
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Comparar a senha fornecida (texto puro) com o hash no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      // 401 Unauthorized é o padrão para falha de autenticação
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 4. Se a senha estiver correta, gera o token
    const token = generateToken(usuario._id);

    // 5. Resposta de sucesso (200 OK)
    res.status(200).json({ 
      token, 
      userId: usuario._id,
      message: 'Login bem-sucedido.'
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno durante o login.', 
      error: error.message 
    });
  }
};

// Exporta TODAS as funções do controlador
module.exports = {
  createUser,
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  loginUser,
}; 