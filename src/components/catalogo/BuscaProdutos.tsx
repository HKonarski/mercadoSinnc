export function BuscaProdutos({
  busca,
  onBuscaChange,
}: {
  busca: string
  onBuscaChange: (busca: string) => void
}) {
  return (
    <div className="lg:col-start-2 lg:row-start-1">
      <label htmlFor="busca-produtos" className="sr-only">
        Buscar produtos por nome, tipo, valor ou código
      </label>
      <input
        id="busca-produtos"
        type="search"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        placeholder="Buscar por nome, tipo, valor ou código de barras"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-600 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  )
}
