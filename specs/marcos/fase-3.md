# Marco: Fase 3 - Componentes, dados e estado

Entrega prevista: 06/11/2026 (cronograma do professor).

Branch: `feature/fase-3-componentes`.

Situação: **aceite concluído; PR de entrega pendente**.

## Objetivo
Refatorar a página provisória da Fase 2 (toda no `App.tsx`) para uma
estrutura de **componentes**, com **dados** vindos de uma camada de
serviço e **estado** gerenciado por hooks, mantendo o comportamento já
entregue. É a execução das tarefas T01 a T19 do catálogo
(`specs/001-catalogo/tasks.md`).

## O que o professor pede e onde está
| Pedido da fase | Como é atendido | Tarefas |
|---|---|---|
| Separação em componentes | `App.tsx` só monta a página; cada parte tem seu componente em `src/components` | T11 a T16 |
| Uso de dados | Dados em `src/data`, acessados apenas pelos serviços (nunca direto pelos componentes) | T07, T08 |
| Estado | Busca, filtros, visualização e estados de carregando e erro em hooks | T09, T10 |
| Base para tudo isso | Tipos e regras em funções puras, com testes | T01 a T06 |

## Requisitos cobertos
Da Feature 001 (Catálogo de produtos), versão 3:
- R1 a R9: lista, busca ampliada, estoque, formas de pagamento
  (Pix e Ficha), código de barras e layout responsivo
- R10 a R13: categorias (como dado), filtros, "Últimas unidades" e
  visualização em grade ou lista
- R14: itens ocultos (`ativo: false` nos dados)
- R15: filtros recolhíveis no celular, conforme o wireframe
  (**desejável**, ver prioridades)

## Prioridades
| Prioridade | Tarefas | Observação |
|---|---|---|
| Essencial | T01 a T16, T18 e T19 | Sem elas a fase não atende ao PDF |
| Desejável | R15 dentro da T17 | O restante da T17 (manter o layout responsivo) é essencial |

## Fora do marco (entram depois)
- Leitura de dados de **JSON externo** (Fase 4, tarefa T20)
- Carrinho funcional, login, pagamento com registro de compra,
  histórico, leitor de código de barras e área do administrador
  (Features 002 a 008)
- "Adicionar ao carrinho" e "Registrar na Ficha" continuam sem ação
- Crédito pré-pago (Feature 006)

## Critérios de aceite
- [x] `App.tsx` só monta a página: sem dados, sem regras e sem
      componentes definidos dentro dele
- [x] Cada componente fica em arquivo próprio em `src/components`
- [x] Nenhum componente importa dados direto; todos passam pelos
      serviços (`src/services`)
- [x] Estado de busca, filtros e visualização em hooks, com a
      visualização separada dos filtros
- [x] Estados de carregando e erro (com "Tentar de novo") funcionando
- [x] Regras em `src/utils` com testes unitários: `formatarMoeda`,
      `normalizarBusca`, `estoque` e `filtrarProdutos`
- [x] Preço em centavos inteiros em todo o código
- [x] Comportamento da Fase 2 preservado: `App.test.tsx` passa
      (já assíncrono, com o carregamento)
- [x] Checklist de aceite do catálogo (T18) percorrido
- [x] `npm test`, `npm run build`, `npm run lint` e `npm run format`
      sem erros
- [x] README atualizado
- [ ] PR aberto

### Evidências do aceite T18

- 28 testes automatizados passaram; build e lint passaram.
- A conferência em navegador nas larguras 360, 768 e 1280 px não
  encontrou rolagem horizontal; os filtros recolhem no celular e ficam
  visíveis no desktop.
- Busca, filtros, estoque, visualizações, estados vazio/erro e formas de
  pagamento foram conferidos.
- Navegação por teclado e rótulos acessíveis foram verificados; o texto
  secundário do rodapé tem contraste 6,15:1.

## Mapa da refatoração
| Bloco no `App.tsx` da Fase 2 | Vira |
|---|---|
| Tipos | T02 (`src/types`) |
| Dados fixos | T07 (`src/data`) e T08 (serviços) |
| `formatarMoeda` | T03 |
| `normalizarBusca` | T04 |
| `estaIndisponivel`, `estaComEstoqueBaixo`, `estaNasUltimasUnidades` | T05 |
| Filtro dentro de `ListaProdutos` | T06 (`filtrarProdutos`) e T10 (hook) |
| Estado de carregando e erro | T09 (`useProdutos`) e T11 |
| `ProdutoCard` | T12 |
| `CaixaFiltros` e campo de busca | T13 |
| `ListaProdutos` | T14 |
| `CardPagamento` | T15 (`FormasPagamento`) |
| `Cabecalho` e a página | T16 |
| `ComoComprar` | componente próprio; decidir o lugar na spec de histórico |

## Cronograma sugerido
A fase vence em 06/11. Esta é uma divisão possível; ajuste ao seu
ritmo.

| Período | Tarefas |
|---|---|
| 27 a 28/10 | T01 (Prettier), T02, T03 e T04 |
| 29 a 30/10 | T05 e T06 |
| 31/10 a 02/11 | T07, T08, T09 e T10 |
| 03 a 04/11 | T11, T12, T13 e T14 |
| 05/11 | T15, T16 e T17 |
| 06/11 | T18 e T19 (conferência e entrega) |

## Riscos e pontos a confirmar
- **"Estado" e o carrinho:** o PDF diz "uso de dados e estado". Busca,
  filtros e visualização já são estado, mas o professor pode esperar um
  carrinho que some valores. **Confirmar com o professor.** Se sim, entra
  uma versão provisória da Feature 002, sem login, como extensão deste
  marco.
- **Testes de integração:** `App.test.tsx` usa consultas assíncronas e
  `fetch` simulado para aguardar o catálogo.
- **Wireframes:** os três tamanhos foram conferidos e o comportamento
  dos filtros no mobile, tablet e desktop foi registrado em
  `marcos/fase-1.md`.
- **Prazo curto:** se faltar tempo, cortar nesta ordem: R15, depois
  a T18 detalhada (acessibilidade). Os testes unitários (T03 a T06) e
  a separação em componentes não são cortáveis.
