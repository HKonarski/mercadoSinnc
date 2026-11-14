import type { Categoria, Produto } from '../types'

export function categoriasComItens(
  categorias: Categoria[],
  produtos: Produto[],
): Categoria[] {
  const idsComItens = new Set(produtos.map(({ categoria }) => categoria.id))
  return categorias.filter(({ id }) => idsComItens.has(id))
}
