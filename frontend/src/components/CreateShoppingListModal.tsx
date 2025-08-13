import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { shoppingListService } from '../services/api';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const createListSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

type CreateListFormData = z.infer<typeof createListSchema>;

interface CreateShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateShoppingListModal({
  isOpen,
  onClose,
  onSuccess
}: CreateShoppingListModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: CreateListFormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      await shoppingListService.create({
        title: data.title,
        description: data.description || undefined
      });

      reset();
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Erro ao criar lista';
      setError(errorMessage || 'Erro ao criar lista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Lista de Compras"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título da Lista <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="input-field"
            placeholder="Ex: Compras do supermercado"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição (opcional)
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="input-field resize-none"
            placeholder="Adicione uma descrição para sua lista..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                Criando...
              </>
            ) : (
              'Criar Lista'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
