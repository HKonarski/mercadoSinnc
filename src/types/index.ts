export type Categoria = {
  id: string
  nome: string
}

export type Produto = {
  id: string
  nome: string
  categoria: Categoria
  precoCentavos: number
  quantidade: number
  estoqueMinimo: number
  codigoBarras: string
  imagem?: string
  ativo: boolean
}

export type Configuracao = {
  avisoEstoqueMinimoAtivo: boolean
  limiteUltimasUnidades: number
  chavePix: string
}

export type Catalogo = {
  configuracao: Configuracao
  categorias: Categoria[]
  produtos: Produto[]
}

export type FormaPagamento = {
  id: 'pix' | 'ficha'
  nome: string
  descricao: string
}

export type FiltrosCatalogo = {
  categoriaIds: string[]
  emEstoque: boolean
  ultimasUnidades: boolean
}

export type Visualizacao = 'grade' | 'lista'

export type StatusCompra =
  'Pendente' | 'Aguardando conferência' | 'Paga' | 'Cancelada'

export type EtapaCompra = {
  descricao: string
  data: string
}

export type ItemCompraDemo = {
  nome: string
  precoUnitarioCentavos: number
  quantidade: number
}

export type CompraDemo = {
  id: string
  data: string
  totalCentavos: number
  formaPagamento: 'Pix' | 'Ficha'
  status: StatusCompra
  itens: ItemCompraDemo[]
  andamento: EtapaCompra[]
  comprovanteNome?: string
  motivoRecusa?: string
}
