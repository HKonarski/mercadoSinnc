// Runtime validation coverage for: storefront rendering.
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('storefront', () => {
  it('renders the product catalog and payment details', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Mercadinho SINNC - início' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'SINNC' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Usuário' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Produtos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pagamento' })).toBeInTheDocument()
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument()
  })

  it('marks out-of-stock products unavailable and disables their add button', () => {
    render(<App />)

    const product = screen.getByText('Pão de queijo').closest('li')
    expect(product).not.toBeNull()

    if (product) {
      expect(within(product).getByText('Indisponível')).toBeInTheDocument()
      expect(within(product).getByRole('button', { name: 'Adicionar ao carrinho' })).toBeDisabled()
    }
  })

  it('shows category and stock status above the product name', () => {
    render(<App />)

    const product = screen.getByRole('heading', { name: 'Refrigerante lata 350 ml' }).closest('li')
    expect(product).not.toBeNull()

    if (product) {
      const category = within(product).getByText('Bebidas')
      const stockStatus = within(product).getByText('Estoque baixo')
      const productName = within(product).getByRole('heading', { name: 'Refrigerante lata 350 ml' })

      expect(category.compareDocumentPosition(stockStatus) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(stockStatus.compareDocumentPosition(productName) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })

  it('filters by category and availability and switches to list view', async () => {
    const user = userEvent.setup()
    render(<App />)

    const allCategories = screen.getByRole('button', { name: 'Todos' })
    expect(allCategories).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('checkbox', { name: 'Doces' }))
    expect(allCategories).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Biscoito recheado sabor chocolate com cobertura extra grande')).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()

    await user.click(allCategories)
    expect(allCategories).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()

    const moreFilters = screen.getByRole('button', { name: 'Mais filtros' })
    await user.click(moreFilters)
    expect(screen.getByRole('button', { name: 'Menos filtros' })).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('checkbox', { name: 'Em estoque' }))
    expect(screen.queryByText('Pão de queijo')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Últimas unidades' }))
    expect(screen.getByText('Refrigerante lata 350 ml')).toBeInTheDocument()
    expect(screen.getByText('Salgadinho')).toBeInTheDocument()

    const listButton = screen.getByRole('button', { name: 'lista' })
    await user.click(listButton)
    expect(listButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('searches products by name, type, price and barcode without accent sensitivity', async () => {
    const user = userEvent.setup()
    render(<App />)
    const search = screen.getByRole('searchbox', {
      name: 'Buscar produtos por nome, tipo, valor ou código',
    })

    await user.type(search, 'agua')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.queryByText('Pão de queijo')).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'salgados')
    expect(screen.getByText('Salgadinho')).toBeInTheDocument()
    expect(screen.getByText('Pão de queijo')).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'R$ 2,50')
    expect(screen.getByText('Água mineral 500 ml')).toBeInTheDocument()
    expect(screen.queryByText('Barra de chocolate')).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, '7891000000035')
    expect(screen.getByText('Pão de queijo')).toBeInTheDocument()
    expect(screen.queryByText('Água mineral 500 ml')).not.toBeInTheDocument()
  })
})
