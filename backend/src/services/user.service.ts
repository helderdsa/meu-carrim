import { prisma } from '../index';
import { AuthUtils } from '../utils/auth.utils';
import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  LoginRequest, 
  UserResponse, 
  LoginResponse 
} from '../types/user.types';

export class UserService {
  // Criar usuário
  static async createUser(data: CreateUserRequest): Promise<UserResponse> {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await AuthUtils.hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        avatar: data.avatar,
        role: 'USER' // Por padrão todos são USER, apenas o primeiro pode ser ADMIN
      }
    });

    return this.formatUserResponse(user);
  }

  // Login
  static async login(data: LoginRequest): Promise<LoginResponse> {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await AuthUtils.comparePassword(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token
    const token = AuthUtils.generateToken(user.id);

    return {
      user: this.formatUserResponse(user),
      token
    };
  }

  // Buscar usuário por ID
  static async getUserById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return this.formatUserResponse(user);
  }

  // Buscar todos os usuários (apenas admin)
  static async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => this.formatUserResponse(user));
  }

  // Atualizar usuário
  static async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Se está tentando atualizar email, verificar se já existe
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        throw new Error('Email já está em uso');
      }
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        avatar: data.avatar
      }
    });

    return this.formatUserResponse(user);
  }

  // Deletar usuário
  static async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.user.delete({
      where: { id }
    });
  }

  // Promover usuário a admin (apenas para desenvolvimento)
  static async promoteToAdmin(id: string): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' }
    });

    return this.formatUserResponse(user);
  }

  // Formatar resposta do usuário (remover senha)
  private static formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
