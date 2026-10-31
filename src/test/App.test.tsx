import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { catalogoMock } from '../data/catalogo.mock'
import { catalogoService } from '../services/catalogoService'
import { comprasDemoService } from '../services/comprasDemoService'

function primeiro<T>(valores: T[]): T {
  const valor = valores[0]
  if (valor === undefined) {
    throw new Error('Esperava encontrar um elemento na lista.')
  }
  return valor
}

function criarJsonCatalogo() {
  return {
    configuracao: catalogoMock.configuracao,
    categorias: catalogoMock.categorias,
    produtos: catalogoMock.produtos.map(({ categoria, ...produto }) => ({
      ...produto,
      categoriaId: categoria.id,
    })),
  }
}

function respostaJson(conteudo: unknown, status = 200) {
  return new Response(JSON.stringify(conteudo), { status })
}

async function abrirCatalogo() {
  render(<App />)
  await screen.findByText('Água mineral 500 ml')
}

beforeEach(() => {
  catalogoService.limparCache()
  comprasDemoService.reiniciar()
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(respostaJson(criarJsonCatalogo())),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('catálogo', () => {
  it('carrega produtos e informações de pagamento do JSON', async () => {
    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando catálogo')
    expect(
      await screen.findByRole('link', { name: 'Mercadinho SINNC - início' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'SINNC' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usuário' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Produtos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Pagamento' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument()
    expect(
      screen.queryByText('Produto oculto de demonstração'),
    ).not.toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/data/catalogo.json', {
      cache: 'no-cache',
    })
    expect(screen.getByText('Pix', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('Ficha', { exact: true })).toBeInTheDocument()
  })

  it('copia a chave Pix e confirma a ação', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    await abrirCatalogo()

    await user.click(screen.getByRole('button', { name: 'Copiar Chave Pix' }))

    expect(writeText).toHaveBeenCalledWith('CHAVE-PIX-DA-SINNC')
    expect(screen.getByRole('status')).toHaveTextContent('Chave copiada!')
  })

  it('marca item sem estoque como indisponível e desabilita o botão', async () => {
    await abrirCatalogo()

    const produto = screen.getByText('Pão de queijo').closest('li')
    expect(produto).not.toBeNull()

    if (produto) {
      expect(within(produto).getByText('Indisponível')).toBeInTheDocument()
      expect(
        within(produto).getByRole('button', { name: 'Adicionar ao carrinho' }),
      ).toBeDisabled()
    }
  })

  it('mostra categoria e alerta de estoque baixo', async () => {
    await abrirCatalogo()

    const produto = screen
      .getByRole('heading', { name: 'Refrigerante lata 350 ml' })
      .closest('li')
    expect(produto).not.toBeNull()

    if (produto) {
      const categoria = within(produto).getByText('Bebidas')
      const alerta = within(produto).getByText('Estoque baixo')
      const nome = within(produto).getByRole('heading', {
        name: 'Refrigerante lata 350 ml',
      })

      expect(
        categoria.compareDocumentPosition(alerta) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
      expect(
        alerta.compareDocumentPosition(nome) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    }
  })

  it('combina filtros e muda a visualização sem alterar os resultados', async () => {
    const user = userEvent.setup()
    await abrirCatalogo()

    const todos = primeiro(screen.getAllByRole('button', { name: 'Todos' }))
    expect(todos).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByRole('button', { name: 'Filtros' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await user.click(
      primeiro(screen.getAllByRole('checkbox', { name: 'Doces' })),
    )
    expect(todos).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByText(
        'Biscoito recheado sabor chocolate com cobertura extra grande',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()

    await user.click(todos)
    expect(todos).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()

    await user.click(
      primeiro(screen.getAllByRole('checkbox', { name: 'Em estoque' })),
    )
    expect(screen.queryByText('Pão de queijo')).not.toBeInTheDocument()

    await user.click(
      primeiro(screen.getAllByRole('checkbox', { name: 'Últimas unidades' })),
    )
    expect(screen.getByText('Refrigerante lata 350 ml')).toBeInTheDocument()
    expect(screen.getByText('Salgadinho')).toBeInTheDocument()

    const lista = primeiro(screen.getAllByRole('button', { name: 'lista' }))
    await user.click(lista)
    expect(lista).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Refrigerante lata 350 ml')).toBeInTheDocument()
  })

  it('busca por nome, categoria, preço e código sem diferenciar acentos', async () => {
    const user = userEvent.setup()
    await abrirCatalogo()
    const busca = screen.getByRole('searchbox', {
      name: 'Buscar produtos por nome, tipo, valor ou código',
    })

    await user.type(busca, 'agua')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.queryByText('Pão de queijo')).not.toBeInTheDocument()

    await user.clear(busca)
    await user.type(busca, 'salgados')
    expect(screen.getByText('Salgadinho')).toBeInTheDocument()
    expect(screen.getByText('Pão de queijo')).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()

    await user.clear(busca)
    await user.type(busca, 'R$ 2,50')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.queryByText('Barra de chocolate')).not.toBeInTheDocument()

    await user.clear(busca)
    await user.type(busca, '7891000000035')
    expect(screen.getByText('Pão de queijo')).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()
  })

  it('informa quando a busca não encontra produtos e restaura a lista ao limpar', async () => {
    const user = userEvent.setup()
    await abrirCatalogo()
    const busca = screen.getByRole('searchbox', {
      name: 'Buscar produtos por nome, tipo, valor ou código',
    })

    await user.type(busca, 'item inexistente')
    expect(
      screen.getByText('Nenhum produto encontrado para esses filtros.'),
    ).toBeInTheDocument()

    await user.clear(busca)
    expect(await screen.findByText('Água mineral 500 ml')).toBeInTheDocument()
  })

  it('recupera o catálogo ao tentar novamente depois de uma falha', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch)
      .mockReset()
      .mockResolvedValueOnce(respostaJson({}, 404))
      .mockResolvedValueOnce(respostaJson(criarJsonCatalogo()))

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('erro 404')
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['JSON malformado', new Response('{ JSON inválido')],
    [
      'estrutura inválida',
      respostaJson({ configuracao: {}, categorias: [], produtos: [] }),
    ],
  ])('mostra erro recuperável para %s', async (_cenario, resposta) => {
    vi.mocked(fetch).mockReset().mockResolvedValueOnce(resposta)
    render(<App />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeInTheDocument()
  })

  it('abre o histórico completo com itens, valores e andamento das compras', async () => {
    const user = userEvent.setup()
    await abrirCatalogo()

    await user.click(
      screen.getByRole('button', { name: /Histórico de Compra/ }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Histórico de compras' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: 'Histórico de compras' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Compra #2026-004')).toBeInTheDocument()
    expect(screen.getByText('Compra #2026-003')).toBeInTheDocument()
    expect(
      screen.getAllByText('Aguardando conferência').length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('Andamento da compra')).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'Voltar ao catálogo' }))
    expect(
      screen.getByRole('heading', { name: 'Produtos' }),
    ).toBeInTheDocument()
  })

  it('separa pendências da conferência e gera código Pix não pagável', async () => {
    const user = userEvent.setup()
    await abrirCatalogo()

    await user.click(
      screen.getByRole('button', { name: /Valor Pendente na Ficha/ }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Valor pendente na ficha' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('R$ 11,90').length).toBeGreaterThan(0)
    expect(screen.getAllByText('R$ 4,40').length).toBeGreaterThan(0)
    await user.click(
      screen.getByRole('button', { name: 'Gerar código Pix demonstrativo' }),
    )
    expect(
      screen.getByText(/Não pagável — código somente para demonstração/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/PIX-DEMO-NAO-PAGAVEL\|VALOR_CENTAVOS=1190/),
    ).toBeInTheDocument()
  })

  it('valida PDF e registra o envio somente como demonstração', async () => {
    const user = userEvent.setup({ applyAccept: false })
    await abrirCatalogo()

    await user.click(
      screen.getByRole('button', { name: /Registro de Comprovante/ }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Enviar comprovante' }),
    ).toBeInTheDocument()

    const entrada = screen.getByLabelText('Arquivo PDF do comprovante')
    await user.upload(
      entrada,
      new File(['falso'], 'recibo.pdf', { type: 'application/pdf' }),
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O arquivo selecionado não contém um PDF válido.',
    )

    await user.upload(
      entrada,
      new File(['%PDF-conteudo demonstrativo'], 'recibo.pdf', {
        type: 'application/pdf',
      }),
    )
    await user.click(screen.getByRole('checkbox', { name: /Compra #2026-004/ }))
    await user.click(
      screen.getByRole('button', { name: 'Enviar PDF demonstrativo' }),
    )

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Envio demonstrativo concluído',
    )
    const compras = await comprasDemoService.listarCompras()
    expect(compras.find((compra) => compra.id === '2026-004')).toMatchObject({
      status: 'Aguardando conferência',
      comprovanteNome: 'recibo.pdf',
    })
  })
})
