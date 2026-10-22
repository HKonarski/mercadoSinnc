import { useState } from 'react'

// ---------- Tipos (-> T02, src/types/index.ts) ----------
type Produto = 
{
  id: string
  nome: string
  preco: number
  quantidade: number
  estoqueMinimo?: number
  codigoBarras: string
}

type FormaPagamento = 
{
  id: 'pix' | 'ficha'
  nome: string
  descricao: string
}

// ---------- Dados fixos (-> T06, src/data e serviços) ----------
const AVISO_ESTOQUE_MINIMO_ATIVO = true
const CHAVE_PIX = 'CHAVE-PIX-DA-SINNC' // trocar pela chave real
const VALOR_CARRINHO = 0

const FORMAS_PAGAMENTO: FormaPagamento[] = 
[
  { id: 'pix', nome: 'Pix', descricao: 'Copie a chave e pague pelo app do banco' },
  { id: 'ficha', nome: 'Ficha', descricao: 'Fica registrado para pagar depois' },
]

const PRODUTOS: Produto[] = 
[
  { id: '1', nome: 'Água mineral 500 ml', preco: 2.5, quantidade: 24, estoqueMinimo: 6, codigoBarras: '7891000000011' },
  { id: '2', nome: 'Refrigerante lata 350 ml', preco: 5, quantidade: 4, estoqueMinimo: 6, codigoBarras: '7891000000028' },
  { id: '3', nome: 'Pão de queijo', preco: 3.5, quantidade: 0, estoqueMinimo: 4, codigoBarras: '7891000000035' },
  { id: '4', nome: 'Barra de chocolate', preco: 6.9, quantidade: 12, codigoBarras: '7891000000042' },
  { id: '5', nome: 'Café expresso em cápsula', preco: 2.2, quantidade: 5, estoqueMinimo: 5, codigoBarras: '7891000000059' },
  { id: '6', nome: 'Biscoito recheado sabor chocolate com cobertura extra grande', preco: 4.75, quantidade: 18, codigoBarras: '7891000000066' },
  { id: '7', nome: 'Suco de caixinha', preco: 3, quantidade: 9, estoqueMinimo: 3, codigoBarras: '7891000000073' },
  { id: '8', nome: 'Salgadinho', preco: 4, quantidade: 1, codigoBarras: '7891000000080' },
]

const COMO_COMPRAR =
[
  { titulo: 'Histórico de Compra', texto: 'Veja tudo o que você já retirou do mercadinho.' },
  { titulo: 'Valor Pendente na Ficha', texto: 'Acompanhe quanto falta pagar da sua ficha.' },
  { titulo: 'Registro de Comprovante', texto: 'Envie o comprovante do Pix para dar baixa.' },
]

// ---------- Utilitários (-> T03 e T05, src/utils) ----------
const formatarMoeda = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const estaIndisponivel = (p: Produto): boolean => p.quantidade === 0

const estaComEstoqueBaixo = (p: Produto): boolean =>
  AVISO_ESTOQUE_MINIMO_ATIVO &&
  p.estoqueMinimo !== undefined &&
  p.quantidade > 0 &&
  p.quantidade <= p.estoqueMinimo

// ---------- Componentes (-> T10 a T14, src/components) ----------
function Cabecalho() 
{
  return (
    <header className="border-b border-blue-800 bg-blue-700 text-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <a href="/" aria-label="Mercadinho SINNC - início" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">
            Mercadinho
          </span>
          <img
            src="/assets/img/logo-sinnc.png"
            alt="SINNC"
            className="h-10 w-14 shrink-0 object-contain brightness-0 invert sm:h-11 sm:w-16"
          />
        </a>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 sm:px-3"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <circle cx="12" cy="7" r="4" />
            <path d="M3 21a9 9 0 0 1 18 0H3Z" />
          </svg>
          <span>Usuário</span>
        </button>
      </div>
    </header>
  )
}

function CardPagamento() 
{
  const [copiado, setCopiado] = useState(false)

  const copiarChave = async () => 
    {
    try 
    {
      await navigator.clipboard.writeText(CHAVE_PIX)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch 
    {
      setCopiado(false)
    }
  }

  return (
    <section aria-labelledby="titulo-pagamento" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 id="titulo-pagamento" className="text-lg font-semibold text-slate-900">
        Pagamento
      </h2>

      <p className="mt-3 text-sm text-slate-500">Valor do carrinho</p>
      <p className="text-3xl font-bold text-slate-900">{formatarMoeda(VALOR_CARRINHO)}</p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={copiarChave}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {copiado ? 'Chave copiada!' : 'Copiar Chave Pix'}
        </button>
        <button
          type="button"
          className="rounded-lg border border-blue-700 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Registrar na Ficha
        </button>
      </div>

      <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
        {FORMAS_PAGAMENTO.map((f) => (
          <li key={f.id} className="text-sm">
            <span className="font-semibold text-slate-800">{f.nome}:</span>{' '}
            <span className="text-slate-600">{f.descricao}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ComoComprar() 
{
  return (
    <section aria-labelledby="titulo-como-comprar" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 id="titulo-como-comprar" className="text-lg font-semibold text-slate-900">
        Como comprar
      </h2>
      <ol className="mt-3 space-y-3">
        {COMO_COMPRAR.map((item, i) => (
          <li key={item.titulo} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-slate-900">{item.titulo}</p>
              <p className="text-sm text-slate-600">{item.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProdutoCard({ produto }: { produto: Produto }) {
  const indisponivel = estaIndisponivel(produto)
  const baixo = estaComEstoqueBaixo(produto)

  return (
    <li className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="wrap-break-word font-semibold text-slate-900">{produto.nome}</h3>
          {indisponivel && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Indisponível
            </span>
          )}
          {baixo && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Estoque baixo
            </span>
          )}
        </div>
        <p className="mt-2 text-xl font-bold text-slate-900">{formatarMoeda(produto.preco)}</p>
        <p className="text-sm text-slate-600">Disponível: {produto.quantidade}</p>
        <p className="mt-1 text-xs text-slate-400">Cód. {produto.codigoBarras}</p>
      </div>

      <button
        type="button"
        disabled={indisponivel}
        className="mt-4 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Adicionar ao carrinho
      </button>
    </li>
  )
}

function ListaProdutos() 
{
  return (
    <section aria-labelledby="titulo-produtos">
      <h2 id="titulo-produtos" className="mb-3 text-lg font-semibold text-slate-900">
        Produtos
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PRODUTOS.map((p) => (
          <ProdutoCard key={p.id} produto={p} />
        ))}
      </ul>
    </section>
  )
}

// ---------- Página ----------
export default function App() 
{
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Cabecalho />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="space-y-6 lg:order-2 lg:col-span-1">
          <CardPagamento />
          <ComoComprar />
        </div>
        <div className="lg:order-1 lg:col-span-2">
          <ListaProdutos />
        </div>
      </main>
    </div>
  )
}