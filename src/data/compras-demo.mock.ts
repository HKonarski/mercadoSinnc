import type { CompraDemo } from '../types'

const hoje = '2026-10-30T12:00:00-03:00'

export const comprasDemoIniciais: CompraDemo[] = [
  {
    id: '2026-004',
    data: hoje,
    totalCentavos: 1190,
    formaPagamento: 'Pix',
    status: 'Pendente',
    itens: [
      {
        nome: 'Água mineral 500 ml',
        precoUnitarioCentavos: 250,
        quantidade: 2,
      },
      { nome: 'Barra de chocolate', precoUnitarioCentavos: 690, quantidade: 1 },
    ],
    andamento: [{ descricao: 'Compra registrada', data: hoje }],
  },
  {
    id: '2026-003',
    data: '2026-10-29T12:00:00-03:00',
    totalCentavos: 440,
    formaPagamento: 'Pix',
    status: 'Aguardando conferência',
    itens: [
      {
        nome: 'Café expresso em cápsula',
        precoUnitarioCentavos: 220,
        quantidade: 2,
      },
    ],
    andamento: [
      { descricao: 'Compra registrada', data: '2026-10-29T11:00:00-03:00' },
      { descricao: 'Comprovante enviado', data: '2026-10-29T12:00:00-03:00' },
    ],
    comprovanteNome: 'comprovante-demo.pdf',
  },
  {
    id: '2026-002',
    data: '2026-10-28T12:00:00-03:00',
    totalCentavos: 800,
    formaPagamento: 'Ficha',
    status: 'Paga',
    itens: [{ nome: 'Salgadinho', precoUnitarioCentavos: 400, quantidade: 2 }],
    andamento: [
      { descricao: 'Compra registrada', data: '2026-10-28T10:00:00-03:00' },
      { descricao: 'Pagamento confirmado', data: '2026-10-28T12:00:00-03:00' },
    ],
  },
  {
    id: '2026-001',
    data: '2026-10-27T12:00:00-03:00',
    totalCentavos: 600,
    formaPagamento: 'Ficha',
    status: 'Cancelada',
    itens: [
      { nome: 'Suco de caixinha', precoUnitarioCentavos: 300, quantidade: 2 },
    ],
    andamento: [
      { descricao: 'Compra registrada', data: '2026-10-27T10:00:00-03:00' },
      { descricao: 'Compra cancelada', data: '2026-10-27T12:00:00-03:00' },
    ],
  },
]
