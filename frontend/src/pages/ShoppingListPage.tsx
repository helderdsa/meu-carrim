export default function ShoppingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lista do Supermercado</h1>
        <button className="btn-secondary">
          Editar
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 text-primary-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Leite Integral</p>
              <p className="text-sm text-gray-600">2 unidades • R$ 8,50</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 text-primary-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Pão de Forma</p>
              <p className="text-sm text-gray-600">1 unidade • R$ 5,90</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
