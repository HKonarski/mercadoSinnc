const atalhos = [
  {
    titulo: 'Histórico de Compra',
    texto: 'Veja tudo o que você já retirou do mercadinho.',
    tela: 'historico',
  },
  {
    titulo: 'Valor Pendente na Ficha',
    texto: 'Acompanhe quanto falta pagar da sua ficha.',
    tela: 'pendencias',
  },
  {
    titulo: 'Registro de Comprovante',
    texto: 'Envie o comprovante do Pix para dar baixa.',
    tela: 'comprovante',
  },
] as const

export function ComoComprar({
  abrirTela,
}: {
  abrirTela: (tela: (typeof atalhos)[number]['tela']) => void
}) {
  return (
    <section
      aria-labelledby="titulo-como-comprar"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2
        id="titulo-como-comprar"
        className="text-lg font-semibold text-slate-900"
      >
        Como comprar
      </h2>
      <ol className="mt-3 space-y-3">
        {atalhos.map((item, indice) => (
          <li key={item.titulo} className="flex min-w-0 gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {indice + 1}
            </span>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => abrirTela(item.tela)}
                className="text-left font-medium text-blue-800 underline decoration-transparent underline-offset-2 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                {item.titulo}
              </button>
              <p className="break-words text-sm text-slate-600">{item.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
