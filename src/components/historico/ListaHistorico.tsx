import { useEffect, useState } from 'react'
import { comprasDemoService } from '../../services/comprasDemoService'
import type { CompraDemo } from '../../types'
import { formatarMoeda } from '../../utils/formatarMoeda'
import { Carregando } from '../ui/Carregando'
import { Erro } from '../ui/Erro'
import { EstadoVazio } from '../ui/EstadoVazio'
import { formatarData } from './formatarData'

export function ListaHistorico({ voltar }: { voltar: () => void }) {
  const [compras, setCompras] = useState<CompraDemo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string>()
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro(undefined)
    comprasDemoService.listarCompras().then(
      (registros) => {
        if (ativo) {
          setCompras(registros)
          setCarregando(false)
        }
      },
      (falha: unknown) => {
        if (ativo) {
          setErro(
            falha instanceof Error
              ? falha.message
              : 'Não foi possível carregar o histórico.',
          )
          setCarregando(false)
        }
      },
    )
    return () => {
      ativo = false
    }
  }, [tentativa])

  if (carregando) {
    return <Carregando mensagem="Carregando histórico" />
  }
  if (erro) {
    return (
      <Erro
        mensagem={erro}
        tentarNovamente={() => setTentativa((n) => n + 1)}
      />
    )
  }

  const comprasOrdenadas = [...compras].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  )

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <button
        type="button"
        onClick={voltar}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        Voltar ao catálogo
      </button>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Histórico de compras
      </h1>
      {comprasOrdenadas.length === 0 ? (
        <EstadoVazio mensagem="Você ainda não fez compras" />
      ) : (
        <ol aria-label="Histórico de compras" className="space-y-4">
          {comprasOrdenadas.map((compra) => (
            <li
              key={compra.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  Compra #{compra.id}
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                  {compra.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {formatarData(compra.data)} · {compra.formaPagamento}
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                Total: {formatarMoeda(compra.totalCentavos)}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {compra.itens.map((item) => (
                  <li key={`${compra.id}-${item.nome}`}>
                    {item.quantidade} × {item.nome} —{' '}
                    {formatarMoeda(item.precoUnitarioCentavos)}
                  </li>
                ))}
              </ul>
              {compra.comprovanteNome && (
                <p className="mt-3 text-sm text-slate-600">
                  Comprovante: {compra.comprovanteNome}
                </p>
              )}
              {compra.motivoRecusa && (
                <p className="mt-2 text-sm text-red-700">
                  Motivo da recusa: {compra.motivoRecusa}
                </p>
              )}
              <section
                aria-label="Andamento da compra"
                className="mt-4 border-t pt-3"
              >
                <h3 className="font-semibold text-slate-800">
                  Andamento da compra
                </h3>
                <ol className="mt-2 space-y-1 text-sm text-slate-600">
                  {compra.andamento.map((etapa) => (
                    <li key={`${etapa.descricao}-${etapa.data}`}>
                      {formatarData(etapa.data)} — {etapa.descricao}
                    </li>
                  ))}
                </ol>
              </section>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
