// 1. Importar o Express
const express = require('express');

// 2. Iniciar o Express
const app = express();

// 3. Definir uma porta
const PORT = process.env.PORT || 3000;

// 4. Criar nossa primeira rota (o "Endpoint")
app.get('/', (req, res) => {
  res.json({ message: 'Olá, ProjetoAPI' });
});

// 5. Iniciar o servidor e fazê-lo "ouvir" a porta
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});