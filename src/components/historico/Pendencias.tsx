import { useEffect, useState } from 'react'
import { comprasDemoService } from '../../services/comprasDemoService'
import type { CompraDemo } from '../../types'
import { formatarMoeda } from '../../utils/formatarMoeda'
import { Carregando } from '../ui/Carregando'
import { Erro } from '../ui/Erro'
import { EstadoVazio } from '../ui/EstadoVazio'

export function Pendencias({ voltar }: { voltar: () => void }) {
  const [compras, setCompras] = useState<CompraDemo[]>([])
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [codigoGerado, setCodigoGerado] = useState('')
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
          setSelecionadas(
            registros
              .filter(({ status }) => status === 'Pendente')
              .map(({ id }) => id),
          )
          setCarregando(false)
        }
      },
      (falha: unknown) => {
        if (ativo) {
          setErro(
            falha instanceof Error
              ? falha.message
              : 'Não foi possível carregar as pendências.',
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
    return <Carregando mensagem="Carregando pendências" />
  }
  if (erro) {
    return (
      <Erro
        mensagem={erro}
        tentarNovamente={() => setTentativa((n) => n + 1)}
      />
    )
  }

  const pendentes = compras.filter(({ status }) => status === 'Pendente')
  const emConferencia = compras.filter(
    ({ status }) => status === 'Aguardando conferência',
  )
  const totalPendente = pendentes.reduce(
    (total, compra) => total + compra.totalCentavos,
    0,
  )
  const totalEmConferencia = emConferencia.reduce(
    (total, compra) => total + compra.totalCentavos,
    0,
  )
  const totalSelecionado = pendentes
    .filter(({ id }) => selecionadas.includes(id))
    .reduce((total, compra) => total + compra.totalCentavos, 0)

  const alternarCompra = (id: string) => {
    setSelecionadas((atuais) =>
      atuais.includes(id)
        ? atuais.filter((atual) => atual !== id)
        : [...atuais, id],
    )
    setCodigoGerado('')
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <button
        type="button"
        onClick={voltar}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        Voltar ao catálogo
      </button>
      <h1 className="text-2xl font-bold text-slate-900">
        Valor pendente na ficha
      </h1>
      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="font-semibold text-slate-800">Valor pendente</h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatarMoeda(totalPendente)}
          </p>
          {totalPendente === 0 && (
            <p className="mt-1 text-sm text-slate-600">
              Você não tem pendências
            </p>
          )}
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h2 className="font-semibold text-slate-800">Em conferência</h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatarMoeda(totalEmConferencia)}
          </p>
        </div>
      </section>
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Compras pendentes
        </h2>
        {pendentes.length === 0 ? (
          <EstadoVazio mensagem="Você não tem pendências" />
        ) : (
          <ul className="mt-3 space-y-2">
            {pendentes.map((compra) => (
              <li
                key={compra.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selecionadas.includes(compra.id)}
                    onChange={() => alternarCompra(compra.id)}
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  <span className="flex flex-1 flex-wrap justify-between gap-2">
                    <span>Compra #{compra.id}</span>
                    <span className="font-semibold">
                      {formatarMoeda(compra.totalCentavos)}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
      <button
        type="button"
        disabled={selecionadas.length === 0}
        onClick={() =>
          setCodigoGerado(
            `PIX-DEMO-NAO-PAGAVEL|VALOR_CENTAVOS=${totalSelecionado}`,
          )
        }
        className="mt-4 rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Gerar código Pix demonstrativo
      </button>
      {codigoGerado && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4"
        >
          <p className="font-semibold text-amber-900">
            Não pagável — código somente para demonstração
          </p>
          <code className="mt-2 block break-all text-sm text-slate-800">
            {codigoGerado}
          </code>
        </div>
      )}
    </main>
  )
}
