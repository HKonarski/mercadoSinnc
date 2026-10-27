# Plano técnico - Feature 001: Catálogo de produtos (v2)

Este plano descreve o **como** da `spec.md` (versão 2). Qualquer decisão
que mude o comportamento volta primeiro para a spec.

## Histórico de alterações
- **v1:** estrutura base, estoque mínimo, busca por nome, pagamento
- **v2:** acrescenta categorias, filtros, "Últimas unidades", alternância
  grade/lista e busca ampliada (spec v2); alinha nomes ao código da
  Fase 2 (`normalizarBusca`); separa o estado de visualização dos
  filtros; adiciona `filtrarProdutos` como função pura

## Stack
React + TypeScript (`strict`) + Tailwind CSS, conforme a constitution.
Vite como build, Vitest com Testing Library para testes e Prettier para
formatação.

## Estrutura de pastas
```
src/
├── components/
│   ├── catalogo/
│   │   ├── CatalogoPage.tsx       # monta a página e o estado de busca/filtros
│   │   ├── BuscaProdutos.tsx      # campo de busca (R3)
│   │   ├── CaixaFiltros.tsx       # categoria, disponibilidade, visualização (R11, R13)
│   │   ├── ListaProdutos.tsx      # grade ou lista de itens (R13)
│   │   ├── ProdutoCard.tsx        # categoria, nome, preço, estoque, selos (R2, R4, R5, R8, R10)
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
│   ├── normalizarBusca.ts         # remove acento, caixa e espaços repetidos (R3)
│   ├── estoque.ts                 # indisponível, estoque baixo, últimas unidades
│   └── filtrarProdutos.ts         # busca + filtros combinados (R3, R11)
└── hooks/
    ├── useProdutos.ts             # carregando, erro, sucesso
    └── useFiltroCatalogo.ts       # busca, filtros e lista filtrada
```

## Modelo de dados (TypeScript)
```ts
const CATEGORIAS = ['Doces', 'Salgados', 'Bebidas', 'Chocolates'] as const
type Categoria = (typeof CATEGORIAS)[number]

type Produto = {
  id: string
  nome: string
  categoria: Categoria          // R10
  preco: number                 // em reais; ver D2
  quantidade: number
  estoqueMinimo?: number        // opcional por item (R5.3)
  codigoBarras: string
  ativo: boolean
}

type Configuracao = {
  avisoEstoqueMinimoAtivo: boolean   // chave geral (R5.1)
  limiteUltimasUnidades: number      // padrão 3 (R12)
  chavePix: string
}

type FormaPagamento = {
  id: 'pix' | 'ficha'                // união extensível (R7)
  nome: string
  descricao: string
}

// Filtros mudam QUAIS itens aparecem (R11)
type FiltrosCatalogo = {
  categorias: Categoria[]            // vazio = todas
  emEstoque: boolean
  ultimasUnidades: boolean
}

// Visualização muda SÓ o formato (R13)
type Visualizacao = 'grade' | 'lista'
```

## Decisões técnicas
- **D1. Camada de serviço com interface.** Os componentes nunca leem o
  mock direto: pedem ao `produtosService`. Na Fase 5 troca-se a
  implementação mock pela chamada à API em Java sem mexer nos
  componentes. O serviço devolve só itens ativos (R1).
- **D2. Preço como `number` em reais por enquanto.** Se aparecerem erros
  de arredondamento nos totais (Feature 002), migrar para centavos
  inteiros. Toda formatação passa por `formatarMoeda`.
- **D3. Regras de estoque em funções puras** (`utils/estoque.ts`):
  ```ts
  estaIndisponivel(produto)                // quantidade === 0
  estaComEstoqueBaixo(produto, config)     // aviso ativo
    // && estoqueMinimo !== undefined
    // && quantidade > 0 && quantidade <= estoqueMinimo
  estaNasUltimasUnidades(produto, config)  // quantidade > 0 && quantidade <= limite
    // limite = (aviso ativo && estoqueMinimo !== undefined)
    //          ? estoqueMinimo
    //          : config.limiteUltimasUnidades
  ```
  Mapeiam R4, R5.1 a R5.4 e R12. A regra de R12 está **[a confirmar]** na
  spec; se mudar, só `estaNasUltimasUnidades` muda. Todas recebem a
  configuração como parâmetro, sem ler constantes globais.
- **D4. Busca no cliente** (R3): `normalizarBusca` aplica NFD, remove
  diacríticos, converte para minúsculas e colapsa espaços. O item casa
  se o termo normalizado aparece em qualquer um destes campos
  normalizados: nome, categoria, código de barras e preço (nos formatos
  `formatarMoeda`, `toFixed(2)` com ponto, com vírgula e o número
  cru). Busca por trecho, como no código da Fase 2. Se a pergunta em
  aberto da spec decidir por busca exata em código e preço, só
  `filtrarProdutos` muda.
- **D5. Formas de pagamento em constante tipada**, não em `if`s
  espalhados. Adicionar "cartao" no futuro é incluir um item na lista e
  no tipo.
- **D6. Estados da tela** são tratados explicitamente:
  carregando e erro no `useProdutos`; "Nenhum item cadastrado ainda"
  quando a lista completa está vazia; "Nenhum produto encontrado para
  esses filtros." quando há itens mas o resultado filtrado é vazio. São
  mensagens diferentes (spec, casos de borda).
- **D7. Estilo só com Tailwind**, mobile-first (`sm:`, `md:`, `lg:`).
- **D8. Botão "Adicionar ao carrinho" desacoplado.** O `ProdutoCard`
  recebe `onAdicionar` por parâmetro. Até a Feature 002 existir, a
  função não faz nada; a Feature 002 só liga a função, sem mudar o
  card.
- **D9. Chave Pix dentro de `Configuracao`**, porque o administrador
  precisará alterá-la (Feature 007).
- **D10. `filtrarProdutos(produtos, busca, filtros, config)`** é uma
  função pura que aplica busca e filtros em conjunto (todos precisam
  ser atendidos). Sai de dentro de `ListaProdutos`, onde estava na
  Fase 2, para ficar testável e respeitar a constitution.
- **D11. Visualização separada dos filtros.** Na Fase 2 `visualizacao`
  morava dentro de `FiltrosCatalogo`. Na refatoração vira um estado
  próprio (`Visualizacao`), porque não altera o resultado (R13).
- **D12. Categorias como constante tipada** (`CATEGORIAS ... as const`),
  da qual o tipo `Categoria` é derivado. Lista de filtros, tipo do
  produto e dados mock usam a mesma fonte. Se o administrador passar a
  cadastrar categorias (pergunta em aberto), isso migra para dados do
  serviço.
- **D13. Formatação com Prettier**, com configuração mínima do projeto,
  para acabar com a formatação mista (chaves em linhas diferentes).
- **D14. Layout dos filtros no celular em aberto.** `CaixaFiltros` não
  assume onde fica nem se é recolhível; a decisão da spec (botão
  "Filtros" no mobile) entra na tarefa de responsividade.

## Mapa requisito -> onde é atendido
| Requisito | Onde |
|---|---|
| R1 | `produtosService` (só ativos) + `ListaProdutos` |
| R2, R8 | `ProdutoCard` |
| R3 | `BuscaProdutos` + `normalizarBusca` + `filtrarProdutos` |
| R4 | `estoque.ts` + `ProdutoCard` (botão desabilitado) |
| R5 | `estoque.ts` + `configuracaoService` |
| R6, R7 | `FormasPagamento` + tipo `FormaPagamento` |
| R9 | classes responsivas do Tailwind |
| R10 | tipo `Categoria` + `ProdutoCard` |
| R11 | `CaixaFiltros` + `filtrarProdutos` |
| R12 | `estaNasUltimasUnidades` em `estoque.ts` |
| R13 | `CaixaFiltros` + `ListaProdutos` + tipo `Visualizacao` |

## Relação com o marco da Fase 2
A página da Fase 2 (`specs/marcos/fase-2.md`) é uma versão provisória,
toda no `App.tsx`, e já inclui busca ampliada, categorias, filtros e
alternância de visualização. Depois da entrega ela é refatorada para
esta estrutura, seguindo as tarefas T02 a T16.

Os testes de integração que já existem em `src/test/App.test.tsx`
funcionam como rede de segurança: **devem continuar passando durante
toda a refatoração**. Quebrou um teste, a refatoração mudou o
comportamento.

## Testes
- Unitários (Vitest): `formatarMoeda`, `normalizarBusca`, `estoque.ts`
  (indisponível, estoque baixo e últimas unidades, com aviso ligado e
  desligado) e `filtrarProdutos` (cada critério de busca e filtro da
  spec e as combinações)
- Hooks: `useProdutos` (sucesso e erro) e `useFiltroCatalogo`
- Integração: manter `App.test.tsx` como está e acrescentar o que
  faltar (copiar a chave Pix, só Pix e Ficha, mensagem de catálogo
  vazio)
- Cobrir cada critério de aceite da spec v2
