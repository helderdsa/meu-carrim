# API de Usuários - Meu Carrim

## Endpoints Disponíveis

### Base URL
```
http://localhost:3001/api
```

### 1. Registro de Usuário
**POST** `/users/register`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "avatar": "https://exemplo.com/avatar.jpg" // opcional
}
```

**Resposta:**
```json
{
  "status": "SUCCESS",
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "clxxx",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "USER",
    "avatar": null,
    "createdAt": "2025-08-08T...",
    "updatedAt": "2025-08-08T..."
  }
}
```

### 2. Login
**POST** `/users/login`

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "status": "SUCCESS",
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "clxxx",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "USER",
      "avatar": null,
      "createdAt": "2025-08-08T...",
      "updatedAt": "2025-08-08T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obter Perfil
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "clxxx",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "USER",
    "avatar": null,
    "createdAt": "2025-08-08T...",
    "updatedAt": "2025-08-08T..."
  }
}
```

### 4. Atualizar Perfil
**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "João Santos", // opcional
  "email": "joao.santos@email.com", // opcional
  "avatar": "https://novo-avatar.jpg" // opcional
}
```

### 5. Obter Usuário por ID
**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer {token}
```

### 6. Listar Todos os Usuários (Admin)
**GET** `/users`

**Headers:**
```
Authorization: Bearer {token_admin}
```

### 7. Atualizar Usuário (Admin)
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer {token_admin}
```

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "avatar": "https://novo-avatar.jpg"
}
```

### 8. Deletar Usuário (Admin)
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer {token_admin}
```

### 9. Promover a Admin (Desenvolvimento)
**POST** `/users/:id/promote`

**Body:** Vazio

## Códigos de Status

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Erro de validação
- **401** - Não autorizado
- **403** - Acesso negado
- **404** - Não encontrado
- **500** - Erro interno do servidor

## Testando com curl

### Registro:
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

### Perfil (substituir TOKEN):
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```
