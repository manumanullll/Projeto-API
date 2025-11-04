const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Necessário para buscar o usuário

const jwtSecret = process.env.JWT_SECRET; // Lendo do .env

/**
 * Middleware de autenticação JWT.
 * Verifica se o token está presente e é válido.
 */
const protect = async (req, res, next) => {
  let token;

  // Procura o token no cabeçalho (Formato: 'Bearer TOKEN_STRING')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extrai o token

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, jwtSecret);

      // Busca o usuário do banco (sem a senha)
      req.user = await User.findById(decoded.id).select('-senha');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Usuário do token não encontrado.' });
      }

      next(); // Token válido, prossegue
    } catch (error) {
      // Captura token inválido (expirado ou malformado)
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