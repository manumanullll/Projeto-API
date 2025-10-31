// 1. Importa o Modelo de Usuário

const User = require('../models/User.js');
// 2. Cria a função "createUser" (assíncrona)
const createUser = async (req, res) => {
  // req (request) = O que recebemos do cliente (Ex: { nome: "João", ... })
  // res (response) = O que vamos enviar de volta para o cliente

  // Pega os dados do "body" (corpo) da requisição
  const { nome, email, senha } = req.body;

  // Bloco try...catch para tratamento de erros
  try {
    // 3. Tenta criar um novo usuário no banco usando o Modelo
    // O .create() já "salva" automaticamente no banco
    const novoUsuario = await User.create({
      nome,
      email,
      senha, // Lembre-se: o "hook" no User.js vai criptografar isso!
    });

    // 4. Se der certo, responde com o usuário criado
    // O status 201 (Created) é o padrão REST para "POST bem-sucedido"
    res.status(201).json(novoUsuario);

  } catch (error) {
    // 5. Se der errado (ex: email duplicado, campos faltando)
    // O Mongoose vai gerar um erro de validação (requisito f)

    // O status 400 (Bad Request) significa que o cliente enviou dados errados
    res.status(400).json({ 
      message: 'Erro ao criar usuário', 
      error: error.message 
    });
  }
};

// 6. Exporta o controlador
// Usamos chaves {} para podermos exportar MÚLTIPLAS funções deste arquivo
module.exports = {
  createUser,
};