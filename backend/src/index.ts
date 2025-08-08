import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Prisma Client
export const prisma = new PrismaClient();

// Cria a aplicação Express
const app = express();

// Configurações de segurança e middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', routes);

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de teste do banco de dados
app.get('/db-test', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'OK', 
      message: 'Conexão com banco de dados estabelecida!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Erro ao conectar com o banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Middleware de tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado!' : err.message
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'ERROR',
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3001;

// Inicia o servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Teste DB: http://localhost:${PORT}/db-test`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, fechando servidor...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, fechando servidor...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Servidor fechado.');
    process.exit(0);
  });
});
