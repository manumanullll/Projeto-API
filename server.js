// 1. Importar o Express
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 2. configurar o DotEnv
dotenv.config();

// 3. Iniciar o Express
const app = express();

// 4. Definir uma porta
const PORT = process.env.PORT || 3000;

// 5. Pegar a string de conecxão do .env
const MONGO_URI = process.env.MONGO_URI;

// 6. Conectar ao MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    
    // 7. Inicar o servidor Express 
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`);
    });
})
.catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error.message);
});

// 8. Rota de "Olá, ProjetoAPI"
app.get('/', (req, res) => {
    res.json({ message: 'Olá, ProjetoAPI v2 - Conectado ao Banco!'});
});