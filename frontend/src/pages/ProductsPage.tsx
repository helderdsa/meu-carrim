export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button className="btn-primary">
          Novo Produto
        </button>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar produtos..."
          className="input-field"
        />
        
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Leite Integral</h3>
            <p className="text-gray-600 text-sm">Laticínios • Última compra: R$ 8,50</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Pão de Forma</h3>
            <p className="text-gray-600 text-sm">Padaria • Última compra: R$ 5,90</p>
          </div>
        </div>
      </div>
    </div>
  );
}
