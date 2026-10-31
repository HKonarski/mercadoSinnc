import { useState } from 'react'
import type { Categoria, FiltrosCatalogo, Visualizacao } from '../../types'

export function CaixaFiltros({
  categorias,
  filtros,
  visualizacao,
  onFiltrosChange,
  onVisualizacaoChange,
}: {
  categorias: Categoria[]
  filtros: FiltrosCatalogo
  visualizacao: Visualizacao
  onFiltrosChange: (filtros: FiltrosCatalogo) => void
  onVisualizacaoChange: (visualizacao: Visualizacao) => void
}) {
  const [aberto, setAberto] = useState(false)
  const quantidadeFiltrosAtivos =
    filtros.categoriaIds.length +
    Number(filtros.emEstoque) +
    Number(filtros.ultimasUnidades)

  const alternarCategoria = (categoriaId: string) => {
    const categoriaIds = filtros.categoriaIds.includes(categoriaId)
      ? filtros.categoriaIds.filter((id) => id !== categoriaId)
      : [...filtros.categoriaIds, categoriaId]
    onFiltrosChange({ ...filtros, categoriaIds })
  }

  return (
    <aside className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="painel-filtros"
        onClick={() => setAberto((valor) => !valor)}
        className="mb-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:hidden"
      >
        Filtros
        {quantidadeFiltrosAtivos > 0 ? ` (${quantidadeFiltrosAtivos})` : ''}
      </button>
      <div
        id="painel-filtros"
        className={`${aberto ? 'block' : 'hidden'} rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block`}
      >
        <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
        <fieldset className="mt-3">
          <legend className="text-sm font-semibold text-slate-700">
            Categoria
          </legend>
          <div className="mt-2 flex flex-wrap gap-2 lg:flex-col">
            <button
              type="button"
              aria-pressed={filtros.categoriaIds.length === 0}
              onClick={() => onFiltrosChange({ ...filtros, categoriaIds: [] })}
              className={`rounded-full border px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
                filtros.categoriaIds.length === 0
                  ? 'border-amber-500 bg-amber-300 font-semibold text-slate-900'
                  : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <label
                key={categoria.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-blue-600"
              >
                <input
                  type="checkbox"
                  checked={filtros.categoriaIds.includes(categoria.id)}
                  onChange={() => alternarCategoria(categoria.id)}
                  className="h-4 w-4 accent-blue-700"
                />
                {categoria.nome}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4 border-t border-slate-100 pt-3">
          <legend className="text-sm font-semibold text-slate-700">
            Disponibilidade
          </legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 lg:flex-col">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filtros.emEstoque}
                onChange={(event) =>
                  onFiltrosChange({
                    ...filtros,
                    emEstoque: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-blue-700"
              />
              Em estoque
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filtros.ultimasUnidades}
                onChange={(event) =>
                  onFiltrosChange({
                    ...filtros,
                    ultimasUnidades: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-blue-700"
              />
              Últimas unidades
            </label>
          </div>
        </fieldset>
        <fieldset className="mt-4 border-t border-slate-100 pt-3">
          <legend className="text-sm font-semibold text-slate-700">
            Visualização
          </legend>
          <div className="mt-2 flex gap-2">
            {(['grade', 'lista'] as const).map((opcao) => (
              <button
                key={opcao}
                type="button"
                aria-pressed={visualizacao === opcao}
                onClick={() => onVisualizacaoChange(opcao)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  visualizacao === opcao
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  )
}
