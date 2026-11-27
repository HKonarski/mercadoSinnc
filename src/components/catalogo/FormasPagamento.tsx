import { useState } from 'react'
import type { Configuracao, FormaPagamento, Produto } from '../../types'
import { formatarMoeda } from '../../utils/formatarMoeda'

const formasPagamento: FormaPagamento[] = [
  {
    id: 'pix',
    nome: 'Pix',
    descricao: 'Copie a chave e pague pelo app do banco',
  },
  {
    id: 'ficha',
    nome: 'Ficha',
    descricao: 'Fica registrado para pagar depois',
  },
]

export function FormasPagamento({
  configuracao,
  itensCarrinho,
  valorCarrinhoCentavos,
  onRemoverDoCarrinho,
  onRegistrarNaFicha,
}: {
  configuracao: Configuracao
  itensCarrinho: { produto: Produto; quantidade: number }[]
  valorCarrinhoCentavos: number
  onRemoverDoCarrinho: (produtoId: string) => void
  onRegistrarNaFicha: () => void
}) {
  const [mensagem, setMensagem] = useState('')

  const copiarChave = async () => {
    try {
      await navigator.clipboard.writeText(configuracao.chavePix)
      setMensagem('Chave copiada!')
    } catch (erro) {
      console.error('Não foi possível copiar a chave Pix.', erro)
      setMensagem(
        'Não foi possível copiar a chave Pix. Copie a chave manualmente.',
      )
    }
  }

  return (
    <section
      id="secao-pagamento"
      aria-labelledby="titulo-pagamento"
      className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
        <div
          role="img"
          aria-label="QR Code demonstrativo, não pagável"
          className="flex aspect-square flex-col justify-center border-2 border-slate-900 p-2 text-xl font-medium leading-tight text-slate-950"
        >
          <span>QR</span>
          <span>Code</span>
        </div>
        <div>
          <h2
            id="titulo-pagamento"
            className="text-lg font-semibold text-slate-900"
          >
            Pagamento
          </h2>
          <p className="mt-3 text-sm text-slate-500">Valor do carrinho</p>
          <p className="text-3xl font-bold text-slate-900">
            {formatarMoeda(valorCarrinhoCentavos)}
          </p>
        </div>
      </div>
      {itensCarrinho.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">Seu carrinho está vazio.</p>
      ) : (
        <ul
          aria-label="Itens no carrinho"
          className="mt-4 divide-y divide-slate-100 border-y border-slate-100"
        >
          {itensCarrinho.map(({ produto, quantidade }) => (
            <li
              key={produto.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-slate-800">
                  {produto.nome}
                </p>
                <p className="text-sm text-slate-600">
                  {quantidade} × {formatarMoeda(produto.precoCentavos)} ={' '}
                  {formatarMoeda(produto.precoCentavos * quantidade)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remover ${produto.nome} do carrinho`}
                onClick={() => onRemoverDoCarrinho(produto.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xl font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-slate-500">
        QR Code ilustrativo, não válido para pagamento. O registro na ficha é
        uma demonstração local e não salva alterações no arquivo JSON.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={copiarChave}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Copiar Chave Pix
        </button>
        <button
          type="button"
          disabled={valorCarrinhoCentavos === 0}
          onClick={() => {
            onRegistrarNaFicha()
            setMensagem(
              'Compra registrada na ficha. Estoque atualizado nesta demonstração.',
            )
          }}
          className="rounded-lg border border-blue-700 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
        >
          Registrar na Ficha
        </button>
      </div>
      {mensagem && (
        <p role="status" className="mt-2 text-sm text-slate-700">
          {mensagem}
        </p>
      )}
      <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
        {formasPagamento.map((forma) => (
          <li key={forma.id} className="text-sm">
            <span className="font-semibold text-slate-800">{forma.nome}</span>:{' '}
            <span className="text-slate-600">{forma.descricao}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
