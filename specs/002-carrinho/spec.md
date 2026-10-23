# Feature 002: Carrinho

## Objetivo
Permitir que o usuário monte a lista do que vai retirar do mercadinho,
ajuste as quantidades e veja o valor total antes de pagar, substituindo
a conta feita de cabeça ou na ficha de papel.

## Usuários
- **Usuário (colaborador, com login):** monta e ajusta o carrinho
- **Visitante (sem login):** consulta o catálogo, mas para adicionar ao
  carrinho precisa entrar (ver R2)
- **Administrador:** não usa o carrinho nesta feature

## Requisitos

### Montar o carrinho
- R1. Cada item do catálogo tem a ação "Adicionar ao carrinho". Itens
  indisponíveis (estoque zero) não podem ser adicionados (Feature 001,
  R4)
- R2. O carrinho exige login (Feature 004, R12). Sem login, ao tentar
  adicionar um item, a pessoa é levada ao login e, depois de entrar,
  volta à tela em que estava com o item adicionado
- R3. Adicionar um item que já está no carrinho aumenta a quantidade
  dele em 1, sem duplicar a linha
- R4. A quantidade de cada item pode ser aumentada e diminuída no
  carrinho. O mínimo é 1; para zerar, a pessoa remove o item
- R5. A quantidade nunca pode passar da quantidade disponível em
  estoque. Ao atingir o limite, o botão de aumentar fica desabilitado e
  aparece a mensagem "Só há X unidade(s) disponível(is)"
- R6. O usuário pode remover um item e também esvaziar o carrinho
  inteiro. Esvaziar pede confirmação

### Valores
- R7. Cada linha mostra nome, preço unitário, quantidade e subtotal
  (preço × quantidade)
- R8. O carrinho mostra o **valor total** (soma dos subtotais), sempre
  em R$ com 2 casas decimais
- R9. O total é recalculado imediatamente a cada alteração
- R10. O preço usado é sempre o preço atual do item no catálogo

### Visibilidade e persistência
- R11. O cabeçalho mostra o carrinho com a quantidade total de unidades
  (ex.: 3 itens), visível de qualquer tela
- R12. O carrinho vazio mostra "Seu carrinho está vazio" e um atalho
  para voltar ao catálogo
- R13. O carrinho é mantido ao recarregar a página e pertence ao
  usuário logado (Feature 004, R13)

### Seguir para o pagamento
- R14. O carrinho tem a ação "Ir para o pagamento", que leva à Feature
  005. Ela fica desabilitada com o carrinho vazio ou com algum item
  indisponível
- R15. Antes de seguir para o pagamento, o sistema confere de novo o
  estoque e o preço de cada item. Se algo mudou, avisa o usuário e
  ajusta o carrinho (ver casos de borda)

### Geral
- R16. O layout se adapta a mobile, tablet e desktop
- R17. As ações do carrinho funcionam por teclado e têm rótulos para
  leitores de tela

## Critérios de aceite

### Adicionar
- Dado um usuário logado e um item disponível, quando clicar em
  "Adicionar ao carrinho", então o item entra no carrinho com
  quantidade 1 e o contador do cabeçalho aumenta.
- Dado um item já no carrinho, quando adicionar de novo, então a
  quantidade vai de 1 para 2 e não surge uma segunda linha.
- Dado um item com estoque 0, quando visualizar, então o botão de
  adicionar está desabilitado.
- Dado um visitante sem login, quando clicar em "Adicionar ao
  carrinho", então é levado ao login e, depois de entrar, o item
  aparece no carrinho.

### Quantidade
- Dado um item com 3 unidades em estoque, quando o carrinho já tiver 3,
  então o botão de aumentar fica desabilitado e aparece "Só há 3
  unidade(s) disponível(is)".
- Dado um item com quantidade 1 no carrinho, quando diminuir, então a
  quantidade continua 1 (a pessoa usa "Remover" para tirar o item).
- Dado um item no carrinho, quando clicar em "Remover", então a linha
  some e o total é recalculado.
- Dado um carrinho com itens, quando clicar em "Esvaziar carrinho",
  então aparece a confirmação e, ao confirmar, o carrinho fica vazio.

### Valores
- Dado 2 unidades de um item de R$ 3,50 e 1 unidade de um item de
  R$ 5,00, então os subtotais são "R$ 7,00" e "R$ 5,00" e o total é
  "R$ 12,00".
- Dado qualquer alteração de quantidade, então o total é atualizado na
  mesma hora.
- Dado preço 2.2 e quantidade 3, então o subtotal aparece como
  "R$ 6,60".

### Visibilidade e persistência
- Dado um carrinho com 3 unidades, então o cabeçalho mostra 3.
- Dado o carrinho vazio, então aparece "Seu carrinho está vazio" com o
  atalho para o catálogo.
- Dado um carrinho com itens, quando recarregar a página, então os
  itens continuam lá.
- Dado um usuário diferente que entra no mesmo navegador, então ele não
  vê o carrinho de outra pessoa.

### Seguir para o pagamento
- Dado o carrinho vazio, então "Ir para o pagamento" está desabilitado.
- Dado um item que ficou indisponível enquanto estava no carrinho,
  então aparece marcado como "Indisponível" e "Ir para o pagamento"
  fica desabilitado até a pessoa remover o item.

## Casos de borda
- **Estoque diminuiu com o item no carrinho:** se a quantidade no
  carrinho passou do estoque, ajustar para o máximo disponível e avisar
  ("A quantidade de X foi ajustada para N, conforme o estoque")
- **Preço mudou com o item no carrinho:** usar o preço novo e avisar
  ("O preço de X foi atualizado")
- **Item removido do catálogo (inativo):** tratar como indisponível
- **Dois cliques rápidos em "Adicionar":** respeitar o limite de
  estoque, nunca ultrapassá-lo
- **Carrinho com muitos itens:** a lista rola, mas o total e o botão
  "Ir para o pagamento" continuam visíveis
- **Nome muito longo:** não quebrar o layout
- **Falha ao conferir estoque ou preço:** mensagem de erro com opção de
  tentar de novo, sem perder o carrinho
- **Conta bloqueada ou sessão encerrada com carrinho cheio:** a pessoa
  perde o acesso ao carrinho; os itens não são apagados do
  armazenamento da conta (Feature 004, R17 e R21)

## Fora do escopo
- Pagamento, registro na ficha e comprovante (Feature 005)
- Leitura de código de barras (Feature 003, que apenas usa a ação de
  adicionar daqui)
- Baixa definitiva do estoque (acontece ao registrar a compra, na
  Feature 005)
- Reserva de estoque enquanto o item está no carrinho
- Cupons, descontos e promoções
- Mais de um carrinho por pessoa, lista de favoritos, "comprar de novo"
- Observações ou anotações por item

## Dependências com outras features
- **001 Catálogo:** fornece itens, preços, estoque e a regra de
  indisponível; o botão "Adicionar ao carrinho" já existe lá
- **003 Código de barras:** adiciona itens ao carrinho usando a mesma
  ação
- **004 Identificação:** o carrinho exige login e pertence ao usuário
  logado
- **005 Pagamento:** recebe o carrinho conferido e o valor total

## Decisões já tomadas
- O usuário monta o carrinho e vê o valor total antes de pagar
- O carrinho exige login (Feature 004)

## Perguntas em aberto
- O estoque é baixado automaticamente quando a compra é registrada, ou o
  administrador só confere e ajusta depois? (impacta a Feature 005)
- Ao fazer logout, o carrinho deve ser mantido para o próximo login da
  mesma pessoa ou descartado? Sugestão: mantido (R13)
- Existe um limite de itens ou de valor por compra? Sugestão: sem limite
  na primeira versão
