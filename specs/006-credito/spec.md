# Feature 006: Crédito pré-pago

**Situação:** evolução posterior. Ordem de implementação confirmada:
concluir primeiro as Features 005, 007 e 008; implementar esta Feature
006 depois delas. As decisões de produto estão consolidadas; os detalhes
técnicos serão definidos no plano de implementação.

## Objetivo
Permitir que o usuário deixe um valor antecipado no mercadinho, pago via
Pix, e vá descontando esse valor a cada compra. Com isso a pessoa faz um
Pix só (por exemplo, o valor que pretende gastar no mês), em vez de um
por compra, e o mercadinho reduz o fiado.

## Conceitos
- **Saldo:** valor de crédito que a pessoa tem disponível
- **Recarga:** pedido de adicionar crédito, feito por Pix. Status:
  *Aguardando confirmação*, *Confirmada* ou *Recusada*
- **Movimentação:** qualquer registro que altera o saldo (recarga
  confirmada, compra, ajuste do administrador). O conjunto forma o
  **extrato**

## Usuários
- **Usuário (colaborador, com login):** recarrega, vê o saldo e paga
  compras com crédito
- **Administrador:** confirma ou recusa recargas e faz ajustes de saldo
- **Visitante (sem login):** não usa crédito

## Requisitos

### Recarga
- R1. O usuário informa qualquer valor maior que zero para a recarga;
  não há mínimo, máximo ou atalhos predefinidos na primeira versão
- R2. O sistema gera Pix dinâmico com o valor da recarga, exibindo
  Copia e Cola e QR Code correspondentes, conforme Feature 005
- R3. Depois de pagar, a pessoa registra a recarga enviando o
  comprovante. A recarga fica **Aguardando confirmação** e o saldo
  **não muda** até a confirmação
- R4. O administrador confere o comprovante e **confirma** ou
  **recusa** a recarga (a recusa exige um motivo, visível para a pessoa)
- R5. Ao confirmar, o administrador registra o valor realmente pago.
  Se for diferente do solicitado, registra também o motivo da
  divergência. O valor efetivo é usado para quitar compras pendentes na
  Ficha e, depois, o restante aumenta o saldo disponível
- R5.1. Ao confirmar uma recarga, o sistema usa o valor efetivo para quitar
  compras pendentes na Ficha, começando pela mais antiga e quitando
  compras inteiras apenas. Se o valor restante não cobrir a próxima
  compra pendente, a quitação automática para e o restante fica como
  saldo de crédito
- R6. A pessoa vê suas recargas pendentes ("Aguardando confirmação") com
  o valor, separadas do saldo disponível

### Saldo e uso
- R7. O saldo disponível aparece para o usuário logado no menu da conta
  e na tela de pagamento, em R$ com 2 casas decimais
- R8. O saldo nunca fica negativo
- R9. O usuário pode combinar o saldo de crédito com Pix ou Ficha para
  completar o total da compra. A parte paga com crédito nunca excede o
  saldo disponível; a parte restante segue as regras e permissões da
  forma de pagamento escolhida
- R10. Ao confirmar uma compra combinada, o valor de crédito usado é
  debitado na hora, sem aprovação do administrador. O registro da compra
  e o débito devem ser atômicos no back-end
- R11. O saldo não expira, e o que sobra de um mês passa para o seguinte

### Extrato e controle
- R12. Toda movimentação fica registrada com data, tipo (recarga,
  quitação da Ficha, compra, ajuste), valor, saldo depois da
  movimentação e descrição
- R13. Movimentações nunca são editadas nem apagadas. Uma correção é uma
  nova movimentação (ajuste), para manter a trilha de auditoria
- R14. O administrador pode fazer um **ajuste manual** de saldo, positivo
  ou negativo, sempre com um motivo, que a pessoa vê no extrato. A
  devolução do saldo de quem sai da empresa é um ajuste negativo com
  esse motivo
- R15. O usuário consulta o próprio extrato e saldo (a tela fica na
  Feature 007)

### Acesso
- R16. Conta com **bloqueio total** (Feature 004, R17) não recarrega nem
  usa crédito; o saldo continua guardado e visível ao administrador
  (Feature 004, R21)
- R17. Só o administrador confirma recargas e faz ajustes de saldo
- R18. A permissão "Usar crédito" é independente da permissão "Comprar na
  ficha". Se estiver desligada, o usuário pode consultar e recarregar o
  saldo, mas não pode usar crédito para pagar compras

### Geral
- R19. As telas se adaptam a mobile, tablet e desktop e funcionam por
  teclado, com rótulos para leitores de tela

## Critérios de aceite

### Recarga
- Dado um usuário logado, quando informar R$ 50,00 e confirmar, então
  aparece o Pix Copia e Cola e o QR Code com o valor de R$ 50,00.
- Dado um valor maior que zero, então a recarga pode ser solicitada sem
  mínimo ou máximo predefinidos.
- Dado que a pessoa enviou o comprovante, então a recarga aparece como
  "Aguardando confirmação" e o saldo disponível continua o mesmo.
- Dado o administrador, quando confirmar uma recarga de R$ 50,00 sem
  compras pendentes na Ficha, então o saldo da pessoa aumenta R$ 50,00 e
  a recarga passa a "Confirmada".
- Dado o comprovante de uma recarga com valor divergente, então o
  administrador registra o valor efetivamente pago e o motivo; somente
  esse valor é aplicado.
- Dado compras pendentes na Ficha e uma recarga confirmada, então o
  valor quita as compras mais antigas inteiras; o restante, se houver,
  entra no saldo de crédito.
- Dado que o valor restante não cobre integralmente a próxima compra
  pendente na Ficha, então essa compra permanece pendente e o restante
  fica no saldo de crédito.
- Dado o administrador, quando recusar uma recarga com um motivo, então
  o saldo não muda, a recarga passa a "Recusada" e a pessoa vê o motivo.

### Saldo e uso
- Dado um saldo de R$ 50,00 e uma compra de R$ 12,00 paga com crédito,
  então o saldo passa a R$ 38,00.
- Dado um saldo de R$ 12,00 e uma compra de R$ 12,00, quando pagar com
  crédito, então a compra é feita e o saldo passa a R$ 0,00.
- Dado um saldo de R$ 10,00 e uma compra de R$ 12,00, então o usuário
  pode pagar R$ 10,00 com crédito e escolher Pix ou Ficha para os R$ 2,00
  restantes, se tiver a permissão necessária.
- Dado um saldo zero, então "Crédito" aparece desabilitado.
- Dado o saldo exibido, então aparece no formato "R$ 38,00".
- Dado a permissão "Usar crédito" desligada, então o usuário pode
  consultar e recarregar, mas não pode pagar compras com o saldo.

### Extrato e controle
- Dado qualquer recarga confirmada, compra ou ajuste, então aparece no
  extrato com data, tipo, valor e saldo depois.
- Dado uma movimentação no extrato, então não existe ação de editar ou
  apagar.
- Dado um ajuste negativo do administrador sem motivo, então o ajuste
  não é feito e aparece o pedido de motivo.
- Dado um ajuste com motivo, então a pessoa vê o motivo no extrato.

### Acesso
- Dado uma conta com bloqueio total, quando tentar recarregar ou pagar
  com crédito, então o acesso é negado e o saldo não muda.
- Dado uma conta bloqueada com saldo, quando o administrador abrir a
  conta, então vê o saldo e consegue fazer o ajuste de devolução.
- Dado um Usuário comum, quando tentar confirmar uma recarga ou fazer
  ajuste, então o acesso é negado.

## Casos de borda
- **Dois comprovantes para a mesma recarga ou recarga duplicada:** o
  administrador confirma uma só; as outras são recusadas com motivo
- **Comprovante ilegível ou de outro valor:** recusar com motivo ou
  confirmar o valor realmente pago (R5)
- **Saldo igual ao total da compra:** permitido, o saldo fica R$ 0,00
- **Recarga pendente durante uma compra:** o valor pendente não conta
  como saldo disponível
- **Duas compras ao mesmo tempo (dois aparelhos):** o sistema nunca pode
  deixar o saldo negativo; essa garantia é do back-end (Fase 5)
- **Conta bloqueada com recarga pendente:** o administrador ainda pode
  confirmar ou recusar a recarga; o saldo fica guardado
- **Valores com centavos:** os cálculos não podem gerar diferença de
  arredondamento (ver observações para o plano)
- **Falha ao registrar a recarga ou a compra:** mensagem clara, com opção
  de tentar de novo e sem alterar o saldo

## Fora do escopo
- Confirmação automática do Pix (integração com banco ou provedor de
  pagamentos)
- Limite de gasto por mês, bônus ou *cashback*
- Transferência de saldo entre pessoas e saque em dinheiro
- Recarga automática recorrente
- Avisos por e-mail ou notificação
- Armazenamento real do comprovante (Fase 5)
- Tela do extrato do usuário (Feature 007) e telas do administrador
  (Feature 008): as regras ficam definidas aqui

## Dependências com outras features
- **001 Catálogo e Constitution:** a lista de formas de pagamento passa
  a ter três itens (Pix, Ficha e Crédito) quando o crédito for
  implementado
- **002 Carrinho:** fornece o valor total da compra
- **004 Identificação:** login obrigatório e regras de bloqueio (R17 e
  R21 da 004)
- **005 Pagamento:** oferece "Crédito" como forma de pagar e reutiliza o
  comprovante para a recarga
- **007 Histórico:** mostra saldo, recargas e extrato do usuário
- **008 Área do administrador:** confirmar ou recusar recargas, ajustar
  saldo e ver o saldo de cada pessoa

## Observações para o plano técnico
Não fazem parte da spec, mas o plano precisa tratar:
- Valores em **centavos inteiros**, e não em reais com decimais. Isso muda
  a decisão D2 do plano da Feature 001, que deve ser revista antes de
  implementar carrinho e crédito
- A recarga usa o Pix dinâmico da Feature 005 para exibir Copia e Cola e
  QR Code com o valor; isso não confirma automaticamente o pagamento
- O débito de saldo precisa ser atômico no back-end (Fase 5). No front o
  saldo é simulado e não oferece garantia real

## Decisões já tomadas
- Crédito é uma **terceira forma de pagamento**, além de Pix e Ficha
- A pessoa gera um Pix com um valor, o valor vira crédito e cada compra
  vai descontando do saldo
- Recargas são confirmadas manualmente pelo administrador
- Saldo insuficiente pode ser combinado com Pix ou Ficha, se as
  respectivas permissões permitirem
- O saldo não expira
- A recarga não tem mínimo ou máximo predefinido; o valor deve ser maior
  que zero
- Se o comprovante divergir do valor solicitado, o administrador
  registra e credita o valor efetivamente pago
- A permissão "Usar crédito" é independente; desligá-la impede usar o
  saldo em compras, mas permite consultar e recarregar
- Ao confirmar uma recarga, compras pendentes na Ficha são quitadas por
  ordem de antiguidade, somente inteiras; o restante não utilizado fica
  como saldo de crédito
