import { useMemo, useState } from 'react'
import type {
  Configuracao,
  FiltrosCatalogo,
  Produto,
  Visualizacao,
} from '../types'
import { filtrarProdutos } from '../utils/filtrarProdutos'

const filtrosIniciais: FiltrosCatalogo = {
  categoriaIds: [],
  emEstoque: false,
  ultimasUnidades: false,
}

export function useFiltroCatalogo(
  produtos: Produto[],
  configuracao: Configuracao,
) {
  const [busca, setBusca] = useState('')
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(filtrosIniciais)
  const [visualizacao, setVisualizacao] = useState<Visualizacao>('grade')
  const produtosFiltrados = useMemo(
    () => filtrarProdutos(produtos, busca, filtros, configuracao),
    [produtos, busca, filtros, configuracao],
  )
  return {
    busca,
    setBusca,
    filtros,
    setFiltros,
    visualizacao,
    setVisualizacao,
    produtosFiltrados,
  }
}
