const express = require('express');
const dotenv = require('dotenv');

// Importa as rotas de usuário
const userRoutes = require('./routes/userRoutes.js');

// Configura o dotenv
dotenv.config();

// Inicia o Express
const app = express();

// Middleware essencial para o Express entender JSON
app.use(express.json()); 

/*
 * Definição da Rota Principal (API Prefix)
 * Todas as rotas definidas em 'userRoutes' serão prefixadas com '/api/v1'
 */
app.use('/api/v1', userRoutes);

// Rota de Teste (Raiz)
app.get('/', (req, res) => {
  res.json({ message: 'API rodando e estruturada!' });
});

// Exporta o 'app'
module.exports = app;