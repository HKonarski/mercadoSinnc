import { useState } from 'react'
import type { Configuracao, Produto } from '../../types'
import { estaComEstoqueBaixo, estaIndisponivel } from '../../utils/estoque'
import { formatarMoeda } from '../../utils/formatarMoeda'

const extensoesImagem = ['jfif', 'jpg', 'jpeg', 'jpe', 'png', 'webp']
const imagensPorProduto: Record<string, string> = {
  'Água mineral 500 ml': 'Agua mineral sem gas 500ml.jfif',
  'Refrigerante lata 350 ml': 'Refrigerante lata 350ml.jpg',
  'Doritos 32gr': 'salgadinho Doritos.jfif',
  'Ruffles 68gr': 'salgadinho Ruffles.jfif',
  'Torcida 35gr': 'salgadinho Torcida.jfif',
  Snickers: 'Snickers.jfif',
  'Bis Extra': 'Bis Extra.jfif',
  'Kit Kat': 'Kit Kat.jfif',
  Talento: 'Talento.jfif',
  Cookies: 'Cookies.jfif',
  'Iogurte Frimesa': 'Iogurte Frimesa.jfif',
  'Wafer Bauducco 140g': 'Wafer Bauducco.jfif',
  'Bolinho Rollcake 34g': 'Bolinho Rollcake.jfif',
  'Chocolate Suflair 80gr': 'Chocolate Suflair.jfif',
  'Chocolate Lacta 80gr': 'Chocolate Lacta.jfif',
  'Coca Cola 350 ml': 'Coca Cola lata 350 ml.jfif',
  'Sprite Zero 350 ml': 'Refrigerante Sprite Zero 350ml.jpg',
  'H2OH Limonetto 500 ml': 'H2OH Limoneto.jfif',
  'Suco Prats 300 ml': 'suco prats.jfif',
  'Redbull 250 ml': 'energetico Red Bull.jfif',
  'Monster 473 ml': 'Energetico monster.jfif',
  Heineken: 'Cerveja Heiniken Long Neck.jfif',
}

export function ProdutoCard({
  produto,
  configuracao,
}: {
  produto: Produto
  configuracao: Configuracao
}) {
  const [indiceExtensao, setIndiceExtensao] = useState(0)
  const indisponivel = estaIndisponivel(produto)
  const estoqueBaixo = estaComEstoqueBaixo(produto, configuracao)
  const nomeImagem = imagensPorProduto[produto.nome]
  const imagensProduto = nomeImagem
    ? [
        `${import.meta.env.BASE_URL}assets/img/${encodeURIComponent(nomeImagem)}`,
      ]
    : extensoesImagem.map(
        (extensao) =>
          `${import.meta.env.BASE_URL}assets/img/${encodeURIComponent(`${produto.codigoBarras}.${extensao}`)}`,
      )
  const imagemProduto = imagensProduto[indiceExtensao]

  return (
    <li className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-50">
          {imagemProduto ? (
            <img
              src={imagemProduto}
              alt={produto.nome}
              loading="lazy"
              onError={() => setIndiceExtensao((indice) => indice + 1)}
              className="h-full w-full object-contain"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-12 w-12 text-slate-300"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          )}
        </div>
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
