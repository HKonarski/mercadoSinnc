# Tarefas - Feature 001: Catálogo de produtos (v2)

Alinhadas à spec v2 e ao plano v2.

Regra: uma tarefa por commit. Só avança quando o "Pronto quando" for
verdadeiro. Mensagem de commit sugerida: `T05: regras de estoque`.
Marque `[x]` ao concluir.

> A Fase 2 (`specs/marcos/fase-2.md`) entregou uma versão provisória da
> página, toda no `App.tsx`. As tarefas T02 a T16 refatoram essa página
> para a estrutura do plano. Durante toda a refatoração, os testes de
> `src/test/App.test.tsx` devem continuar passando.

## Mapa das tarefas da v1 para a v2
| v1 | v2 |
|---|---|
| T01 a T05 | T01 a T05 (T01 ganha Prettier; T02 e T05 ganham itens novos) |
| (novo) | T06 `filtrarProdutos` |
| T06, T07 | T07, T08 |
| T08, T09 | T09, T10 |
| T10, T11 | T11, T12 |
| T12 | T13 e T14 |
| T13 | T15 |
| T14 a T17 | T16 a T19 |

## Fundação

### [ ] T01 - Criar o projeto
- Criar o projeto Vite (React + TypeScript) **na raiz** do repositório:
  ```powershell
  npm create vite@latest . -- --template react-ts
  npm install
  ```
  Se avisar que a pasta não está vazia, escolher "Ignore files and
  continue". Conferir depois se o `.gitignore` ainda ignora
  `node_modules`
- Instalar Tailwind:
  ```powershell
  npm install tailwindcss @tailwindcss/vite
  ```
  e trocar o conteúdo de `src/index.css` por `@import "tailwindcss";`
- Instalar Vitest e Testing Library:
  ```powershell
  npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
  ```
- Instalar Prettier (decisão D13):
  ```powershell
  npm install -D prettier
  ```
  com um `.prettierrc` mínimo (sem ponto e vírgula, aspas simples) e o
  script `"format": "prettier --write src"`
- Ligar `strict` (já vem no template), acrescentar
  `noUncheckedIndexedAccess` e `noImplicitReturns` no `tsconfig.app.json`
  e a regra `@typescript-eslint/no-explicit-any: error` no ESLint
- Pronto quando: `npm run dev` abre a página, `npm test` roda sem erro,
  `npm run build`, `npm run lint` e `npm run format` passam

### [ ] T02 - Estrutura de pastas e tipos
- Criar as pastas do plano:
  ```powershell
  New-Item -ItemType Directory -Force src\components\catalogo, src\components\ui, src\types, src\services, src\data, src\utils, src\hooks, src\test
  ```
- Criar em `src/types/index.ts`: `CATEGORIAS` (as const), `Categoria`,
  `Produto` (com `categoria`), `Configuracao` (com
  `limiteUltimasUnidades`), `FormaPagamento`, `FiltrosCatalogo` e
  `Visualizacao` (separada dos filtros, decisão D11)
- Pronto quando: o projeto compila sem erros de tipo

## Regras de negócio (funções puras, com testes)

### [ ] T03 - formatarMoeda
- 3.5 -> "R$ 3,50"; 0 -> "R$ 0,00"; 1234.5 -> "R$ 1.234,50"
- Pronto quando: os testes desses casos passam

### [ ] T04 - normalizarBusca
- Remove acentos, ignora maiúsculas, colapsa espaços repetidos e apara
  as pontas
- "Água " -> "agua"; "PÃO" -> "pao"; "R$  2,50" -> "r$ 2,50"
- Já existe no `App.tsx` da Fase 2; extrair para `utils/normalizarBusca.ts`
- Pronto quando: os testes passam (cobre R3)

### [ ] T05 - Regras de estoque
- `estaIndisponivel`, `estaComEstoqueBaixo(produto, config)` e
  `estaNasUltimasUnidades(produto, config)` (decisão D3 do plano)
- Testar todos os cenários:
  - quantidade 0 -> indisponível, sem estoque baixo e fora de
    últimas unidades
  - aviso desligado + estoque abaixo do mínimo -> sem selo "Estoque
    baixo"
  - aviso ligado + quantidade igual ao mínimo -> "Estoque baixo"
  - aviso ligado + sem mínimo definido -> sem selo
  - aviso ligado + quantidade acima do mínimo -> sem selo
  - últimas unidades, aviso ligado, mínimo 6 e estoque 4 -> sim
  - últimas unidades, sem mínimo, estoque 1 -> sim (limite padrão 3)
  - últimas unidades, sem mínimo, estoque 18 -> não
  - últimas unidades, aviso desligado, mínimo 6 e estoque 5 -> não
    (vale o limite padrão) **[depende da confirmação do R12]**
- Pronto quando: todos passam (cobre R4, R5.1 a R5.4 e R12)

### [ ] T06 - filtrarProdutos
- `filtrarProdutos(produtos, busca, filtros, config)` como função pura
  (decisão D10), usando `normalizarBusca` e as regras de T05
- Busca em nome, categoria, código de barras e preço (formatos
  "R$ 2,50", "2,50" e "2.5", decisão D4)
- Filtros: categorias (vazio = todas), em estoque e últimas unidades,
  combinados entre si e com a busca
- Testar, no mínimo:
  - "agua" encontra "Água mineral 500 ml" e não "Pão de queijo"
  - "salgados" traz só a categoria Salgados
  - "R$ 2,50" traz só itens com esse preço
  - código completo traz só o item
  - termo sem resultado devolve lista vazia
  - uma categoria, várias categorias e nenhuma
  - "Em estoque" remove itens com quantidade 0
  - "Últimas unidades" nos cenários da T05
  - busca + categoria ao mesmo tempo
- Pronto quando: os testes passam (cobre R3 e R11)

## Dados

### [ ] T07 - Dados mock
- Criar ~10 produtos em `data/produtos.mock.ts` cobrindo:
  - as 4 categorias (Doces, Salgados, Bebidas, Chocolates)
  - item com estoque 0
  - item com mínimo definido e estoque igual ou abaixo dele
  - item com mínimo definido e estoque folgado
  - item sem mínimo, com estoque baixo (1 a 3) e com estoque alto
  - nome com acento ("Água", "Pão de queijo")
  - nome muito longo
  - item inativo (não deve aparecer)
- Pronto quando: os dados compilam e respeitam o tipo `Produto`

### [ ] T08 - Camada de serviço
- `ProdutosService` (interface) com implementação mock, atraso simulado
  (~500 ms) e um modo para forçar erro
- `ConfiguracaoService` mock (aviso de estoque mínimo, limite de
  últimas unidades e chave Pix)
- Retornar só produtos ativos
- Pronto quando: um teste chama o serviço e recebe só os ativos

## Hooks

### [ ] T09 - useProdutos
- Estados: carregando, erro, sucesso; função `tentarNovamente`
- Pronto quando: o hook alterna entre os estados corretamente (testar
  sucesso e erro forçado)

### [ ] T10 - useFiltroCatalogo
- Guarda busca e filtros e devolve a lista filtrada, usando
  `filtrarProdutos`; a visualização (grade ou lista) fica em estado
  próprio, fora dos filtros
- Pronto quando: mudar busca ou filtros atualiza a lista; mudar a
  visualização não altera quais itens aparecem

## Componentes

### [ ] T11 - Componentes de estado
- Carregando, Erro (com botão "Tentar de novo"), EstadoVazio (mensagem
  recebida por parâmetro)
- Pronto quando: os três renderizam isolados com Tailwind

### [ ] T12 - ProdutoCard
- Mostra categoria, nome, preço formatado, quantidade e código de
  barras
- Selo "Indisponível" (botão de adicionar desabilitado) e selo "Estoque
  baixo" conforme T05
- Recebe `onAdicionar` por parâmetro (decisão D8); por enquanto não faz
  nada
- Nome longo não quebra o layout
- Pronto quando: renderiza os 4 casos (normal, indisponível, estoque
  baixo, nome longo)

### [ ] T13 - BuscaProdutos e CaixaFiltros
- Campo de busca com rótulo para leitor de tela
- Caixa de filtros: categorias, "Em estoque", "Últimas unidades" e
  botões de visualização (grade e lista, com `aria-pressed`)
- Pronto quando: cada controle altera o estado esperado e tem rótulo
  acessível

### [ ] T14 - ListaProdutos
- Grade ou lista conforme a visualização escolhida
- Mensagens distintas: "Nenhum item cadastrado ainda" (catálogo
  vazio) e "Nenhum produto encontrado para esses filtros." (resultado
  filtrado vazio)
- Pronto quando: trocar para lista mantém os mesmos itens e as duas
  mensagens aparecem nos casos certos

### [ ] T15 - FormasPagamento
- Lista tipada com Pix e Ficha (decisão D5): Pix com a chave e botão
  "Copiar chave Pix"; Ficha com a descrição de caderneta/fiado
- Pronto quando: aparecem só duas formas e copiar a chave funciona

## Montagem

### [ ] T16 - CatalogoPage e cabeçalho
- Cabeçalho com logo SINNC e ícone "Usuário" (sem ação ainda; o login
  vem na Feature 004)
- Montar a página: busca, filtros, lista, formas de pagamento
- Tratar carregando, erro, catálogo vazio e sem resultado
- Pronto quando: a página funciona de ponta a ponta com os mocks e os
  testes de `App.test.tsx` continuam passando

### [ ] T17 - Responsividade
- Mobile-first, ajustando mobile, tablet e desktop (R9), alinhado aos
  wireframes da Fase 1
- Aplicar a decisão sobre os filtros no celular (botão "Filtros" que
  recolhe a caixa, se aprovado na spec)
- Pronto quando: sem rolagem horizontal em 360 px, 768 px e 1280 px

### [ ] T18 - Acessibilidade e revisão final
- Labels nos campos, foco visível, navegação por teclado, contraste
- Percorrer os critérios de aceite da spec v2 um a um (checklist abaixo)
- Pronto quando: todos os itens do checklist estão marcados

### [ ] T19 - Entrega
- Atualizar o README (como rodar, como testar e a tabela de
  funcionalidades)
- Abrir o PR da branch da feature
- Pronto quando: o PR está aberto com a descrição ligada à spec

## Checklist de aceite (T18)

### Listagem e busca
- [ ] Todos os itens ativos aparecem com categoria, nome, preço e
      quantidade
- [ ] Preço 3.5 aparece como "R$ 3,50"
- [ ] Busca "agua" encontra "Água" e não "Pão de queijo"
- [ ] Busca "salgados" traz só a categoria Salgados
- [ ] Busca "R$ 2,50" traz só os itens com esse preço
- [ ] Busca pelo código completo traz só o item
- [ ] Busca sem resultado mostra "Nenhum produto encontrado para esses
      filtros."
- [ ] Limpar a busca restaura a lista

### Filtros e visualização
- [ ] Filtro de categoria mostra só a categoria marcada e desmarcar
      restaura
- [ ] "Em estoque" esconde itens com estoque 0
- [ ] "Últimas unidades" nos cenários da spec (inclusive com aviso
      desligado)
- [ ] Busca e filtro juntos mostram só o que atende aos dois
- [ ] Visualização inicial é grade; "lista" muda o formato, fica
      marcada e mantém os mesmos itens

### Estoque e pagamento
- [ ] Estoque 0: "Indisponível" e botão desabilitado
- [ ] Aviso desligado: nenhum "Estoque baixo"
- [ ] Aviso ligado com mínimo 5 e estoque 5: "Estoque baixo"
- [ ] Aviso ligado e sem mínimo: nenhum selo de estoque baixo
- [ ] Pagamento mostra apenas Pix e Ficha

### Estados
- [ ] Erro de carregamento mostra mensagem e "Tentar de novo"
- [ ] Catálogo vazio mostra "Nenhum item cadastrado ainda"

## Rastreabilidade
| Requisito | Tarefas |
|---|---|
| R1 | T08, T14 |
| R2, R8 | T12 |
| R3 | T04, T06, T10, T13 |
| R4, R5 | T05, T12 |
| R6, R7 | T15 |
| R9 | T17 |
| R10 | T02, T07, T12 |
| R11 | T06, T10, T13 |
| R12 | T05, T06 |
| R13 | T10, T13, T14 |
