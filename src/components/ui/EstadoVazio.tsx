export function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-600">
      {mensagem}
    </p>
  )
}
