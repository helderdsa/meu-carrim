import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schemas de validação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const shoppingListSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

export const shoppingListItemSchema = z.object({
  productId: z
    .string()
    .min(1, 'Produto é obrigatório'),
  quantity: z
    .number()
    .min(0.1, 'Quantidade deve ser maior que 0')
    .max(999, 'Quantidade deve ser menor que 1000'),
  price: z
    .number()
    .min(0, 'Preço deve ser maior ou igual a 0')
    .optional(),
  unit: z
    .string()
    .min(1, 'Unidade é obrigatória')
    .max(20, 'Unidade deve ter no máximo 20 caracteres'),
  notes: z
    .string()
    .max(200, 'Observações devem ter no máximo 200 caracteres')
    .optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  imageUrl: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .min(1, 'Categoria é obrigatória'),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  description: z
    .string()
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor deve estar no formato hexadecimal (#RRGGBB)')
    .optional(),
});

export const marketSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  address: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional(),
  city: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional(),
  state: z
    .string()
    .max(50, 'Estado deve ter no máximo 50 caracteres')
    .optional(),
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000')
    .optional()
    .or(z.literal('')),
  latitude: z
    .number()
    .min(-90, 'Latitude deve estar entre -90 e 90')
    .max(90, 'Latitude deve estar entre -90 e 90')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude deve estar entre -180 e 180')
    .max(180, 'Longitude deve estar entre -180 e 180')
    .optional(),
});

export const priceHistorySchema = z.object({
  price: z
    .number()
    .min(0, 'Preço deve ser maior ou igual a 0')
    .max(999999, 'Preço deve ser menor que 1.000.000'),
  productId: z
    .string()
    .min(1, 'Produto é obrigatório'),
  marketId: z
    .string()
    .min(1, 'Mercado é obrigatório'),
  purchaseDate: z
    .string()
    .optional(),
});

// Tipos inferidos dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ShoppingListFormData = z.infer<typeof shoppingListSchema>;
export type ShoppingListItemFormData = z.infer<typeof shoppingListItemSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type MarketFormData = z.infer<typeof marketSchema>;
export type PriceHistoryFormData = z.infer<typeof priceHistorySchema>;

// Hook customizado para formulários com schemas específicos
export const useLoginForm = () => useForm({
  resolver: zodResolver(loginSchema),
  mode: 'onChange' as const,
});

export const useRegisterForm = () => useForm({
  resolver: zodResolver(registerSchema),
  mode: 'onChange' as const,
});

export const useShoppingListForm = () => useForm({
  resolver: zodResolver(shoppingListSchema),
  mode: 'onChange' as const,
});

export const useProductForm = () => useForm({
  resolver: zodResolver(productSchema),
  mode: 'onChange' as const,
});

export const useCategoryForm = () => useForm({
  resolver: zodResolver(categorySchema),
  mode: 'onChange' as const,
});

export const useMarketForm = () => useForm({
  resolver: zodResolver(marketSchema),
  mode: 'onChange' as const,
});

// Hook genérico simplificado
export function useValidatedForm<T extends z.ZodType>(schema: T, defaultValues?: z.infer<T>) {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange' as const,
  });
}
