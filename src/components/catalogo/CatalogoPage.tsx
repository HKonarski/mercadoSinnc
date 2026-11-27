import { useState } from 'react'
import { useFiltroCatalogo } from '../../hooks/useFiltroCatalogo'
import { useProdutos } from '../../hooks/useProdutos'
import type { Catalogo, FiltrosCatalogo, Visualizacao } from '../../types'
import { categoriasComItens } from '../../utils/categoriasComItens'
import { formatarMoeda } from '../../utils/formatarMoeda'
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
  const [produtos, setProdutos] = useState(catalogo.produtos)
  const [quantidadesNoCarrinho, setQuantidadesNoCarrinho] = useState<
    Record<string, number>
  >({})
  const {
    busca,
    setBusca,
    filtros,
    setFiltros,
    visualizacao,
    setVisualizacao,
    produtosFiltrados,
  } = useFiltroCatalogo(produtos, catalogo.configuracao)
  const categorias = categoriasComItens(catalogo.categorias, produtos)
  const itensCarrinho = produtos
    .map((produto) => ({
      produto,
      quantidade: quantidadesNoCarrinho[produto.id] ?? 0,
    }))
    .filter(({ quantidade }) => quantidade > 0)
  const valorCarrinhoCentavos = itensCarrinho.reduce(
    (total, { produto, quantidade }) =>
      total + produto.precoCentavos * quantidade,
    0,
  )

  const atualizarFiltros = (proximos: FiltrosCatalogo) => setFiltros(proximos)
  const atualizarVisualizacao = (proxima: Visualizacao) =>
    setVisualizacao(proxima)
  const adicionarAoCarrinho = (produtoId: string) => {
    const produto = produtos.find((item) => item.id === produtoId)
    if (!produto || produto.quantidade === 0) {
      return
    }
    setQuantidadesNoCarrinho((atuais) => {
      const quantidadeAtual = atuais[produtoId] ?? 0
      if (quantidadeAtual >= produto.quantidade) {
        return atuais
      }
      return { ...atuais, [produtoId]: quantidadeAtual + 1 }
    })
  }
  const removerDoCarrinho = (produtoId: string) => {
    setQuantidadesNoCarrinho((atuais) => {
      const atualizadas = { ...atuais }
      delete atualizadas[produtoId]
      return atualizadas
    })
  }
  const registrarNaFicha = () => {
    setProdutos((atuais) =>
      atuais.map((produto) => ({
        ...produto,
        quantidade:
          produto.quantidade - (quantidadesNoCarrinho[produto.id] ?? 0),
      })),
    )
    setQuantidadesNoCarrinho({})
  }

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
            <FormasPagamento
              configuracao={catalogo.configuracao}
              itensCarrinho={itensCarrinho}
              valorCarrinhoCentavos={valorCarrinhoCentavos}
              onRemoverDoCarrinho={removerDoCarrinho}
              onRegistrarNaFicha={registrarNaFicha}
            />
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
            produtosCadastrados={produtos}
            configuracao={catalogo.configuracao}
            visualizacao={visualizacao}
            quantidadesNoCarrinho={quantidadesNoCarrinho}
            adicionarAoCarrinho={adicionarAoCarrinho}
          />
          {valorCarrinhoCentavos > 0 && (
            <section
              aria-label="Resumo do carrinho"
              className="sticky bottom-3 z-30 col-span-full flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white p-3 shadow-lg lg:hidden"
            >
              <p className="font-semibold text-slate-900">
                Carrinho: {formatarMoeda(valorCarrinhoCentavos)}
              </p>
              <button
                type="button"
                onClick={() => selecionarSecao('pagamento')}
                className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                Abrir pagamento
              </button>
            </section>
          )}
          <div className="hidden min-w-0 space-y-6 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:block">
            <FormasPagamento
              configuracao={catalogo.configuracao}
              itensCarrinho={itensCarrinho}
              valorCarrinhoCentavos={valorCarrinhoCentavos}
              onRemoverDoCarrinho={removerDoCarrinho}
              onRegistrarNaFicha={registrarNaFicha}
            />
            <ComoComprar abrirTela={abrirTela} />
          </div>
        </main>
      )}
      <Rodape />
    </div>
  )
}
