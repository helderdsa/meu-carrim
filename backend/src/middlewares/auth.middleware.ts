import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth.utils';
import { prisma } from '../index';
import { AuthRequest } from '../types/user.types';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ 
        status: 'ERROR', 
        message: 'Token de acesso requerido' 
      });
      return;
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    const { userId } = AuthUtils.verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(401).json({ 
        status: 'ERROR', 
        message: 'Usuário não encontrado' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      status: 'ERROR', 
      message: 'Token inválido' 
    });
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      status: 'ERROR', 
      message: 'Usuário não autenticado' 
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ 
      status: 'ERROR', 
      message: 'Acesso negado. Apenas administradores.' 
    });
    return;
  }

  next();
};
