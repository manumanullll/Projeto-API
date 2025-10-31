// Importações
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importa nossa aplicação Express
const app = require('./src/app'); 

// Configura o DotEnv
dotenv.config();

// Define a porta
const PORT = process.env.PORT || 3000;

// Pega a String de Conexão
const MONGO_URI = process.env.MONGO_URI;

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