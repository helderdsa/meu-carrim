export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mercados</h1>
        <button className="btn-primary">
          Novo Mercado
        </button>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Buscar mercados..."
          className="input-field"
        />
        
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Supermercado Extra</h3>
            <p className="text-gray-600 text-sm">Centro • 2.5 km de distância</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Walmart Supercenter</h3>
            <p className="text-gray-600 text-sm">Zona Sul • 4.1 km de distância</p>
          </div>
        </div>
      </div>
    </div>
  );
}
