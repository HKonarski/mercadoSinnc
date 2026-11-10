import { useState } from 'react'

export type SecaoCatalogo = 'pagamento' | 'como-comprar'

export function Cabecalho({
  mostrarMenuCatalogo = false,
  onSelecionarSecao,
}: {
  mostrarMenuCatalogo?: boolean
  onSelecionarSecao?: (secao: SecaoCatalogo) => void
}) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-blue-800 bg-blue-700 text-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <a
          href={import.meta.env.BASE_URL}
          aria-label="Mercadinho SINNC - início"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">
            Mercadinho
          </span>
          <img
            src={`${import.meta.env.BASE_URL}assets/img/logo-sinnc.png`}
            alt="SINNC"
            className="h-10 w-14 shrink-0 object-contain brightness-0 invert sm:h-11 sm:w-16"
          />
        </a>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Usuário"
            className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="currentColor"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M3 21a9 9 0 0 1 18 0H3Z" />
            </svg>
            Usuário
          </button>
          {mostrarMenuCatalogo && (
            <button
              type="button"
              aria-label={menuAberto ? 'Fechar navegação' : 'Abrir navegação'}
              aria-expanded={menuAberto}
              aria-controls="menu-navegacao-catalogo"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="rounded-lg p-2 text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {mostrarMenuCatalogo && (
        <nav
          id="menu-navegacao-catalogo"
          aria-label="Navegação do catálogo"
          hidden={!menuAberto}
          className="absolute right-4 top-full w-56 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-lg lg:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setMenuAberto(false)
              onSelecionarSecao?.('pagamento')
            }}
            className="block rounded-md px-3 py-2 font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            Pagamento
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuAberto(false)
              onSelecionarSecao?.('como-comprar')
            }}
            className="block rounded-md px-3 py-2 font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            Como comprar
          </button>
        </nav>
      )}
    </header>
  )
}
