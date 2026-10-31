export function Cabecalho() {
  return (
    <header className="border-b border-blue-800 bg-blue-700 text-white">
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
        <button
          type="button"
          aria-label="Usuário"
          className="flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3"
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
      </div>
    </header>
  )
}
