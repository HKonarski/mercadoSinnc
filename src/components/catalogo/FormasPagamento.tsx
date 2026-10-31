import { useState } from 'react'
import type { Configuracao, FormaPagamento } from '../../types'
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
}: {
  configuracao: Configuracao
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
      aria-labelledby="titulo-pagamento"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2
        id="titulo-pagamento"
        className="text-lg font-semibold text-slate-900"
      >
        Pagamento
      </h2>
      <p className="mt-3 text-sm text-slate-500">Valor do carrinho</p>
      <p className="text-3xl font-bold text-slate-900">{formatarMoeda(0)}</p>
      <p className="mt-1 text-xs text-slate-500">
        O carrinho e o registro de compras serão habilitados em etapas futuras.
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
          className="rounded-lg border border-blue-700 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
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
