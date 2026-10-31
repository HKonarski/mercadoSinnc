# Plano técnico - Feature 001: Catálogo de produtos

Este plano descreve o **como** da `spec.md`. Qualquer decisão que mude
o comportamento volta primeiro para a spec.

## Stack
React + TypeScript (`strict`) + Tailwind CSS, conforme a constitution.
Vite como build e Vitest com Testing Library para testes.

## Estrutura de pastas
```
src/
├── components/
│   ├── catalogo/
│   │   ├── CatalogoPage.tsx       # monta a página
│   │   ├── BuscaProdutos.tsx      # campo de busca (R3)
│   │   ├── ListaProdutos.tsx      # grade de itens
│   │   ├── ProdutoCard.tsx        # nome, preço, estoque, selos (R2, R4, R5, R8)
│   │   └── FormasPagamento.tsx    # Pix e Ficha (R6, R7)
│   └── ui/                        # Carregando, Erro, EstadoVazio
├── types/
│   └── index.ts
├── services/
│   ├── produtosService.ts         # interface + implementação mock
│   └── configuracaoService.ts
├── data/
│   └── produtos.mock.ts
├── utils/
│   ├── formatarMoeda.ts           # 3.5 -> "R$ 3,50"
│   ├── normalizarTexto.ts         # remove acento e caixa (R3)
│   └── estoque.ts                 # regras de indisponível e estoque baixo
└── hooks/
    ├── useProdutos.ts
    └── useBuscaProdutos.ts
```

## Modelo de dados (TypeScript)
```ts
type Produto = {
  id: string
  nome: string
  preco: number              // em reais; ver D2
  quantidade: number
  estoqueMinimo?: number     // opcional por item (R5.3)
  codigoBarras: string
  ativo: boolean
}

type Configuracao = {
  avisoEstoqueMinimoAtivo: boolean   // chave geral (R5.1)
  chavePix: string
}

type FormaPagamento = {
  id: 'pix' | 'ficha'                // união extensível (R7)
  nome: string
  descricao: string
}
```

## Decisões técnicas
- **D1. Camada de serviço com interface.** Os componentes nunca leem o
  mock direto: pedem ao `produtosService`. Na Fase 5 troca-se a
  implementação mock pela chamada à API em Java sem mexer nos
  componentes.
- **D2. Preço como `number` em reais por enquanto.** Se aparecerem
  erros de arredondamento nos totais (Feature 002), migrar para
  centavos inteiros. Toda formatação passa por `formatarMoeda`.
- **D3. Regras de estoque em funções puras** (`utils/estoque.ts`):
  ```ts
  estaIndisponivel(produto) // quantidade === 0
  estaComEstoqueBaixo(produto, config) // config.avisoEstoqueMinimoAtivo
    // && produto.estoqueMinimo !== undefined
    // && produto.quantidade > 0
    // && produto.quantidade <= produto.estoqueMinimo
  ```
  Mapeiam R4 e R5.1 a R5.4 e são fáceis de testar.
- **D4. Busca no cliente:** filtra o array já carregado com
  `normalizarTexto` (NFD, remoção de diacríticos, minúsculas, sem
  espaços nas pontas). Para o volume de um mercadinho, é suficiente.
- **D5. Formas de pagamento em constante tipada**, não em `if`s
  espalhados. Adicionar "cartao" no futuro é incluir um item na lista
  e no tipo.
- **D6. Estados da tela** (carregando, erro, vazio, sem resultado) são
  tratados explicitamente no hook `useProdutos`.
- **D7. Estilo só com Tailwind**, mobile-first (`sm:`, `md:`, `lg:`).
- **D8. Botão "Adicionar ao carrinho" desacoplado.** O `ProdutoCard`
  recebe `onAdicionar` por parâmetro. Até a Feature 002 existir, a
  função não faz nada; a Feature 002 só liga a função, sem mudar o
  card.
- **D9. Chave Pix dentro de `Configuracao`**, porque o administrador
  precisará alterá-la (Feature 008).

## Mapa requisito -> onde é atendido
| Requisito | Onde |
|---|---|
| R1, R2 | `ProdutoCard` + `ListaProdutos` |
| R3 | `useBuscaProdutos` + `normalizarTexto` |
| R4 | `estoque.ts` + `ProdutoCard` (botão desabilitado) |
| R5 | `estoque.ts` + `configuracaoService` |
| R6, R7 | `FormasPagamento` + tipo `FormaPagamento` |
| R8 | `ProdutoCard` |
| R9 | classes responsivas do Tailwind |

## Relação com o marco da Fase 2
A página da Fase 2 (`specs/marcos/fase-2.md`) é uma versão provisória e
estática, toda no `App.tsx`. Depois da entrega ela é refatorada para
esta estrutura, seguindo as tarefas T10 a T14.

## Testes
- Unitários (Vitest): `formatarMoeda`, `normalizarTexto`, `estoque.ts`
- Hooks: `useProdutos` (sucesso e erro) e `useBuscaProdutos`
- Cobrir cada critério de aceite da spec, em especial os cenários de
  estoque mínimo ligado e desligado
