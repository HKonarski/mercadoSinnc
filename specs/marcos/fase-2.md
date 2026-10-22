# Marco: Fase 2 - Página no App.tsx com Tailwind

Entrega prevista: 23/10/2026 (cronograma do professor).

## Objetivo
Entregar a página do mercadinho, visual e estática, no `App.tsx` com
Tailwind CSS, seguindo o wireframe da Fase 1, sem perder a ligação com
as specs. Todo o código da Fase 2 é **provisório** e será refatorado
para o plano do catálogo (tarefas T10 a T14) depois da entrega.

## Requisitos cobertos
Da Feature 001 (Catálogo de produtos):
- R1, R2: lista de itens com nome, preço e quantidade
- R4: item com estoque zero aparece como "Indisponível" e não pode ser
  adicionado ao carrinho
- R5: aviso "Estoque baixo" (aviso ligado nos dados fixos)
- R6: formas de pagamento Pix e Ficha
- R8: código de barras em cada item
- R9: layout responsivo (mobile, tablet e desktop)

Do wireframe da Fase 1:
- Cabeçalho com logo SINNC e ícone "Usuario"
- Card de pagamento com "R$ Valor", "Copiar Chave Pix" e
  "Registrar na Ficha"
- Seção "Como comprar" com três itens: Histórico de Compra, Valor
  Pendente na Ficha e Registro de Comprovante

## Fora do marco (entram depois)
- R3 (busca)
- Estados de carregando, erro e catálogo vazio
- Serviços, hooks e testes das regras de negócio
- Carrinho real, leitura de código de barras, login, histórico
- "Registrar na Ficha" e "Adicionar ao carrinho" não fazem nada ainda
- "Copiar Chave Pix" copia a chave, sem outro efeito

## Critérios de aceite
- [ ] Cabeçalho com logo SINNC e ícone "Usuario"
- [ ] Card de pagamento com "R$ Valor", "Copiar Chave Pix" e
      "Registrar na Ficha"
- [ ] "Como comprar" com Histórico de Compra, Valor Pendente na Ficha
      e Registro de Comprovante
- [ ] Lista mostra nome, preço no formato "R$ 0,00", quantidade e
      código de barras
- [ ] Item com estoque 0 aparece "Indisponível" e o botão fica
      desabilitado
- [ ] Item com estoque igual ou abaixo do mínimo mostra "Estoque baixo"
- [ ] Só Pix e Ficha aparecem como formas de pagamento
- [ ] Sem rolagem horizontal em 360, 768 e 1280 px
- [ ] Usa somente Tailwind (sem CSS próprio) e não usa `any`
- [ ] `npm run build` e `npm run lint` sem erros

## Tarefas
- F2-01 Estrutura da página e cabeçalho
- F2-02 Card de pagamento (Pix e Ficha)
- F2-03 Seção "Como comprar"
- F2-04 Lista de produtos com selos de estoque
- F2-05 Responsividade e conferência do checklist
- F2-06 Commit, branch (`feature/fase-2-pagina`) e PR

## Refatoração depois da entrega
O `App.tsx` da Fase 2 já vem organizado em blocos que viram as tarefas
do catálogo:

| Bloco no App.tsx | Vira |
|---|---|
| Tipos | T02 (`src/types`) |
| Dados fixos | T06 (`src/data`) e T07 (serviços) |
| `formatarMoeda` | T03 |
| `estaIndisponivel` e `estaComEstoqueBaixo` | T05 |
| `Cabecalho` | T14 |
| `CardPagamento` | T13 |
| `ProdutoCard` | T11 |
| `ListaProdutos` | T12 |
| `ComoComprar` | componente próprio, fora das tarefas do catálogo (decidir na spec de histórico/pagamento) |
