// Importações
const express = require('express');
const userRoutes = require('./routes/userRoutes.js');

// Inicia o Express
const app = express();

// --- MIDDLEWARES GLOBAIS ---
// 1. OBRIGATÓRIO: Esta linha DEVE vir antes de qualquer rota.
// Ela processa o JSON do corpo da requisição (req.body).
app.use(express.json()); 

// ----------------------------------------------------
// 2. ROTAS
// Define o prefixo '/api/v1' para todas as rotas de usuário
app.use('/api/v1', userRoutes);
// ----------------------------------------------------

// Rota de Teste (Raiz da API)
app.get('/', (req, res) => {
  res.json({ message: 'API rodando e estruturada!' });
});

// Exporta o 'app' para que o index.js possa iniciar o servidor
module.exports = app;