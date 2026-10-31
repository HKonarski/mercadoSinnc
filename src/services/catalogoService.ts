import type { Catalogo, Categoria, Configuracao, Produto } from '../types'

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function texto(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new Error(`Campo inválido no catálogo: ${campo}`)
  }
  return valor
}

function inteiroNaoNegativo(valor: unknown, campo: string): number {
  if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 0) {
    throw new Error(`Campo inválido no catálogo: ${campo}`)
  }
  return valor
}

function validarConfiguracao(valor: unknown): Configuracao {
  if (!ehRegistro(valor)) {
    throw new Error('Configuração inválida no catálogo.')
  }
  if (typeof valor.avisoEstoqueMinimoAtivo !== 'boolean') {
    throw new Error('Campo inválido no catálogo: avisoEstoqueMinimoAtivo')
  }
  if (typeof valor.chavePix !== 'string') {
    throw new Error('Campo inválido no catálogo: chavePix')
  }
  return {
    avisoEstoqueMinimoAtivo: valor.avisoEstoqueMinimoAtivo,
    limiteUltimasUnidades: inteiroNaoNegativo(
      valor.limiteUltimasUnidades,
      'limiteUltimasUnidades',
    ),
    chavePix: valor.chavePix,
  }
}

function validarCategorias(valor: unknown): Categoria[] {
  if (!Array.isArray(valor)) {
    throw new Error('Lista de categorias inválida no catálogo.')
  }
  const categorias = valor.map((item): Categoria => {
    if (!ehRegistro(item)) {
      throw new Error('Categoria inválida no catálogo.')
    }
    return {
      id: texto(item.id, 'categoria.id'),
      nome: texto(item.nome, 'categoria.nome'),
    }
  })
  if (new Set(categorias.map(({ id }) => id)).size !== categorias.length) {
    throw new Error('Há categorias com identificadores duplicados.')
  }
  return categorias
}

function validarProdutos(valor: unknown, categorias: Categoria[]): Produto[] {
  if (!Array.isArray(valor)) {
    throw new Error('Lista de produtos inválida no catálogo.')
  }
  const categoriasPorId = new Map(
    categorias.map((categoria) => [categoria.id, categoria]),
  )
  const produtos = valor.map((item): Produto => {
    if (!ehRegistro(item)) {
      throw new Error('Produto inválido no catálogo.')
    }
    if (typeof item.ativo !== 'boolean') {
      throw new Error('Campo inválido no catálogo: produto.ativo')
    }
    const categoriaId = texto(item.categoriaId, 'produto.categoriaId')
    const categoria = categoriasPorId.get(categoriaId)
    if (!categoria) {
      throw new Error(
        `Categoria não encontrada para o produto ${String(item.id)}.`,
      )
    }
    return {
      id: texto(item.id, 'produto.id'),
      nome: texto(item.nome, 'produto.nome'),
      categoria,
      precoCentavos: inteiroNaoNegativo(
        item.precoCentavos,
        'produto.precoCentavos',
      ),
      quantidade: inteiroNaoNegativo(item.quantidade, 'produto.quantidade'),
      estoqueMinimo: inteiroNaoNegativo(
        item.estoqueMinimo,
        'produto.estoqueMinimo',
      ),
      codigoBarras: texto(item.codigoBarras, 'produto.codigoBarras'),
      ativo: item.ativo,
    }
  })
  if (new Set(produtos.map(({ id }) => id)).size !== produtos.length) {
    throw new Error('Há produtos com identificadores duplicados.')
  }
  return produtos.filter(({ ativo }) => ativo)
}

function validarCatalogo(valor: unknown): Catalogo {
  if (!ehRegistro(valor)) {
    throw new Error('Estrutura inválida no catálogo.')
  }
  const configuracao = validarConfiguracao(valor.configuracao)
  const categorias = validarCategorias(valor.categorias)
  const produtos = validarProdutos(valor.produtos, categorias)
  return { configuracao, categorias, produtos }
}

function obterUrlCatalogo(): string {
  const urlConfigurada = import.meta.env.VITE_CATALOGO_URL
  return urlConfigurada || `${import.meta.env.BASE_URL}data/catalogo.json`
}

let cacheCatalogo: Promise<Catalogo> | undefined

async function lerCatalogo(): Promise<Catalogo> {
  cacheCatalogo ??= (async () => {
    let resposta: Response
    try {
      resposta = await fetch(obterUrlCatalogo(), { cache: 'no-cache' })
    } catch (erro: unknown) {
      console.error('Falha ao consultar o arquivo do catálogo.', erro)
      throw new Error(
        'Não foi possível carregar o catálogo. Verifique sua conexão e tente novamente.',
      )
    }
    if (!resposta.ok) {
      throw new Error(
        `Não foi possível carregar o catálogo (erro ${resposta.status}).`,
      )
    }
    let conteudo: unknown
    try {
      conteudo = await resposta.json()
    } catch (erro: unknown) {
      console.error('O arquivo do catálogo contém JSON inválido.', erro)
      throw new Error(
        'O arquivo do catálogo está inválido. Tente novamente ou fale com o responsável.',
      )
    }
    try {
      return validarCatalogo(conteudo)
    } catch (erro: unknown) {
      console.error(
        'Os dados do catálogo não correspondem ao formato esperado.',
        erro,
      )
      throw new Error(
        'Os dados do catálogo estão inválidos. Tente novamente ou fale com o responsável.',
      )
    }
  })()
  try {
    return await cacheCatalogo
  } catch (erro) {
    cacheCatalogo = undefined
    throw erro
  }
}

export const catalogoService = {
  lerCatalogo,
  async listarProdutos(): Promise<Produto[]> {
    return (await lerCatalogo()).produtos
  },
  async listarCategorias(): Promise<Categoria[]> {
    return (await lerCatalogo()).categorias
  },
  async obterConfiguracao(): Promise<Configuracao> {
    return (await lerCatalogo()).configuracao
  },
  limparCache(): void {
    cacheCatalogo = undefined
  },
}
