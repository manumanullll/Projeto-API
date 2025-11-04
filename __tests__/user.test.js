// __tests__/user.test.js

const dotenv = require('dotenv');
dotenv.config(); // CARREGA O ARQUIVO .env AQUI (CRUCIAL PARA OS TESTES)

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User'); 

// Credenciais de teste
const TEST_CREDENTIALS = {
  nome: 'Teste Jest',
  email: 'teste.jest@api.com',
  senha: 'password123',
};

let testUserId;
let testUserToken;

// --- CONFIGURAÇÃO DE TESTE (SETUP E TEARDOWN) ---

// Conecta ao banco de dados ANTES de todos os testes
beforeAll(async () => {
    // Usa a string de conexão do .env
    await mongoose.connect(process.env.MONGO_URI);
});

// Depois de todos os testes, desconecta e limpa o banco
afterAll(async () => {
    // Limpa todos os usuários criados durante os testes
    await User.deleteMany({});
    // DESCONECTA o Mongoose
    await mongoose.connection.close();
});
// Fim da configuração de teste

describe('Testes de Autenticação e CRUD (USUÁRIOS)', () => {

    // ==========================================================
    // TESTE 1: REGISTRO (CREATE) - Requisito (h) e (f)
    // ==========================================================
    it('POST /usuarios - Deve registrar um novo usuário com sucesso e retornar 201', async () => {
        const response = await request(app)
            .post('/api/v1/usuarios')
            .send(TEST_CREDENTIALS);

        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe(TEST_CREDENTIALS.email);
        expect(response.body.senha).toBeUndefined(); // Verifica que a senha não foi retornada (função toJSON)
        testUserId = response.body._id; // Salva o ID para testes futuros
    });

    // ==========================================================
    // TESTE 2: LOGIN (AUTH)
    // ==========================================================
    it('POST /login - Deve fazer login com sucesso e retornar um token JWT', async () => {
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email: TEST_CREDENTIALS.email,
                senha: TEST_CREDENTIALS.senha,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        testUserToken = response.body.token; // Salva o token para testes protegidos
    });

    // ==========================================================
    // TESTE 3: PROTEÇÃO DE ROTA (PUT) - Requisito (e) e (h)
    // ==========================================================
    it('PUT /usuarios/:id - Deve retornar 401 Unauthorized sem token', async () => {
        const response = await request(app)
            .put(`/api/v1/usuarios/${testUserId}`)
            .send({ nome: 'Nome Bloqueado' });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Não autorizado, token não encontrado.');
    });

    // ==========================================================
    // TESTE 4: ATUALIZAÇÃO BEM-SUCEDIDA (PUT)
    // ==========================================================
    it('PUT /usuarios/:id - Deve atualizar o nome do usuário com token válido e retornar 200', async () => {
        const NOVO_NOME = 'Teste Atualizado';

        const response = await request(app)
            .put(`/api/v1/usuarios/${testUserId}`)
            .set('Authorization', `Bearer ${testUserToken}`) // Envia o token
            .send({ nome: NOVO_NOME });

        expect(response.statusCode).toBe(200);
        expect(response.body.nome).toBe(NOVO_NOME);
    });

    // ==========================================================
    // TESTE 5: BUSCA POR ID (READ)
    // ==========================================================
    it('GET /usuarios/:id - Deve buscar o usuário pelo ID e retornar 200', async () => {
        const response = await request(app).get(`/api/v1/usuarios/${testUserId}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(testUserId);
        expect(response.body.email).toBe(TEST_CREDENTIALS.email);
    });
    
    // ==========================================================
    // TESTE 6: VALIDAÇÃO DE DUPLICIDADE (Requisito f e h)
    // ==========================================================
    it('POST /usuarios - Deve retornar 400 ao tentar registrar email duplicado', async () => {
        const response = await request(app)
            .post('/api/v1/usuarios')
            .send(TEST_CREDENTIALS); // Usando o mesmo email

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('E11000'); // Mongoose duplicate key error
    });

    // ==========================================================
    // TESTE 7: EXCLUSÃO (DELETE)
    // ==========================================================
    it('DELETE /usuarios/:id - Deve excluir o usuário com token e retornar 200', async () => {
        const response = await request(app)
            .delete(`/api/v1/usuarios/${testUserId}`)
            .set('Authorization', `Bearer ${testUserToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Usuário deletado com sucesso');
    });

    // ==========================================================
    // TESTE 8: VERIFICAÇÃO DE EXCLUSÃO (404)
    // ==========================================================
    it('GET /usuarios/:id - Deve retornar 404 Not Found após exclusão', async () => {
        const response = await request(app).get(`/api/v1/usuarios/${testUserId}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Usuário não encontrado');
    });
});