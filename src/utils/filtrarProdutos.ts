import type { Configuracao, FiltrosCatalogo, Produto } from '../types'
import { estaNasUltimasUnidades } from './estoque'
import { formatarMoeda } from './formatarMoeda'
import { normalizarBusca } from './normalizarBusca'

function formatosPreco(precoCentavos: number): string[] {
  const reais = Math.floor(precoCentavos / 100)
  const centavos = String(precoCentavos % 100).padStart(2, '0')
  const valorComVirgula = `${reais},${centavos}`
  const valorComPonto = `${reais}.${centavos}`
  const semZeroFinal = `${reais}.${centavos.endsWith('0') ? centavos[0] : centavos}`
  return [
    formatarMoeda(precoCentavos),
    valorComVirgula,
    valorComPonto,
    semZeroFinal,
  ]
}

export function filtrarProdutos(
  produtos: Produto[],
  busca: string,
  filtros: FiltrosCatalogo,
  configuracao: Configuracao,
): Produto[] {
  const termo = normalizarBusca(busca)
  return produtos.filter((produto) => {
    const camposBusca = [
      produto.nome,
      produto.categoria.nome,
      produto.codigoBarras,
      ...formatosPreco(produto.precoCentavos),
    ]
    const correspondeBusca =
      termo === '' ||
      camposBusca.some((campo) => normalizarBusca(campo).includes(termo))
    const correspondeCategoria =
      filtros.categoriaIds.length === 0 ||
      filtros.categoriaIds.includes(produto.categoria.id)
    const correspondeEstoque = !filtros.emEstoque || produto.quantidade > 0
    const correspondeUltimasUnidades =
      !filtros.ultimasUnidades || estaNasUltimasUnidades(produto, configuracao)
    return (
      correspondeBusca &&
      correspondeCategoria &&
      correspondeEstoque &&
      correspondeUltimasUnidades
    )
  })
}
