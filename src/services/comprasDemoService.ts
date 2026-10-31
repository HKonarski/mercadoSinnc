import { comprasDemoIniciais } from '../data/compras-demo.mock'
import type { CompraDemo } from '../types'

let compras: CompraDemo[] = structuredClone(comprasDemoIniciais)

function clonarCompras(): CompraDemo[] {
  return structuredClone(compras)
}

export const comprasDemoService = {
  async listarCompras(): Promise<CompraDemo[]> {
    return clonarCompras()
  },
  async enviarComprovante(ids: string[], nomeArquivo: string): Promise<void> {
    const selecionadas = compras.filter(
      ({ id, status }) => ids.includes(id) && status === 'Pendente',
    )
    if (selecionadas.length !== ids.length || ids.length === 0) {
      throw new Error('Selecione somente compras pendentes.')
    }
    const data = new Date().toISOString()
    compras = compras.map((compra) =>
      ids.includes(compra.id)
        ? {
            ...compra,
            status: 'Aguardando conferência',
            comprovanteNome: nomeArquivo,
            andamento: [
              ...compra.andamento,
              { descricao: 'Comprovante enviado', data },
            ],
          }
        : compra,
    )
  },
  reiniciar(): void {
    compras = structuredClone(comprasDemoIniciais)
  },
}
