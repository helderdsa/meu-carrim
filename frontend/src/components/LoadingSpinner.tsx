interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
