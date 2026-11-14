export function Carregando({ mensagem }: { mensagem: string }) {
  return (
    <p
      role="status"
      className="rounded-xl bg-white p-6 text-center text-slate-600"
    >
      {mensagem}
    </p>
  )
}
