import type { Configuracao, Produto } from '../../types'
import { estaComEstoqueBaixo, estaIndisponivel } from '../../utils/estoque'
import { formatarMoeda } from '../../utils/formatarMoeda'

export function ProdutoCard({
  produto,
  configuracao,
}: {
  produto: Produto
  configuracao: Configuracao
}) {
  const indisponivel = estaIndisponivel(produto)
  const estoqueBaixo = estaComEstoqueBaixo(produto, configuracao)

  return (
    <li className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <p className="text-xs font-medium text-slate-500">
            {produto.categoria.nome}
          </p>
          {indisponivel && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Indisponível
            </span>
          )}
          {estoqueBaixo && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Estoque baixo
            </span>
          )}
        </div>
        <h3 className="wrap-break-word text-base font-semibold leading-snug text-slate-900">
          {produto.nome}
        </h3>
        <p className="mt-2 text-xl font-bold text-slate-900">
          {formatarMoeda(produto.precoCentavos)}
        </p>
        <p className="text-sm text-slate-600">
          Disponível: {produto.quantidade}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Cód. {produto.codigoBarras}
        </p>
      </div>
      <button
        type="button"
        disabled={indisponivel}
        className="mt-4 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Adicionar ao carrinho
      </button>
    </li>
  )
}
