// index.js (Ponto de entrada do servidor)

// ------------------- 1. CONFIGURAÇÃO DOTENV (PRIMEIRO DE TUDO) -------------------
const dotenv = require('dotenv');
dotenv.config(); // <-- ESTA LINHA DEVE SER EXECUTADA ANTES DE QUALQUER 'require'
// ---------------------------------------------------------------------------------

// 2. Importações
const mongoose = require('mongoose');
const app = require('./src/app.js'); // Use o .js no final

// 3. Define a porta e pega a String de Conexão
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 4. Conecta ao MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    // SUCESSO: Conectado ao banco, agora podemos ligar o servidor Express.
    console.log('Conectado ao MongoDB com sucesso!');

    // Inicia o servidor Express 
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}!`);
    });
  })
  .catch((error) => {
    // FALHA
    console.error('Erro ao conectar ao MongoDB:', error.message);
  });