# Meu Carrim - Backend

Backend da aplicação de organização de compras domésticas desenvolvido com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem tipada
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MySQL Server
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd meu-carrim
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações do MySQL e outras variáveis.

4. Configure o banco de dados:
```bash
# Gera o cliente Prisma
npm run db:generate

# Aplica o schema ao banco (desenvolvimento)
npm run db:push

# Ou use migrations (produção)
npm run db:migrate
```

## 🏃‍♂️ Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📊 Endpoints de Teste

- **Health Check**: `GET /health`
- **Teste DB**: `GET /db-test`

## 🗄️ Estrutura do Banco

### Usuários (users)
- id, name, email, password, role, avatar
- Relacionamento: Um usuário pode ter várias listas

### Listas de Compras (shopping_lists)
- id, name, description, isCompleted
- Relacionamento: Pertence a um usuário, tem vários itens

### Produtos (products)
- id, name, image, description
- Relacionamento: Pode estar em várias listas, tem histórico de preços

### Categorias (categories)
- id, name, description, color, icon
- Relacionamento: Uma categoria pode ter vários produtos

### Itens da Lista (shopping_list_items)
- id, quantity, isPurchased, notes, estimatedPrice
- Relacionamento: Liga listas e produtos

### Mercados (markets)
- id, name, address, city, state, zipCode, coordinates
- Relacionamento: Tem histórico de preços

### Histórico de Preços (price_history)
- id, price, purchaseDate
- Relacionamento: Liga produtos e mercados

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia versão compilada
- `npm run db:generate` - Gera cliente Prisma
- `npm run db:push` - Aplica schema ao banco
- `npm run db:migrate` - Executa migrations
- `npm run db:studio` - Abre Prisma Studio

## 📝 Próximos Passos

1. Instalar dependências: `npm install`
2. Configurar variáveis de ambiente no `.env`
3. Configurar banco MySQL
4. Executar `npm run db:generate && npm run db:push`
5. Executar `npm run dev`
