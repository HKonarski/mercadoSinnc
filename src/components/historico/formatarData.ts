export function formatarData(data: string): string {
  const dataValida = new Date(data)
  if (Number.isNaN(dataValida.getTime())) {
    throw new Error('Data inválida no registro demonstrativo.')
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dataValida)
}
