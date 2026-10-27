# Feature 007: Histórico e valor pendente

Pontos marcados com **[a confirmar]** são propostas à espera de
aprovação.

## Objetivo
Permitir que o usuário acompanhe tudo o que comprou, quanto ainda deve
na ficha e em que pé está cada comprovante, sem depender da ficha de
papel nem de perguntar ao responsável.

## Conceitos
Os conceitos de compra, status (Pendente, Aguardando conferência, Paga e
Cancelada), comprovante e valor pendente vêm da Feature 005.

## Usuários
- **Usuário (colaborador, com login):** consulta o próprio histórico
- **Administrador:** vê o histórico e o valor pendente de qualquer
  pessoa na área administrativa (Feature 008)
- **Visitante (sem login):** não acessa

## Requisitos

### Resumo
- R1. A tela mostra no topo o **valor pendente** do usuário: a soma das
  compras com status Pendente, em R$ com 2 casas decimais
- R2. Mostra também, à parte, o valor **em conferência** (compras
  Aguardando conferência), para a pessoa saber o que já pagou e ainda
  não foi confirmado **[a confirmar]**
- R3. Mostra o resumo do período escolhido (mês atual por padrão): total
  comprado, total pago e total pendente **[a confirmar]**
- R4. Compras canceladas não entram em nenhum dos valores

### Histórico
- R5. Lista as compras do usuário, da mais recente para a mais antiga,
  com número, data, total, forma de pagamento, status e um resumo dos
  itens
- R6. A lista pode ser filtrada por **status** (Todas, Pendentes, Em
  conferência, Pagas e Canceladas) e por **período** (mês)
- R7. Listas longas são mostradas aos poucos, com a ação "Ver mais"
- R8. O usuário só vê as próprias compras (Feature 004, R13)

### Detalhe da compra
- R9. Abrir uma compra mostra: itens (nome, preço unitário na época da
  compra, quantidade e subtotal), total, forma de pagamento e status
- R10. O detalhe mostra o andamento da compra, com data de cada mudança
  de status (por exemplo: registrada, comprovante enviado, paga)
- R11. Mostra o comprovante enviado (nome do arquivo e data) e, se foi
  recusado, o **motivo** da recusa
- R12. Os itens aparecem como na época da compra, mesmo que o preço
  tenha mudado ou o item esteja hoje oculto (Feature 005, R7)

### Ações
- R13. Em compras Pendentes há as ações "Enviar comprovante" e "Pagar
  pendências", que levam à Feature 005
- R14. Se o valor pendente for zero, aparece "Você não tem pendências"

### Geral
- R15. Estados tratados: carregando, erro (com "Tentar de novo") e
  vazio ("Você ainda não fez compras")
- R16. Datas no formato brasileiro e valores em R$
- R17. A tela exige login. Conta com bloqueio total não acessa (Feature
  004, R17)
- R18. As telas se adaptam a mobile, tablet e desktop e funcionam por
  teclado, com rótulos para leitores de tela

## Critérios de aceite

### Resumo
- Dado compras Pendentes de R$ 10,00 e R$ 5,00, então o valor pendente
  mostra "R$ 15,00".
- Dado uma compra Aguardando conferência de R$ 8,00, então ela aparece
  em "Em conferência" e **não** no valor pendente. **[a confirmar]**
- Dado uma compra Cancelada, então ela não entra em nenhum valor.
- Dado nenhuma compra pendente, então aparece "Você não tem pendências".
- Dado o mês atual, então o resumo mostra total comprado, pago e
  pendente do mês. **[a confirmar]**

### Histórico
- Dado várias compras, quando abrir o histórico, então a mais recente
  aparece primeiro.
- Dado o filtro "Pendentes" marcado, então aparecem só compras Pendentes.
- Dado o filtro de um mês, então aparecem só as compras daquele mês.
- Dado mais compras do que cabem na tela, então aparece "Ver mais" e,
  ao clicar, as seguintes aparecem.
- Dado dois usuários diferentes, então cada um vê só as próprias compras.
- Dado um usuário sem compras, então aparece "Você ainda não fez
  compras".

### Detalhe
- Dado uma compra aberta, então aparecem itens, preços da época, total,
  forma e status.
- Dado um item que hoje está oculto ou com preço diferente, então o
  detalhe da compra antiga mostra o nome e o preço da época.
- Dado um comprovante recusado, então o detalhe mostra o motivo e a ação
  "Enviar comprovante".
- Dado o andamento de uma compra, então aparecem as datas de cada
  mudança de status.

### Acesso
- Dado um visitante sem login, quando tentar abrir o histórico, então é
  levado ao login e depois volta à tela.
- Dado uma conta com bloqueio total, quando tentar abrir o histórico,
  então o acesso é negado.

## Casos de borda
- **Compra que mudou de status enquanto a tela estava aberta:** o status
  atualiza ao recarregar ou ao tentar de novo
- **Compra Pendente e Aguardando conferência ao mesmo tempo (comprovante
  recusado e reenviado):** vale o status mais recente
- **Muitas compras no mesmo dia:** manter a ordem pela data e hora
- **Falha ao carregar:** mensagem de erro com "Tentar de novo"
- **Fuso horário:** exibir a data no horário local de quem consulta
- **Período sem compras:** aparece "Nenhuma compra neste período"

## Fora do escopo
- Exportar o histórico (PDF ou planilha) e gráficos
- Contestar ou cancelar uma compra (ação do administrador, Feature 008)
- Notificações sobre mudança de status
- Extrato e saldo do crédito pré-pago: entram nesta tela quando a
  Feature 006 for implementada
- Ver o histórico de outra pessoa (administrador, Feature 008)

## Dependências com outras features
- **005 Pagamento:** cria as compras, os comprovantes e os status que
  esta tela mostra, e recebe as ações "Enviar comprovante" e "Pagar
  pendências"
- **004 Identificação:** login, vínculo dos registros ao usuário e
  bloqueio total
- **008 Área do administrador:** conferência, baixa e cancelamento
  mudam os status exibidos aqui
- **006 Crédito pré-pago:** evolução que acrescentará o extrato do
  crédito

## Decisões já tomadas
- A tela mostra o histórico de compras e o valor pendente da ficha
  (itens "Histórico de Compra" e "Valor Pendente na Ficha" do wireframe)
- O comprovante é enviado a partir da compra pendente (Feature 005)

## Perguntas em aberto
- **Em conferência:** mostrar à parte do valor pendente (R2) ou somar
  tudo em um único "valor pendente"?
- **Resumo do período:** o resumo mensal com total comprado, pago e
  pendente (R3) vale a pena, ou basta o valor pendente? Ele atende ao
  hábito de acompanhar quanto se gasta no mês
- **Período padrão:** mês atual, ou todas as compras?
- **Quanto tempo o histórico fica disponível:** sem limite, ou só os
  últimos meses?
