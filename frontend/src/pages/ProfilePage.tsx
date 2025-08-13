import { useAuthStore } from '../stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={user?.name || ''}
              className="mt-1 input-field"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="mt-1 input-field"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Papel</label>
            <input
              type="text"
              value={user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
              className="mt-1 input-field"
              readOnly
            />
          </div>
          
          <button className="btn-primary">
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
