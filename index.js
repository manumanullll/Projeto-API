// No seu index.js
// ------------------- IMPORTANTE -------------------
// 1. Configurar o DotEnv na PRIMEIRA LINHA de código para garantir que todas as vars estejam prontas
const dotenv = require('dotenv');
dotenv.config(); // <-- ESTA LINHA DEVE SER EXECUTADA ANTES DE TUDO
// --------------------------------------------------

// Importações
const mongoose = require('mongoose');
const app = require('./src/app'); 

// Define a porta
const PORT = process.env.PORT || 3000;

// Pega a String de Conexão
const MONGO_URI = process.env.MONGO_URI;

// ... (restante do código de conexão)
// Conecta ao MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');

    // Inicia o servidor Express (que importamos do app.js)
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
  });