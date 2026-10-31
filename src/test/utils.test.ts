import { describe, expect, it } from 'vitest'
import type { Configuracao, FiltrosCatalogo, Produto } from '../types'
import { categoriasComItens } from '../utils/categoriasComItens'
import {
  estaComEstoqueBaixo,
  estaIndisponivel,
  estaNasUltimasUnidades,
} from '../utils/estoque'
import { filtrarProdutos } from '../utils/filtrarProdutos'
import { formatarMoeda } from '../utils/formatarMoeda'
import { normalizarBusca } from '../utils/normalizarBusca'

const configuracao: Configuracao = {
  avisoEstoqueMinimoAtivo: true,
  limiteUltimasUnidades: 3,
  chavePix: 'CHAVE-DE-TESTE',
}

function criarProduto(
  id: string,
  nome: string,
  precoCentavos: number,
  quantidade: number,
  estoqueMinimo = 0,
  categoria = { id: 'bebidas', nome: 'Bebidas' },
): Produto {
  return {
    id,
    nome,
    categoria,
    precoCentavos,
    quantidade,
    estoqueMinimo,
    codigoBarras: `789${id.padStart(10, '0')}`,
    ativo: true,
  }
}

describe('formatarMoeda', () => {
  it.each([
    [350, 'R$ 3,50'],
    [0, 'R$ 0,00'],
    [123450, 'R$ 1.234,50'],
    [5, 'R$ 0,05'],
  ])('formata %i centavos como %s', (centavos, esperado) => {
    expect(formatarMoeda(centavos)).toBe(esperado)
  })

  it('rejeita valores que não sejam centavos inteiros', () => {
    expect(() => formatarMoeda(2.5)).toThrow(
      'O valor monetário deve ser informado em centavos inteiros.',
    )
  })
})

describe('normalizarBusca', () => {
  it.each([
    ['Água ', 'agua'],
    ['PÃO', 'pao'],
    ['R$  2,50', 'r$ 2,50'],
  ])('normaliza %s para %s', (valor, esperado) => {
    expect(normalizarBusca(valor)).toBe(esperado)
  })
})

describe('regras de estoque', () => {
  it('marca estoque zero como indisponível e fora das últimas unidades', () => {
    const produto = criarProduto('1', 'Água', 250, 0, 3)
    expect(estaIndisponivel(produto)).toBe(true)
    expect(estaComEstoqueBaixo(produto, configuracao)).toBe(false)
    expect(estaNasUltimasUnidades(produto, configuracao)).toBe(false)
  })

  it('considera mínimo inclusivo para selo baixo e últimas unidades', () => {
    const produto = criarProduto('2', 'Água', 250, 6, 6)
    expect(estaComEstoqueBaixo(produto, configuracao)).toBe(true)
    expect(estaNasUltimasUnidades(produto, configuracao)).toBe(true)
  })

  it('usa o limite padrão quando o aviso está desligado ou não há mínimo', () => {
    const produto = criarProduto('3', 'Água', 250, 5, 6)
    const configuracaoSemAviso = {
      ...configuracao,
      avisoEstoqueMinimoAtivo: false,
    }
    const configuracaoLimiteCinco = {
      ...configuracaoSemAviso,
      limiteUltimasUnidades: 5,
    }

    expect(estaComEstoqueBaixo(produto, configuracaoSemAviso)).toBe(false)
    expect(estaNasUltimasUnidades(produto, configuracaoSemAviso)).toBe(false)
    expect(estaNasUltimasUnidades(produto, configuracaoLimiteCinco)).toBe(true)
    expect(
      estaNasUltimasUnidades(criarProduto('4', 'Água', 250, 1), {
        ...configuracao,
        limiteUltimasUnidades: 0,
      }),
    ).toBe(false)
  })
})

describe('filtrarProdutos', () => {
  const produtos = [
    criarProduto('1', 'Água mineral', 250, 4, 6),
    criarProduto('2', 'Pão de queijo', 350, 0, 0, {
      id: 'salgados',
      nome: 'Salgados',
    }),
    criarProduto('3', 'Barra de chocolate', 690, 12, 0, {
      id: 'doces',
      nome: 'Doces',
    }),
  ]
  const semFiltros: FiltrosCatalogo = {
    categoriaIds: [],
    emEstoque: false,
    ultimasUnidades: false,
  }

  it('busca por trechos de nome, categoria, preço e código sem diferenciar acentos', () => {
    expect(
      filtrarProdutos(produtos, 'agua', semFiltros, configuracao),
    ).toHaveLength(1)
    expect(
      filtrarProdutos(produtos, 'salgados', semFiltros, configuracao),
    ).toHaveLength(1)
    expect(
      filtrarProdutos(produtos, 'R$ 2,50', semFiltros, configuracao),
    ).toHaveLength(1)
    expect(
      filtrarProdutos(produtos, '7890000000001', semFiltros, configuracao),
    ).toHaveLength(1)
    expect(
      filtrarProdutos(produtos, 'choco', semFiltros, configuracao),
    ).toHaveLength(1)
  })

  it('combina categoria, estoque e últimas unidades com a busca', () => {
    const filtros: FiltrosCatalogo = {
      categoriaIds: ['bebidas'],
      emEstoque: true,
      ultimasUnidades: true,
    }
    expect(
      filtrarProdutos(produtos, 'agua', filtros, configuracao).map(
        ({ id }) => id,
      ),
    ).toEqual(['1'])
    expect(
      filtrarProdutos(produtos, 'sem resultado', semFiltros, configuracao),
    ).toEqual([])
  })
})

describe('categoriasComItens', () => {
  it('omite categorias sem produtos visíveis', () => {
    const categorias = [
      { id: 'bebidas', nome: 'Bebidas' },
      { id: 'salgados', nome: 'Salgados' },
    ]
    expect(categoriasComItens(categorias, [produtosVisiveis()])).toEqual([
      { id: 'bebidas', nome: 'Bebidas' },
    ])
  })
})

function produtosVisiveis(): Produto {
  return criarProduto('1', 'Água mineral', 250, 4)
}
