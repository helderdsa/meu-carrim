export default function ShoppingListsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Listas de Compras</h1>
        <button className="btn-primary">
          Nova Lista
        </button>
      </div>
      
      <div className="grid gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900">Lista do Supermercado</h3>
          <p className="text-gray-600 text-sm">5 itens • Criada há 2 dias</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900">Feira Orgânica</h3>
          <p className="text-gray-600 text-sm">3 itens • Criada há 1 semana</p>
        </div>
      </div>
    </div>
  );
}
