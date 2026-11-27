import type { Configuracao, Produto, Visualizacao } from '../../types'
import { EstadoVazio } from '../ui/EstadoVazio'
import { ProdutoCard } from './ProdutoCard'

export function ListaProdutos({
  produtos,
  produtosCadastrados,
  configuracao,
  visualizacao,
  quantidadesNoCarrinho,
  adicionarAoCarrinho,
}: {
  produtos: Produto[]
  produtosCadastrados: Produto[]
  configuracao: Configuracao
  visualizacao: Visualizacao
  quantidadesNoCarrinho: Record<string, number>
  adicionarAoCarrinho: (produtoId: string) => void
}) {
  return (
    <section
      aria-labelledby="titulo-produtos"
      className="min-w-0 lg:col-start-2 lg:row-start-2"
    >
      <h2
        id="titulo-produtos"
        className="mb-3 text-lg font-semibold text-slate-900"
      >
        Produtos
      </h2>
      {produtosCadastrados.length === 0 ? (
        <EstadoVazio mensagem="Nenhum item cadastrado ainda" />
      ) : produtos.length === 0 ? (
        <EstadoVazio mensagem="Nenhum produto encontrado para esses filtros." />
      ) : (
        <ul
          className={
            visualizacao === 'grade'
              ? 'grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
              : 'grid min-w-0 grid-cols-1 gap-3'
          }
        >
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              configuracao={configuracao}
              quantidadeNoCarrinho={quantidadesNoCarrinho[produto.id] ?? 0}
              adicionarAoCarrinho={adicionarAoCarrinho}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
