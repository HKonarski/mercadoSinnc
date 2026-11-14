import { useCallback, useEffect, useState } from 'react'
import { catalogoService } from '../services/catalogoService'
import type { Catalogo } from '../types'

type EstadoProdutos =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem: string }
  | { estado: 'sucesso'; catalogo: Catalogo }

export function useProdutos() {
  const [estado, setEstado] = useState<EstadoProdutos>({
    estado: 'carregando',
  })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setEstado({ estado: 'carregando' })
    catalogoService.lerCatalogo().then(
      (catalogo) => {
        if (ativo) {
          setEstado({ estado: 'sucesso', catalogo })
        }
      },
      (erro: unknown) => {
        if (ativo) {
          setEstado({
            estado: 'erro',
            mensagem:
              erro instanceof Error
                ? erro.message
                : 'Não foi possível carregar o catálogo.',
          })
        }
      },
    )
    return () => {
      ativo = false
    }
  }, [tentativa])

  const tentarNovamente = useCallback(() => {
    catalogoService.limparCache()
    setTentativa((valor) => valor + 1)
  }, [])

  return { estado, tentarNovamente }
}
