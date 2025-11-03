const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const jwtSecret = process.env.JWT_SECRET;

/**
 * Middleware de autenticação JWT.
 * Verifica se o token está presente e é válido.
 * @param {object} req - Requisição.
 * @param {object} res - Resposta.
 * @param {function} next - Próxima função a ser executada.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Procura o token no cabeçalho (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Exemplo: 'Bearer token_aqui' -> remove 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, jwtSecret);

      // 3. Busca o usuário do banco (para armazenar no req.user, sem a senha)
      // O token contém o ID do usuário (decoded.id)
      req.user = await User.findById(decoded.id).select('-senha');

      // Se o usuário não for encontrado (ex: foi deletado), interrompe
      if (!req.user) {
         return res.status(401).json({ message: 'Usuário do token não encontrado.' });
      }

      // 4. Passa para a próxima função (o Controller)
      next();
    } catch (error) {
      // Token inválido, expirado, ou erro na verificação
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token falhou ou é inválido.' });
    }
  }

  // Se não houver token no cabeçalho
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, token não encontrado.' });
  }
};

module.exports = { protect };