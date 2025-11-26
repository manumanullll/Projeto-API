// __tests__/app.test.js

const request = require('supertest');
const app = require('../src/app');

// Grupo de testes para a rota principal
describe('Testes de Saúde da API', () => {

  // Testa a rota principal (GET /)
  it('Deve responder com status 200 na rota principal', async () => {
    const response = await request(app).get('/');

    // 1. Espera que o status da resposta seja 200
    expect(response.statusCode).toBe(200);

    // 2. Espera que o corpo da resposta contenha a mensagem de OK
    expect(response.body.message).toEqual('API rodando e estruturada em /src/app.js!');
  });

});