# Plano técnico - Feature 001: Catálogo de produtos (v3)

Este plano descreve o **como** da `spec.md` (versão 3). Qualquer decisão
que mude o comportamento volta primeiro para a spec.

## Histórico de alterações
- **v1:** estrutura base, estoque mínimo, busca por nome, pagamento
- **v2:** acrescenta categorias, filtros, "Últimas unidades", alternância
  grade/lista e busca ampliada (spec v2); alinha nomes ao código da
  Fase 2 (`normalizarBusca`); separa o estado de visualização dos
  filtros; adiciona `filtrarProdutos` como função pura
- **v3 (ajuste):** preço em centavos inteiros (D2)
- **v3:** categorias passam a ser dados do serviço (cadastradas pelo
  administrador); `estoqueMinimo` vira número com 0 = "sem mínimo";
  limite de "Últimas unidades" configurável; itens ocultos; painel de
  filtros recolhível no celular (`FiltrosRecolhiveis`)

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
│   │   ├── FiltrosRecolhiveis.tsx # botão "Filtros" + painel no celular (R15)
│   │   ├── ListaProdutos.tsx      # grade ou lista de itens (R13)
│   │   ├── ProdutoCard.tsx        # categoria, nome, preço, estoque, selos (R2, R4, R5, R8, R10)
│   │   └── FormasPagamento.tsx    # Pix e Ficha (R6, R7)
│   └── ui/                        # Carregando, Erro, EstadoVazio
├── types/
│   └── index.ts
├── services/
│   ├── produtosService.ts         # interface + implementação mock
│   ├── categoriasService.ts       # categorias cadastradas pelo administrador
│   └── configuracaoService.ts
├── data/
│   └── produtos.mock.ts
├── utils/
│   ├── formatarMoeda.ts           # 350 centavos -> "R$ 3,50"
│   ├── normalizarBusca.ts         # remove acento, caixa e espaços repetidos (R3)
│   ├── estoque.ts                 # indisponível, estoque baixo, últimas unidades
│   ├── filtrarProdutos.ts         # busca + filtros combinados (R3, R11)
│   └── categoriasComItens.ts      # categorias exibidas nos filtros (R11)
└── hooks/
    ├── useProdutos.ts             # carregando, erro, sucesso
    └── useFiltroCatalogo.ts       # busca, filtros e lista filtrada
```

## Modelo de dados (TypeScript)
```ts
type Categoria = {
  id: string
  nome: string                  // cadastrada pelo administrador (R10)
}

type Produto = {
  id: string
  nome: string
  categoria: Categoria          // R10
  precoCentavos: number         // inteiro, em centavos; ver D2
  quantidade: number
  estoqueMinimo: number         // 0 = sem mínimo (R5.3)
  codigoBarras: string
  ativo: boolean                // false = oculto (R14)
}

type Configuracao = {
  avisoEstoqueMinimoAtivo: boolean   // chave geral (R5.1)
  limiteUltimasUnidades: number      // padrão 3; 0 = não existe (R12)
  chavePix: string
}

type FormaPagamento = {
  id: 'pix' | 'ficha'                // união extensível (R7)
  nome: string
  descricao: string
}

// Filtros mudam QUAIS itens aparecem (R11)
type FiltrosCatalogo = {
  categoriaIds: string[]             // vazio = todas
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
  componentes. O serviço devolve só itens visíveis, ou seja, `ativo: true` (R1, R14).
- **D2. Preço em centavos inteiros** (`precoCentavos`). Evita erro de
  arredondamento com números decimais (0,1 + 0,2) nos totais do
  carrinho (Feature 002) e, mais tarde, nos saldos (Feature 006). A
  decisão é tomada já na refatoração do catálogo porque migrar depois
  mexeria em tipos, mock, testes e busca. Toda formatação passa por
  `formatarMoeda(centavos)`, que divide por 100 e formata em R$; dados
  de serviços já chegam em centavos. Valores com vírgula só existem na
  tela e na busca.
- **D3. Regras de estoque em funções puras** (`utils/estoque.ts`):
  ```ts
  temEstoqueMinimo(produto)                // estoqueMinimo > 0
  estaIndisponivel(produto)                // quantidade === 0
  estaComEstoqueBaixo(produto, config)     // aviso ativo
    // && temEstoqueMinimo(produto)
    // && quantidade > 0 && quantidade <= estoqueMinimo
  estaNasUltimasUnidades(produto, config)  // quantidade > 0 && quantidade <= limite
    // limite = (aviso ativo && temEstoqueMinimo(produto))
    //          ? estoqueMinimo
    //          : config.limiteUltimasUnidades
  ```
  Mapeiam R4, R5.1 a R5.4 e R12. O valor 0 em `estoqueMinimo` e em
  `limiteUltimasUnidades` significa "não existe". Com limite 0, a
  condição `quantidade <= limite` nunca vale para quantidade maior que
  zero, então nenhum item sem mínimo entra em "Últimas unidades", sem
  caso especial. A interpretação do 0 está **[a confirmar]** na spec;
  se mudar, só `temEstoqueMinimo` e `estaNasUltimasUnidades` mudam.
  Todas recebem a configuração como parâmetro, sem ler constantes
  globais.
- **D4. Busca no cliente** (R3): `normalizarBusca` aplica NFD, remove
  diacríticos, converte para minúsculas e colapsa espaços. O item casa
  se o termo normalizado aparece em qualquer um destes campos
  normalizados: nome, categoria, código de barras e preço (nos formatos
  `formatarMoeda`, "2.50" com ponto, "2,50" com vírgula e "2.5", todos
  gerados a partir de `precoCentavos`). Busca por trecho em todos os campos (decisão confirmada:
  "choco" encontra todo item com "choco" no nome ou na categoria). O
  nome da categoria vem de `produto.categoria.nome`. Se a pergunta em
  aberto sobre várias palavras for aprovada, só `filtrarProdutos`
  muda.
- **D5. Formas de pagamento em constante tipada**, não em `if`s
  espalhados. Adicionar "credito" (Feature 006, evolução) ou "cartao"
  no futuro é incluir um item na lista e no tipo, sem exibir a forma
  antes de ela existir.
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
  precisará alterá-la (Feature 008).
- **D10. `filtrarProdutos(produtos, busca, filtros, config)`** é uma
  função pura que aplica busca e filtros em conjunto (todos precisam
  ser atendidos). Sai de dentro de `ListaProdutos`, onde estava na
  Fase 2, para ficar testável e respeitar a constitution.
- **D11. Visualização separada dos filtros.** Na Fase 2 `visualizacao`
  morava dentro de `FiltrosCatalogo`. Na refatoração vira um estado
  próprio (`Visualizacao`), porque não altera o resultado (R13).
- **D12. Categorias como dados do serviço** (`categoriasService`),
  cadastradas pelo administrador (R10). Cada `Produto` carrega sua
  `categoria` (id e nome), como uma API devolveria, o que evita
  consultas extras na busca. A lista de filtros vem de
  `categoriasComItens(categorias, produtos)`, que devolve só as
  categorias com pelo menos um item visível **[a confirmar]**.
- **D13. Formatação com Prettier**, com configuração mínima do projeto,
  para acabar com a formatação mista (chaves em linhas diferentes).
- **D14. Filtros recolhíveis no celular (R15).** `FiltrosRecolhiveis`
  envolve a `CaixaFiltros`: o botão "Filtros" (com `aria-expanded`)
  só aparece abaixo de um breakpoint e a caixa fica sempre visível
  acima dele. A troca é feita com classes responsivas do Tailwind,
  sem medir a tela em JavaScript; só o estado aberto/fechado é do
  componente. O breakpoint (e o comportamento no tablet) segue os
  wireframes em `docs/`; o contador de filtros ativos no botão está
  **[a confirmar]**. Os filtros e a busca ficam no estado da página,
  então não se perdem ao redimensionar.
- **D15. Itens ocultos (R14).** `ativo: false` é o "oculto". O serviço
  não os devolve, então busca, filtros, lista de categorias e a
  leitura de código de barras (Feature 003) nunca os veem, e o
  carrinho (Feature 002) os trata como indisponíveis. Ocultar e
  reexibir (com quantidade) são ações da Feature 008.

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
| R10 | `categoriasService` + `ProdutoCard` |
| R11 | `CaixaFiltros` + `filtrarProdutos` + `categoriasComItens` |
| R12 | `estaNasUltimasUnidades` em `estoque.ts` |
| R13 | `CaixaFiltros` + `ListaProdutos` + tipo `Visualizacao` |
| R14 | `produtosService` (só `ativo: true`) |
| R15 | `FiltrosRecolhiveis` + classes responsivas |

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
  desligado, mínimo 0 e limite padrão alterado ou 0),
  `filtrarProdutos` (cada critério de busca e filtro da spec, o termo
  "choco", trecho de código e as combinações) e `categoriasComItens`
- Hooks: `useProdutos` (sucesso e erro) e `useFiltroCatalogo`
- Integração: manter `App.test.tsx` como está e acrescentar o que
  faltar (copiar a chave Pix, só Pix e Ficha, mensagem de catálogo
  vazio, item oculto fora da lista, botão "Filtros" no celular)
- Cobrir cada critério de aceite da spec v2
