export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} é obrigatório`);
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Formato de email inválido');
  }
};

export const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }
};

export const validateId = (id: string | undefined): string => {
  if (!id) {
    throw new Error('ID é obrigatório');
  }
  return id;
};
