import type { Configuracao, Produto } from '../types'

export function estaIndisponivel(produto: Produto): boolean {
  return produto.quantidade === 0
}

export function estaComEstoqueBaixo(
  produto: Produto,
  configuracao: Configuracao,
): boolean {
  return (
    configuracao.avisoEstoqueMinimoAtivo &&
    produto.estoqueMinimo > 0 &&
    produto.quantidade > 0 &&
    produto.quantidade <= produto.estoqueMinimo
  )
}

export function estaNasUltimasUnidades(
  produto: Produto,
  configuracao: Configuracao,
): boolean {
  if (produto.quantidade <= 0) {
    return false
  }
  const possuiMinimoAtivo =
    configuracao.avisoEstoqueMinimoAtivo && produto.estoqueMinimo > 0
  const limite = possuiMinimoAtivo
    ? produto.estoqueMinimo
    : configuracao.limiteUltimasUnidades
  return limite > 0 && produto.quantidade <= limite
}
