import { useState } from 'react'
import { useFiltroCatalogo } from '../../hooks/useFiltroCatalogo'
import { useProdutos } from '../../hooks/useProdutos'
import type { Catalogo, FiltrosCatalogo, Visualizacao } from '../../types'
import { categoriasComItens } from '../../utils/categoriasComItens'
import { Carregando } from '../ui/Carregando'
import { Erro } from '../ui/Erro'
import { Rodape } from '../ui/Rodape'
import { EnviarComprovante } from '../historico/EnviarComprovante'
import { ComoComprar } from '../historico/ComoComprar'
import { ListaHistorico } from '../historico/ListaHistorico'
import { Pendencias } from '../historico/Pendencias'
import { BuscaProdutos } from './BuscaProdutos'
import { Cabecalho, type SecaoCatalogo } from './Cabecalho'
import { CaixaFiltros } from './CaixaFiltros'
import { FormasPagamento } from './FormasPagamento'
import { ListaProdutos } from './ListaProdutos'

type TelaDemonstrativa = 'catalogo' | 'historico' | 'pendencias' | 'comprovante'

export function CatalogoPage() {
  const { estado, tentarNovamente } = useProdutos()
  const [tela, setTela] = useState<TelaDemonstrativa>('catalogo')
  const [secaoCatalogo, setSecaoCatalogo] = useState<SecaoCatalogo | null>(null)

  if (estado.estado === 'carregando') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <Carregando mensagem="Carregando catálogo" />
      </div>
    )
  }
  if (estado.estado === 'erro') {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <Erro mensagem={estado.mensagem} tentarNovamente={tentarNovamente} />
      </div>
    )
  }

  if (tela === 'historico') {
    return (
      <>
        <Cabecalho />
        <ListaHistorico voltar={() => setTela('catalogo')} />
      </>
    )
  }
  if (tela === 'pendencias') {
    return (
      <>
        <Cabecalho />
        <Pendencias voltar={() => setTela('catalogo')} />
      </>
    )
  }
  if (tela === 'comprovante') {
    return (
      <>
        <Cabecalho />
        <EnviarComprovante voltar={() => setTela('catalogo')} />
      </>
    )
  }

  return (
    <PaginaCatalogo
      catalogo={estado.catalogo}
      abrirTela={setTela}
      secaoSelecionada={secaoCatalogo}
      selecionarSecao={setSecaoCatalogo}
    />
  )
}

function PaginaCatalogo({
  catalogo,
  abrirTela,
  secaoSelecionada,
  selecionarSecao,
}: {
  catalogo: Catalogo
  abrirTela: (tela: TelaDemonstrativa) => void
  secaoSelecionada: SecaoCatalogo | null
  selecionarSecao: (secao: SecaoCatalogo | null) => void
}) {
  const {
    busca,
    setBusca,
    filtros,
    setFiltros,
    visualizacao,
    setVisualizacao,
    produtosFiltrados,
  } = useFiltroCatalogo(catalogo.produtos, catalogo.configuracao)
  const categorias = categoriasComItens(catalogo.categorias, catalogo.produtos)

  const atualizarFiltros = (proximos: FiltrosCatalogo) => setFiltros(proximos)
  const atualizarVisualizacao = (proxima: Visualizacao) =>
    setVisualizacao(proxima)

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-slate-50 text-slate-900">
      <Cabecalho mostrarMenuCatalogo onSelecionarSecao={selecionarSecao} />
      {secaoSelecionada ? (
        <main className="mx-auto w-full max-w-3xl flex-1 px-3 py-5 sm:px-4 lg:py-6">
          <button
            type="button"
            onClick={() => selecionarSecao(null)}
            className="mb-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Voltar ao catálogo
          </button>
          {secaoSelecionada === 'pagamento' ? (
            <FormasPagamento configuracao={catalogo.configuracao} />
          ) : (
            <ComoComprar abrirTela={abrirTela} />
          )}
        </main>
      ) : (
        <main className="mx-auto grid min-w-0 max-w-[1600px] flex-1 grid-cols-1 gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[200px_minmax(0,1fr)_260px] lg:gap-5 lg:py-6">
          <BuscaProdutos busca={busca} onBuscaChange={setBusca} />
          <CaixaFiltros
            categorias={categorias}
            filtros={filtros}
            visualizacao={visualizacao}
            onFiltrosChange={atualizarFiltros}
            onVisualizacaoChange={atualizarVisualizacao}
          />
          <ListaProdutos
            produtos={produtosFiltrados}
            produtosCadastrados={catalogo.produtos}
            configuracao={catalogo.configuracao}
            visualizacao={visualizacao}
          />
          <div className="hidden min-w-0 space-y-6 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:block">
            <FormasPagamento configuracao={catalogo.configuracao} />
            <ComoComprar abrirTela={abrirTela} />
          </div>
        </main>
      )}
      <Rodape />
    </div>
  )
}
