const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Importa o middleware de proteção

// --- ROTA DE AUTENTICAÇÃO E CRIAÇÃO DE USUÁRIOS ---

// 1. Rota de LOGIN (POST /login) - É pública por natureza.
router.post('/login', userController.loginUser); 

// 2. Rota de REGISTRO (POST /usuarios) - É OBRIGATÓRIA ser pública,
// pois o usuário precisa se registrar para obter o primeiro token.
router.post('/usuarios', userController.createUser); 

// --- ROTAS PROTEGIDAS PELO JWT (Escrita) ---
// O Requisito (e) pede para proteger CRIAR, ATUALIZAR, DELETAR.
// Vamos proteger PUT e DELETE, mas deixar o POST (registro) público.

// UPDATE - PROTEGIDA
router.put('/usuarios/:id', protect, userController.updateUser); 

// DELETE - PROTEGIDA
router.delete('/usuarios/:id', protect, userController.deleteUser); 

// --- ROTAS PÚBLICAS (Leitura) ---

// READ All
router.get('/usuarios', userController.getAllUsers);

// READ by ID
router.get('/usuarios/:id', userController.getUserById);

// Exporta o router
module.exports = router;