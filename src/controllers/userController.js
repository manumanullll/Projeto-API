const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// OBTEM A CHAVE SECRETA DO .env
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

// Função Auxiliar para criar o JWT
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

// --- 1. CREATE (Registro de Novo Usuário) ---

/**
 * Cria um novo usuário no banco de dados.
 * A senha é criptografada pelo hook pre('save') no modelo User.
 */
const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const novoUsuario = await User.create({
      nome,
      email,
      senha,
    });
    
    // Retorna 201 Created. A função toJSON (no modelo) garante que a senha seja omitida.
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
 */
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuários',
      error: error.message,
    });
  }
};

/**
 * Busca e retorna um usuário específico pelo seu ID.
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await User.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(usuario);

  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor ao buscar usuário',
      error: error.message,
    });
  }
};

// --- 3. UPDATE (Atualizar Usuário) ---

/**
 * Atualiza um usuário existente pelo seu ID.
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
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioDeletado = await User.findByIdAndDelete(id);

    if (!usuarioDeletado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso' });

  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor ao deletar usuário',
      error: error.message,
    });
  }
};

// --- 5. AUTH (Login de Usuário) ---

/**
 * Autentica o usuário pelo email e senha e retorna um token JWT.
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