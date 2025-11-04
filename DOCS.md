# Documentação API de Gerenciamento de Usuários (v1)

Esta API RESTful gerencia a entidade Usuários, oferecendo operações CRUD completas e protegidas por JSON Web Token (JWT).

**Base URL:** `/api/v1`

---

##  Autenticação e Segurança (Requisito E)

Todas as rotas de escrita (PUT/DELETE) exigem o cabeçalho `Authorization`.

| Endpoint | Método | Descrição | Status Esperado |
| `/login` | **POST** | Autentica o usuário e emite o token JWT. | **200 OK** (Com Token) |

### Exemplo de Request para Login

```http
POST /api/v1/login HTTP/1.1
Content-Type: application/json

{
  "email": "secure@test.com",
  "senha": "123456"
}