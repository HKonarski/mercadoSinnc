# Feature 005: Pagamento (Pix, ficha e comprovante)

Pontos marcados com **[a confirmar]** são propostas à espera de
aprovação.

## Objetivo
Permitir que o usuário conclua a compra do carrinho pagando por **Pix**
ou deixando na **ficha** (caderneta/fiado), registrar a compra, enviar o
comprovante do Pix e acompanhar o que ainda falta pagar, substituindo a
ficha de papel (data, itens, quantidade, assinatura e se pagou).

## Conceitos
- **Compra:** registro de um carrinho concluído, com itens, valores,
  forma de pagamento e status
- **Status da compra:**
  - **Pendente:** ainda não paga (compra na ficha, ou no Pix sem
    comprovante)
  - **Aguardando conferência:** o comprovante foi enviado e o
    administrador ainda não conferiu
  - **Paga:** o administrador confirmou o pagamento (a "baixa")
  - **Cancelada:** compra anulada pelo administrador (Feature 008)
- **Comprovante:** arquivo enviado pelo usuário como prova do Pix
- **Valor pendente:** soma das compras com status Pendente

## Usuários
- **Usuário (colaborador, com login):** conclui compras, envia
  comprovantes e paga pendências
- **Administrador:** confere comprovantes e dá baixa (telas na Feature
  008)
- **Visitante (sem login):** não paga

## Requisitos

### Concluir a compra
- R1. "Ir para o pagamento" (Feature 002, R14) abre a tela de pagamento
  com o resumo do carrinho: itens, quantidades, subtotais e o valor
  total em R$
- R2. Antes de concluir, o sistema confere de novo estoque e preço
  (Feature 002, R15). Se algo mudou, avisa e devolve a pessoa ao
  carrinho para ajustar
- R3. As formas de pagamento são **Pix** e **Ficha**, em uma lista
  extensível (o crédito, Feature 006, é uma evolução posterior)
- R4. "Ficha" só fica habilitada para contas com a permissão "Comprar na
  ficha" (Feature 004, R18). Sem ela, aparece indisponível com a
  mensagem da Feature 004, R25
- R5. A compra só é registrada quando a pessoa escolhe a forma e
  confirma em "Concluir compra"
- R6. A compra registra: usuário, data e hora, itens (nome, preço
  unitário no momento da compra, quantidade e subtotal), total, forma de
  pagamento e status. Cada compra tem um número de identificação
- R7. Os itens e preços ficam **copiados** na compra: mudar o preço ou
  ocultar o item depois não altera compras antigas
- R8. Ao concluir, o estoque baixa na hora pelas quantidades compradas e
  o carrinho é esvaziado **[a confirmar]**
- R9. Depois de concluir, aparece a confirmação com número, data, itens,
  total, forma de pagamento e o que fazer em seguida

### Pix
- R10. Ao escolher Pix, a tela mostra o valor total e a chave Pix
  (definida pelo administrador), com o botão "Copiar Chave Pix" e o
  retorno "Chave copiada!"
- R11. A compra no Pix nasce **Pendente**. A pessoa paga no aplicativo do
  banco e envia o comprovante, na hora ou depois (R14)

### Ficha
- R12. Ao escolher Ficha, a compra nasce **Pendente**, entra no valor
  pendente da pessoa (Feature 007) e não exige pagamento na hora. A
  confirmação diz "Compra registrada na sua ficha"

### Comprovante
- R13. A pessoa envia o comprovante escolhendo um arquivo de imagem (JPG
  ou PNG) ou PDF, com tamanho máximo **[a confirmar: 5 MB]**, e vê uma
  pré-visualização antes de enviar
- R14. O comprovante é vinculado a uma ou mais compras **Pendentes** da
  própria pessoa: a compra recém-feita ou as pendências escolhidas
- R15. Ao enviar, as compras vinculadas passam a **Aguardando
  conferência** e o comprovante fica ligado a elas e ao usuário
  (Feature 004, R13)
- R16. Depois de enviado, o usuário não apaga o comprovante. Se for
  recusado, ele envia um novo
- R17. O administrador confere (Feature 008): ao **confirmar**, as
  compras vinculadas passam a **Paga**; ao **recusar** (com motivo), voltam
  a **Pendente** e o usuário vê o motivo

### Pagar pendências
- R18. O usuário pode pagar compras pendentes escolhendo quais (ou
  todas). O sistema soma os valores, mostra a chave Pix com o total e
  permite enviar o comprovante ligado às compras escolhidas
- R19. Cada compra é paga **inteira**: não existe pagamento parcial de
  uma única compra **[a confirmar]**
- R20. O valor pago comprovado deve cobrir a soma das compras
  vinculadas; qualquer diferença é decidida pelo administrador na
  conferência (Feature 008)

### Acesso e geral
- R21. Pagar exige login (Feature 004, R12). Contas Pendentes de
  aprovação ou com bloqueio total não concluem compras nem enviam
  comprovante (Feature 004, R5 e R17)
- R22. As telas se adaptam a mobile, tablet e desktop e funcionam por
  teclado, com rótulos para leitores de tela

## Critérios de aceite

### Concluir a compra
- Dado um carrinho com 2 unidades de um item de R$ 3,50 e 1 de R$ 5,00,
  quando abrir o pagamento, então aparece o resumo com total "R$ 12,00".
- Dado um item que ficou sem estoque desde que entrou no carrinho,
  quando tentar concluir, então aparece o aviso e a pessoa volta ao
  carrinho.
- Dado uma forma de pagamento escolhida, quando clicar em "Concluir
  compra", então a compra é registrada com número, data, itens, total,
  forma e status.
- Dado que cliquei duas vezes seguidas em "Concluir compra", então só
  uma compra é criada.
- Dado uma compra concluída, então o estoque dos itens baixou pelas
  quantidades compradas e o carrinho ficou vazio. **[a confirmar]**
- Dado uma compra concluída e depois um aumento de preço do item, então
  a compra continua mostrando o preço antigo.

### Formas de pagamento
- Dado um usuário comum, quando abrir o pagamento, então aparecem só
  "Pix" e "Ficha".
- Dado uma conta sem a permissão "Comprar na ficha", então "Ficha"
  aparece indisponível com a mensagem explicando e o Pix continua
  disponível.

### Pix
- Dado "Pix" escolhido, então aparecem o valor total e a chave Pix com o
  botão "Copiar Chave Pix".
- Dado que cliquei em "Copiar Chave Pix", então a chave é copiada e
  aparece "Chave copiada!".
- Dado uma compra concluída no Pix, então o status é "Pendente".

### Ficha
- Dado "Ficha" escolhida e uma compra concluída, então o status é
  "Pendente", aparece "Compra registrada na sua ficha" e o valor entra
  no valor pendente.

### Comprovante
- Dado um arquivo JPG de até o limite, quando escolher, então aparece a
  pré-visualização e o botão de enviar.
- Dado um arquivo de tipo não aceito (por exemplo .exe) ou acima do
  limite, então aparece o erro e nada é enviado.
- Dado um comprovante enviado para a compra #12, então a compra passa
  para "Aguardando conferência".
- Dado um comprovante enviado, então o usuário não vê ação de apagá-lo.
- Dado o administrador que recusa o comprovante com um motivo, então a
  compra volta a "Pendente" e o usuário vê o motivo.
- Dado o administrador que confirma o comprovante, então a compra passa
  a "Paga".

### Pagar pendências
- Dado 3 compras pendentes de R$ 10,00, R$ 5,00 e R$ 7,00, quando
  escolher a primeira e a terceira, então o Pix mostra o total "R$
  17,00".
- Dado uma pendência selecionada, quando enviar o comprovante, então só
  as compras selecionadas passam a "Aguardando conferência".
- Dado uma compra de status "Paga" ou "Aguardando conferência", então
  ela não aparece na lista de compras para pagar.

### Acesso
- Dado um visitante sem login, quando tentar abrir o pagamento, então é
  levado ao login e depois volta à tela.
- Dado uma conta com bloqueio total, quando tentar concluir uma compra,
  então o acesso é negado.

## Casos de borda
- **Compra no Pix e comprovante nunca enviado:** a compra continua
  Pendente e aparece no valor pendente
- **Estoque insuficiente ou preço alterado na conferência final:** o
  carrinho é ajustado e a pessoa avisada antes de concluir (R2)
- **Falha ao concluir (rede ou erro):** mensagem clara, com opção de
  tentar de novo; o carrinho e o estoque não são alterados
- **Falha no envio do comprovante:** o arquivo escolhido é mantido para
  tentar de novo
- **Dois comprovantes para as mesmas compras:** só o primeiro vale; os
  demais são recusados pelo administrador
- **Conta bloqueada depois de enviar o comprovante:** o administrador
  ainda pode conferir e dar baixa (Feature 004, R22)
- **Chave Pix indisponível ou não configurada:** a opção Pix mostra o
  aviso "Chave Pix indisponível, fale com o responsável"
- **Compra sem itens:** não é possível concluir
- **Fechar a página no meio do pagamento:** nada é registrado até a
  confirmação (R5)

## Fora do escopo
- Confirmação automática do Pix (integração com banco ou provedor)
- Pagamento parcial de uma mesma compra (R19)
- Pagamento com cartão (futuro) e com crédito pré-pago (Feature 006)
- Cancelar ou corrigir compras (ação do administrador, Feature 008)
- Recibos em PDF, notificações e envio por e-mail
- Armazenamento real do comprovante (Fase 5): na versão simulada, o
  arquivo não é guardado de forma permanente
- Telas de histórico e valor pendente (Feature 007) e de conferência
  (Feature 008): as regras ficam definidas aqui

## Dependências com outras features
- **001 Catálogo:** formas de pagamento (R6 e R7) e chave Pix
  configurável
- **002 Carrinho:** fornece itens e total, e a conferência prévia
  (R14 e R15)
- **004 Identificação:** login, bloqueio e permissão "Comprar na ficha"
- **007 Histórico:** mostra compras, status e valor pendente
- **008 Área do administrador:** conferir comprovantes, dar baixa e
  cancelar compras
- **006 Crédito pré-pago:** evolução que adicionará uma terceira forma

## Observações para o plano técnico
Não fazem parte da spec, mas o plano precisa tratar:
- Valores em **centavos inteiros** (decisão D2 do plano do catálogo)
- A compra é uma **cópia** dos itens e preços do momento (R7), e não
  uma referência ao catálogo
- Criar a compra, baixar o estoque e esvaziar o carrinho precisam
  acontecer juntos (tudo ou nada); a garantia real é do back-end
  (Fase 5)
- Na versão simulada, o arquivo do comprovante pode ficar só em memória
- Um Pix "copia e cola" com o valor já preenchido poderia substituir a
  chave simples, sem integração bancária, mas não avisa quando o
  pagamento foi feito

## Decisões já tomadas
- Formas de pagamento da primeira versão: somente **Pix e Ficha**
- O comprovante do Pix serve para dar baixa (o administrador confere)
- "Ficha" depende da permissão "Comprar na ficha" (Feature 004)
- O crédito pré-pago é uma evolução posterior (Feature 006)

## Perguntas em aberto
- **Baixa de estoque:** o estoque baixa ao concluir a compra (R8), mesmo
  antes de o pagamento ser confirmado? É a resposta à pergunta da
  Feature 002
- **Arquivo do comprovante:** tipos aceitos (JPG, PNG, PDF) e tamanho
  máximo (R13)
- **Pagamento parcial:** só compras inteiras (R19), ou aceitar pagar
  parte do valor pendente?
- **Prazo da ficha:** existe fechamento mensal ou data para pagar? O que
  acontece com quem passa do prazo?
- **Limite da ficha:** existe um valor máximo de pendência por pessoa,
  com bloqueio automático? (a Feature 004, R19, deixou isso como
  evolução)
- **Pix com valor embutido:** manter só a chave (como no wireframe) ou
  gerar o "copia e cola" com o valor?
