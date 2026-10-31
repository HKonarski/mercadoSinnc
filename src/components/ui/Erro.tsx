export function Erro({
  mensagem,
  tentarNovamente,
}: {
  mensagem: string
  tentarNovamente: () => void
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
    >
      <p>{mensagem}</p>
      <button
        type="button"
        onClick={tentarNovamente}
        className="mt-3 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Tentar de novo
      </button>
    </div>
  )
}
