# Tarefas - Feature 001: Catálogo de produtos

Regra: uma tarefa por commit. Só avança quando o "Pronto quando" for
verdadeiro. Mensagem de commit sugerida: `T05: regras de estoque`.
Marque `[x]` ao concluir.

> A Fase 2 (`specs/marcos/fase-2.md`) entrega uma versão provisória da
> página antes destas tarefas. A refatoração dela segue as tarefas T10
> a T14.

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
- Ligar `strict` (já vem no template), acrescentar
  `noUncheckedIndexedAccess` e `noImplicitReturns` no `tsconfig.app.json`
  e a regra `@typescript-eslint/no-explicit-any: error` no ESLint
- Pronto quando: `npm run dev` abre a página, `npm test` roda sem erro,
  `npm run build` e `npm run lint` passam

### [ ] T02 - Estrutura de pastas e tipos
- Criar as pastas do plano:
  ```powershell
  New-Item -ItemType Directory -Force src\components\catalogo, src\components\ui, src\types, src\services, src\data, src\utils, src\hooks, src\test
  ```
- Criar em `src/types/index.ts`: `Produto`, `Configuracao`,
  `FormaPagamento`
- Pronto quando: o projeto compila sem erros de tipo

## Regras de negócio (funções puras, com testes)

### [ ] T03 - formatarMoeda
- 3.5 -> "R$ 3,50"; 0 -> "R$ 0,00"; 1234.5 -> "R$ 1.234,50"
- Pronto quando: os testes desses casos passam

### [ ] T04 - normalizarTexto
- Remove acentos, ignora maiúsculas e espaços nas pontas
- "Água " -> "agua"; "PÃO" -> "pao"
- Pronto quando: os testes passam (cobre R3)

### [ ] T05 - Regras de estoque
- `estaIndisponivel` e `estaComEstoqueBaixo` (decisão D3 do plano)
- Testar todos os cenários:
  - quantidade 0 -> indisponível, sem aviso de estoque baixo
  - aviso desligado + estoque abaixo do mínimo -> sem aviso
  - aviso ligado + quantidade igual ao mínimo -> "Estoque baixo"
  - aviso ligado + sem mínimo definido -> sem aviso
  - aviso ligado + quantidade acima do mínimo -> sem aviso
- Pronto quando: todos passam (cobre R4 e R5.1 a R5.4)

## Dados

### [ ] T06 - Dados mock
- Criar ~10 produtos em `data/produtos.mock.ts` cobrindo:
  - item com estoque 0
  - item com mínimo definido e estoque igual ou abaixo dele
  - item com mínimo definido e estoque folgado
  - item sem mínimo
  - nome com acento ("Água", "Pão de queijo")
  - nome muito longo
  - item inativo (não deve aparecer)
- Pronto quando: os dados compilam e respeitam o tipo `Produto`

### [ ] T07 - Camada de serviço
- `ProdutosService` (interface) com implementação mock, atraso simulado
  (~500 ms) e um modo para forçar erro
- `ConfiguracaoService` mock (aviso de estoque mínimo e chave Pix)
- Retornar só produtos ativos
- Pronto quando: um teste chama o serviço e recebe só os ativos

## Hooks

### [ ] T08 - useProdutos
- Estados: carregando, erro, sucesso; função `tentarNovamente`
- Pronto quando: o hook alterna entre os estados corretamente (testar
  sucesso e erro forçado)

### [ ] T09 - useBuscaProdutos
- Recebe a lista, devolve a lista filtrada e o termo
- Pronto quando: "agua" encontra "Água"; termo vazio devolve tudo;
  termo sem correspondência devolve lista vazia

## Componentes

### [ ] T10 - Componentes de estado
- Carregando, Erro (com botão "Tentar de novo"), EstadoVazio (mensagem
  recebida por parâmetro)
- Pronto quando: os três renderizam isolados com Tailwind

### [ ] T11 - ProdutoCard
- Mostra nome, preço formatado, quantidade e código de barras
- Selo "Indisponível" (botão de adicionar desabilitado) e selo "Estoque
  baixo" conforme T05
- Recebe `onAdicionar` por parâmetro (decisão D8); por enquanto não faz
  nada
- Nome longo não quebra o layout
- Pronto quando: renderiza os 4 casos (normal, indisponível, estoque
  baixo, nome longo)

### [ ] T12 - BuscaProdutos e ListaProdutos
- Campo de busca controlado e grade de cards
- Mensagem "Nenhum item encontrado" quando a busca não retorna nada
- Pronto quando: digitar filtra a lista e apagar restaura tudo

### [ ] T13 - FormasPagamento
- Lista tipada com Pix e Ficha (decisão D5): Pix com a chave e botão
  "Copiar chave Pix"; Ficha com a descrição de caderneta/fiado
- Pronto quando: aparecem só duas formas e copiar a chave funciona

## Montagem

### [ ] T14 - CatalogoPage e cabeçalho
- Cabeçalho com logo SINNC e ícone "Usuario" (sem ação ainda; o login
  vem na Feature 004)
- Montar a página: busca, lista, formas de pagamento
- Tratar carregando, erro, catálogo vazio ("Nenhum item cadastrado
  ainda") e sem resultado de busca
- Pronto quando: a página funciona de ponta a ponta com os mocks

### [ ] T15 - Responsividade
- Mobile-first, ajustando mobile, tablet e desktop (R9), alinhado aos
  wireframes da Fase 1
- Pronto quando: sem rolagem horizontal em 360 px, 768 px e 1280 px

### [ ] T16 - Acessibilidade e revisão final
- Labels nos campos, foco visível, navegação por teclado, contraste
- Percorrer os critérios de aceite da spec um a um (checklist abaixo)
- Pronto quando: todos os itens do checklist estão marcados

### [ ] T17 - Entrega
- Atualizar o README (como rodar, como testar e a tabela de
  funcionalidades)
- Abrir o PR da branch da feature
- Pronto quando: o PR está aberto com a descrição ligada à spec

## Checklist de aceite (T16)
- [ ] Todos os itens ativos aparecem com nome, preço e quantidade
- [ ] Busca "agua" encontra "Água"
- [ ] Busca sem resultado mostra "Nenhum item encontrado"
- [ ] Limpar a busca restaura a lista
- [ ] Estoque 0: "Indisponível" e botão desabilitado
- [ ] Preço 3.5 aparece como "R$ 3,50"
- [ ] Aviso desligado: nenhum "Estoque baixo"
- [ ] Aviso ligado com mínimo 5 e estoque 5: "Estoque baixo"
- [ ] Aviso ligado e sem mínimo: nenhum aviso
- [ ] Pagamento mostra apenas Pix e Ficha
- [ ] Erro de carregamento mostra mensagem e "Tentar de novo"
- [ ] Catálogo vazio mostra "Nenhum item cadastrado ainda"

## Rastreabilidade
| Requisito | Tarefas |
|---|---|
| R1, R2 | T11, T12 |
| R3 | T04, T09 |
| R4, R5 | T05, T11 |
| R6, R7 | T13 |
| R8 | T11 |
| R9 | T15 |
