// Importações
const express = require('express');
const dotenv = require('dotenv');

// Importa as rotas de usuário (LINHA QUE FALTAVA)
const userRoutes = require('./routes/userRoutes.js');

// Configura o dotenv
dotenv.config();

// Inicia o Express
const app = express();

// Middlewares
app.use(express.json()); // ESSENCIAL: Faz o Express entender JSON no body

/*
 * Definição da Rota Principal (API Prefix)
 * Todas as rotas definidas em 'userRoutes' serão prefixadas com '/api/v1'
 * (LINHA QUE FALTAVA)
 */
app.use('/api/v1', userRoutes);

// Rota de Teste (a que já temos)
app.get('/', (req, res) => {
  res.json({ message: 'API rodando e estruturada em /src/app.js!' });
});

// Exporta o 'app' para ser usado em outros arquivos
module.exports = app;