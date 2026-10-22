// Runtime validation coverage for: storefront rendering.
import { render, screen, within } from '@testing-library/react'
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
})
