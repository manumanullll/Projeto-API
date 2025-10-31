// Importações
const express = require('express');
const dotenv = require('dotenv');

// Configura o dotenv (se necessário, embora seja melhor no index)
dotenv.config();

// Inicia o Express
const app = express();

// Middlewares
app.use(express.json()); // ESSENCIAL: Faz o Express entender JSON no body

// Rota de Teste (a que já temos)
app.get('/', (req, res) => {
  res.json({ message: 'API rodando e estruturada em /src/app.js!' });
});

// Exporta o 'app' para ser usado em outros arquivos
module.exports = app;