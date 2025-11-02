const express = require('express');
const router = express.Router();

// Importa o controlador de usuário (que agora tem 3 funções)
const userController = require('../controllers/userController.js');

/*
 * Definição das Rotas de Usuário
 * (Prefixadas com /api/v1 no app.js)
 */

// --- Rotas CRUD ---

// Rota para CRIAR (CREATE) um novo usuário
// POST /api/v1/usuarios
router.post('/usuarios', userController.createUser);

// Rota para LER (READ) todos os usuários
// GET /api/v1/usuarios
router.get('/usuarios', userController.getAllUsers);

// Rota para LER (READ) um usuário específico pelo ID
// GET /api/v1/usuarios/:id
router.get('/usuarios/:id', userController.getUserById);

// (Futuramente, adicionaremos PUT e DELETE aqui)


// Exporta o router
module.exports = router;