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
import { Cabecalho } from './Cabecalho'
import { CaixaFiltros } from './CaixaFiltros'
import { FormasPagamento } from './FormasPagamento'
import { ListaProdutos } from './ListaProdutos'

type TelaDemonstrativa = 'catalogo' | 'historico' | 'pendencias' | 'comprovante'

export function CatalogoPage() {
  const { estado, tentarNovamente } = useProdutos()
  const [tela, setTela] = useState<TelaDemonstrativa>('catalogo')

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

  return <PaginaCatalogo catalogo={estado.catalogo} abrirTela={setTela} />
}

function PaginaCatalogo({
  catalogo,
  abrirTela,
}: {
  catalogo: Catalogo
  abrirTela: (tela: TelaDemonstrativa) => void
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
      <Cabecalho />
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
        <div className="min-w-0 space-y-6 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <FormasPagamento configuracao={catalogo.configuracao} />
          <ComoComprar abrirTela={abrirTela} />
        </div>
      </main>
      <Rodape />
    </div>
  )
}
