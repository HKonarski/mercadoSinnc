import { useState } from 'react'

// ---------- Tipos (-> T02, src/types/index.ts) ----------
type Produto = 
{
  id: string
  nome: string
  categoria: 'Doces' | 'Salgados' | 'Bebidas' | 'Chocolates'
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
  { id: '1', nome: 'Água mineral 500 ml', categoria: 'Bebidas', preco: 2.5, quantidade: 24, estoqueMinimo: 6, codigoBarras: '7891000000011' },
  { id: '2', nome: 'Refrigerante lata 350 ml', categoria: 'Bebidas', preco: 5, quantidade: 4, estoqueMinimo: 6, codigoBarras: '7891000000028' },
  { id: '3', nome: 'Pão de queijo', categoria: 'Salgados', preco: 3.5, quantidade: 0, estoqueMinimo: 4, codigoBarras: '7891000000035' },
  { id: '4', nome: 'Barra de chocolate', categoria: 'Chocolates', preco: 6.9, quantidade: 12, codigoBarras: '7891000000042' },
  { id: '5', nome: 'Café expresso em cápsula', categoria: 'Bebidas', preco: 2.2, quantidade: 5, estoqueMinimo: 5, codigoBarras: '7891000000059' },
  { id: '6', nome: 'Biscoito recheado sabor chocolate com cobertura extra grande', categoria: 'Doces', preco: 4.75, quantidade: 18, codigoBarras: '7891000000066' },
  { id: '7', nome: 'Suco de caixinha', categoria: 'Bebidas', preco: 3, quantidade: 9, estoqueMinimo: 3, codigoBarras: '7891000000073' },
  { id: '8', nome: 'Salgadinho', categoria: 'Salgados', preco: 4, quantidade: 1, codigoBarras: '7891000000080' },
]

const CATEGORIAS: Produto['categoria'][] = ['Doces', 'Salgados', 'Bebidas', 'Chocolates']

const COMO_COMPRAR =
[
  { titulo: 'Histórico de Compra', texto: 'Veja tudo o que você já retirou do mercadinho.' },
  { titulo: 'Valor Pendente na Ficha', texto: 'Acompanhe quanto falta pagar da sua ficha.' },
  { titulo: 'Registro de Comprovante', texto: 'Envie o comprovante do Pix para dar baixa.' },
]

// ---------- Utilitários (-> T03 e T05, src/utils) ----------
const formatarMoeda = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const normalizarBusca = (valor: string): string =>
  valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim()

const estaIndisponivel = (p: Produto): boolean => p.quantidade === 0

const estaComEstoqueBaixo = (p: Produto): boolean =>
  AVISO_ESTOQUE_MINIMO_ATIVO &&
  p.estoqueMinimo !== undefined &&
  p.quantidade > 0 &&
  p.quantidade <= p.estoqueMinimo

const estaNasUltimasUnidades = (p: Produto): boolean =>
  p.quantidade > 0 &&
  (p.estoqueMinimo !== undefined ? p.quantidade <= p.estoqueMinimo : p.quantidade <= 3)

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
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <p className="text-xs font-medium text-slate-500">{produto.categoria}</p>
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
        <h3 className="min-w-0 wrap-break-word text-base font-semibold leading-snug text-slate-900">
          {produto.nome}
        </h3>
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

type FiltrosCatalogo = {
  categorias: Produto['categoria'][]
  emEstoque: boolean
  ultimasUnidades: boolean
  visualizacao: 'grade' | 'lista'
}

function CaixaFiltros({
  filtros,
  onChange,
}: {
  filtros: FiltrosCatalogo
  onChange: (filtros: FiltrosCatalogo) => void
}) {
  const [mostrarFiltrosAdicionais, setMostrarFiltrosAdicionais] = useState(false)

  const alternarCategoria = (categoria: Produto['categoria']) => {
    const categorias = filtros.categorias.includes(categoria)
      ? filtros.categorias.filter((item) => item !== categoria)
      : [...filtros.categorias, categoria]

    onChange({ ...filtros, categorias })
  }

  return (
    <aside
      aria-labelledby="titulo-filtros"
      className="h-fit min-w-0 rounded-none border-0 bg-transparent p-0 shadow-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm"
    >
      <h2 id="titulo-filtros" className="sr-only text-lg font-semibold text-slate-900 lg:not-sr-only">
        Filtros
      </h2>

      <fieldset className="min-w-0 lg:mt-4">
        <legend className="sr-only text-sm font-semibold text-slate-700 lg:not-sr-only">Categoria</legend>
        <div className="-mx-3 mt-1 flex gap-2 overflow-x-auto px-3 pb-2 lg:mx-0 lg:mt-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0">
          <button
            type="button"
            aria-pressed={filtros.categorias.length === 0}
            onClick={() => onChange({ ...filtros, categorias: [] })}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              filtros.categorias.length === 0
                ? 'border-amber-500 bg-amber-400 font-semibold text-slate-900'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            } lg:hidden`}
          >
            Todos
          </button>
          {CATEGORIAS.map((categoria) => (
            <label
              key={categoria}
              className="has-[:checked]:border-amber-500 has-[:checked]:bg-amber-400 has-[:checked]:font-semibold has-[:checked]:text-slate-900 flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 focus-within:ring-2 focus-within:ring-blue-600 lg:has-[:checked]:border-transparent lg:has-[:checked]:bg-transparent lg:has-[:checked]:font-normal lg:has-[:checked]:text-slate-600 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
            >
              <input
                type="checkbox"
                checked={filtros.categorias.includes(categoria)}
                onChange={() => alternarCategoria(categoria)}
                className="sr-only h-4 w-4 rounded border-slate-300 accent-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 lg:not-sr-only"
              />
              {categoria}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        aria-expanded={mostrarFiltrosAdicionais}
        aria-controls="filtros-adicionais"
        onClick={() => setMostrarFiltrosAdicionais((mostrar) => !mostrar)}
        className="mt-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
      >
        {mostrarFiltrosAdicionais ? 'Menos filtros' : 'Mais filtros'}
      </button>

      <div
        id="filtros-adicionais"
        className={`${mostrarFiltrosAdicionais ? 'block' : 'hidden'} lg:block`}
      >
        <fieldset className="mt-2 border-t border-slate-100 pt-3 lg:mt-5 lg:pt-4">
          <legend className="text-sm font-semibold text-slate-700">Disponibilidade</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 lg:flex-col">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={filtros.emEstoque}
                onChange={(event) => onChange({ ...filtros, emEstoque: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600"
              />
              Em estoque
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={filtros.ultimasUnidades}
                onChange={(event) => onChange({ ...filtros, ultimasUnidades: event.target.checked })}
                className="h-4 w-4 rounded border-slate-300 accent-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600"
              />
              Últimas unidades
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-3 border-t border-slate-100 pt-3 lg:mt-5 lg:pt-4">
          <legend className="text-sm font-semibold text-slate-700">Visualização</legend>
          <div className="mt-2 flex gap-2">
            {(['grade', 'lista'] as const).map((visualizacao) => (
              <button
                key={visualizacao}
                type="button"
                aria-pressed={filtros.visualizacao === visualizacao}
                onClick={() => onChange({ ...filtros, visualizacao })}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  filtros.visualizacao === visualizacao
                    ? 'border-blue-700 bg-blue-700 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {visualizacao}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  )
}

function BuscaProdutos({
  busca,
  onBuscaChange,
}: {
  busca: string
  onBuscaChange: (busca: string) => void
}) 
{
  return (
    <>
      <label htmlFor="busca-produtos" className="sr-only">
        Buscar produtos por nome, tipo, valor ou código
      </label>
      <input
        id="busca-produtos"
        type="search"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        placeholder="Buscar por nome, tipo, valor ou código de barras"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 lg:col-start-2 lg:row-start-1"
      />
    </>
  )
}

function ListaProdutos({ filtros, busca }: { filtros: FiltrosCatalogo; busca: string }) {
  const produtosFiltrados = PRODUTOS.filter((produto) => {
    const termo = normalizarBusca(busca)
    const precoFormatado = formatarMoeda(produto.preco)
    const precoComPonto = produto.preco.toFixed(2)
    const precoComVirgula = precoComPonto.replace('.', ',')
    const correspondeABusca =
      termo.length === 0 ||
      [
        produto.nome,
        produto.categoria,
        produto.codigoBarras,
        precoFormatado,
        precoComPonto,
        precoComVirgula,
        String(produto.preco),
      ].some((campo) => normalizarBusca(campo).includes(termo))
    const categoriaSelecionada =
      filtros.categorias.length === 0 || filtros.categorias.includes(produto.categoria)
    const disponibilidadeSelecionada =
      (!filtros.emEstoque || produto.quantidade > 0) &&
      (!filtros.ultimasUnidades || estaNasUltimasUnidades(produto))

    return correspondeABusca && categoriaSelecionada && disponibilidadeSelecionada
  })

  return (
    <section aria-labelledby="titulo-produtos" className="lg:col-start-2 lg:row-start-2">
      <h2 id="titulo-produtos" className="mb-3 text-lg font-semibold text-slate-900">
        Produtos
      </h2>
      <ul className={filtros.visualizacao === 'grade'
        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
        : 'grid grid-cols-1 gap-3'}
      >
        {produtosFiltrados.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </ul>
      {produtosFiltrados.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Nenhum produto encontrado para esses filtros.
        </p>
      )}
    </section>
  )
}

// ---------- Página ----------
export default function App() 
{
  const [filtros, setFiltros] = useState<FiltrosCatalogo>({
    categorias: [],
    emEstoque: false,
    ultimasUnidades: false,
    visualizacao: 'grade',
  })
  const [busca, setBusca] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Cabecalho />
      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[200px_minmax(0,1fr)_260px] lg:gap-5 lg:py-6">
        <BuscaProdutos busca={busca} onBuscaChange={setBusca} />
        <CaixaFiltros filtros={filtros} onChange={setFiltros} />
        <ListaProdutos filtros={filtros} busca={busca} />
        <div className="space-y-6 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <CardPagamento />
          <ComoComprar />
        </div>
      </main>
    </div>
  )
}