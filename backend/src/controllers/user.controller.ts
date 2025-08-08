import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../types/user.types';
import { validateId } from '../utils/validation.utils';

export class UserController {
  // Registrar usuário
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, avatar } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Nome, email e senha são obrigatórios'
        });
        return;
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Formato de email inválido'
        });
        return;
      }

      // Validar senha
      if (password.length < 6) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Senha deve ter pelo menos 6 caracteres'
        });
        return;
      }

      const user = await UserService.createUser({
        name,
        email,
        password,
        avatar
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Usuário criado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: 'ERROR',
          message: 'Email e senha são obrigatórios'
        });
        return;
      }

      const result = await UserService.login({ email, password });

      res.json({
        status: 'SUCCESS',
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Obter perfil do usuário logado
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'ERROR',
          message: 'Usuário não autenticado'
        });
        return;
      }

      const user = await UserService.getUserById(req.user.id);

      res.json({
        status: 'SUCCESS',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Obter usuário por ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const user = await UserService.getUserById(id);

      res.json({
        status: 'SUCCESS',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Obter todos os usuários (apenas admin)
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();

      res.json({
        status: 'SUCCESS',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Atualizar perfil
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'ERROR',
          message: 'Usuário não autenticado'
        });
        return;
      }

      const { name, email, avatar } = req.body;

      const user = await UserService.updateUser(req.user.id, {
        name,
        email,
        avatar
      });

      res.json({
        status: 'SUCCESS',
        message: 'Perfil atualizado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Atualizar usuário por ID (apenas admin)
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const { name, email, avatar } = req.body;

      const user = await UserService.updateUser(id, {
        name,
        email,
        avatar
      });

      res.json({
        status: 'SUCCESS',
        message: 'Usuário atualizado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Deletar usuário (apenas admin)
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      await UserService.deleteUser(id);

      res.json({
        status: 'SUCCESS',
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  // Promover usuário a admin (rota especial para desenvolvimento)
  static async promoteToAdmin(req: Request, res: Response): Promise<void> {
    try {
      const id = validateId(req.params.id);
      const user = await UserService.promoteToAdmin(id);

      res.json({
        status: 'SUCCESS',
        message: 'Usuário promovido a administrador',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}
