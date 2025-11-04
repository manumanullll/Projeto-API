const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Importa o middleware de proteção

/*
 * Definição das Rotas de Usuário
 * (Prefixadas com /api/v1 no app.js)
 */

// --- ROTA DE AUTENTICAÇÃO E CRIAÇÃO ---

// Rota de LOGIN (Pública)
router.post('/login', userController.loginUser); 

// Rota de REGISTRO (Pública, para o usuário obter o primeiro token)
router.post('/usuarios', userController.createUser); 

// --- ROTAS PROTEGIDAS PELO JWT (Escrita) ---

// UPDATE - PROTEGIDA
router.put('/usuarios/:id', protect, userController.updateUser); 

// DELETE - PROTEGIDA
router.delete('/usuarios/:id', protect, userController.deleteUser); 

// --- ROTAS PÚBLICAS (Leitura) ---

// READ All
router.get('/usuarios', userController.getAllUsers);

// READ by ID
router.get('/usuarios/:id', userController.getUserById);


module.exports = router;