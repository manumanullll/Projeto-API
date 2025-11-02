const express = require('express');
const router = express.Router();

// Importa o controlador de usuário
const userController = require('../controllers/userController.js');

/*
 * Definição das Rotas de Usuário
 * Todas as rotas aqui são relativas a /api/v1/ (definido no app.js)
 */

// Rota para CRIAR (CREATE) um novo usuário
// POST /api/v1/usuarios
router.post('/usuarios', userController.createUser);

// (Futuramente, adicionaremos as outras rotas CRUD aqui)
// GET /api/v1/usuarios
// GET /api/v1/usuarios/:id
// PUT /api/v1/usuarios/:id
// DELETE /api/v1/usuarios/:id

// Exporta o router para ser usado pelo app.js
module.exports = router;