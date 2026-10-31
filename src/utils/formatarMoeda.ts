export function formatarMoeda(centavos: number): string {
  if (!Number.isInteger(centavos)) {
    throw new Error(
      'O valor monetário deve ser informado em centavos inteiros.',
    )
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(centavos / 100)
    .replace(/[\u00a0\u202f]/g, ' ')
}
