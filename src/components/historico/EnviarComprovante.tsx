import { useEffect, useState } from 'react'
import { comprasDemoService } from '../../services/comprasDemoService'
import type { CompraDemo } from '../../types'
import { formatarMoeda } from '../../utils/formatarMoeda'
import { Erro } from '../ui/Erro'
import { Carregando } from '../ui/Carregando'

function possuiAssinaturaPdf(arquivo: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = () =>
      reject(new Error('Não foi possível ler o arquivo selecionado.'))
    leitor.onload = () => {
      const resultado = leitor.result
      if (!(resultado instanceof ArrayBuffer)) {
        resolve(false)
        return
      }
      const assinatura = new TextDecoder().decode(resultado.slice(0, 5))
      resolve(assinatura === '%PDF-')
    }
    leitor.readAsArrayBuffer(arquivo.slice(0, 5))
  })
}

export function EnviarComprovante({ voltar }: { voltar: () => void }) {
  const [compras, setCompras] = useState<CompraDemo[]>([])
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([])
  const [arquivo, setArquivo] = useState<File>()
  const [mensagemErro, setMensagemErro] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState<string>()
  const [enviando, setEnviando] = useState(false)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErroCarregamento(undefined)
    comprasDemoService.listarCompras().then(
      (registros) => {
        if (ativo) {
          setCompras(registros.filter(({ status }) => status === 'Pendente'))
          setCarregando(false)
        }
      },
      (falha: unknown) => {
        if (ativo) {
          setErroCarregamento(
            falha instanceof Error
              ? falha.message
              : 'Não foi possível carregar as compras pendentes.',
          )
          setCarregando(false)
        }
      },
    )
    return () => {
      ativo = false
    }
  }, [tentativa])

  const selecionarArquivo = async (selecionado: File | undefined) => {
    setArquivo(undefined)
    setMensagemErro('')
    setMensagemSucesso('')
    if (!selecionado) {
      return
    }
    if (
      selecionado.type !== 'application/pdf' ||
      !selecionado.name.toLowerCase().endsWith('.pdf')
    ) {
      setMensagemErro('Selecione um arquivo PDF.')
      return
    }
    if (selecionado.size > 5 * 1024 * 1024) {
      setMensagemErro('O arquivo deve ter no máximo 5 MB.')
      return
    }
    try {
      if (!(await possuiAssinaturaPdf(selecionado))) {
        setMensagemErro('O arquivo selecionado não contém um PDF válido.')
        return
      }
      setArquivo(selecionado)
    } catch (falha: unknown) {
      setMensagemErro(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível validar o PDF selecionado.',
      )
    }
  }

  const enviar = async () => {
    if (!arquivo || idsSelecionados.length === 0) {
      setMensagemErro('Escolha um PDF válido e ao menos uma compra pendente.')
      return
    }
    setEnviando(true)
    setMensagemErro('')
    try {
      await comprasDemoService.enviarComprovante(idsSelecionados, arquivo.name)
      setMensagemSucesso('Envio demonstrativo concluído')
      setArquivo(undefined)
      setIdsSelecionados([])
    } catch (falha: unknown) {
      setMensagemErro(
        falha instanceof Error
          ? falha.message
          : 'Não foi possível registrar o envio demonstrativo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <Carregando mensagem="Carregando compras pendentes" />
  }
  if (erroCarregamento) {
    return (
      <Erro
        mensagem={erroCarregamento}
        tentarNovamente={() => setTentativa((n) => n + 1)}
      />
    )
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
      <h1 className="text-2xl font-bold text-slate-900">Enviar comprovante</h1>
      <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        Demonstração local: o arquivo não é transmitido nem armazenado.
      </p>
      <label
        htmlFor="arquivo-comprovante"
        className="mt-5 block font-semibold text-slate-800"
      >
        Arquivo PDF do comprovante
      </label>
      <input
        id="arquivo-comprovante"
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => {
          void selecionarArquivo(event.currentTarget.files?.[0])
        }}
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
      />
      {arquivo && (
        <p className="mt-2 text-sm text-slate-700">Arquivo: {arquivo.name}</p>
      )}
      {compras.length === 0 ? (
        <p className="mt-5 text-slate-600">
          Não há compras pendentes para associar.
        </p>
      ) : (
        <fieldset className="mt-5">
          <legend className="font-semibold text-slate-800">
            Compras relacionadas
          </legend>
          <div className="mt-2 space-y-2">
            {compras.map((compra) => (
              <label
                key={compra.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <input
                  type="checkbox"
                  checked={idsSelecionados.includes(compra.id)}
                  onChange={() =>
                    setIdsSelecionados((atuais) =>
                      atuais.includes(compra.id)
                        ? atuais.filter((id) => id !== compra.id)
                        : [...atuais, compra.id],
                    )
                  }
                  className="h-4 w-4 accent-blue-700"
                />
                <span className="flex flex-1 flex-wrap justify-between gap-2">
                  <span>Compra #{compra.id}</span>
                  <span>{formatarMoeda(compra.totalCentavos)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {mensagemErro && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {mensagemErro}
        </p>
      )}
      {mensagemSucesso && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {mensagemSucesso}
        </p>
      )}
      <button
        type="button"
        disabled={!arquivo || idsSelecionados.length === 0 || enviando}
        onClick={() => void enviar()}
        className="mt-5 rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {enviando ? 'Enviando...' : 'Enviar PDF demonstrativo'}
      </button>
    </main>
  )
}
