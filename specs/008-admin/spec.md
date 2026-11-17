# Feature 008: Área do administrador

## Objetivo
Dar ao responsável pelo mercadinho um lugar único para manter o catálogo
e o estoque, conferir comprovantes e dar baixa nos valores pendentes, e
controlar quem acessa e o que cada pessoa pode fazer.

## Usuários
- **Administrador:** único perfil desta área. Na primeira versão existe
  um único administrador, criado nos dados simulados (Feature 004, R14)
- **Usuário e visitante:** não acessam

## Requisitos

### Acesso
- R1. A área administrativa só abre para o perfil Administrador. Outros
  perfis veem "Acesso negado" (Feature 004, R11 e R24)

### Itens
- R2. A lista de itens mostra **todos**, inclusive os ocultos, com busca
  e filtros por categoria e por situação (visíveis, ocultos e
  indisponíveis)
- R3. Cadastrar item com: nome (obrigatório, mínimo 3 caracteres),
  categoria (obrigatória), preço (maior que zero, 2 casas decimais),
  quantidade inicial (inteiro maior ou igual a zero), estoque mínimo
  (inteiro maior ou igual a zero; 0 = sem mínimo) e código de barras
  comercial ou código interno gerado pelo sistema
- R4. O código de barras é **único**: o sistema não aceita dois itens com
  o mesmo código (Feature 003)
- R5. Editar qualquer campo do item. Mudar o preço vale só para novas
  compras; as compras antigas mantêm o preço da época (Feature 005, R7)
- R6. **Ajustar o estoque** com entrada (reposição) e correção. Cada
  ajuste registra data, tipo, quantidade, estoque depois e motivo
  obrigatório
- R7. **Ocultar** e **reexibir** um item (Feature 001, R14). Reexibir
  exige informar a quantidade disponível. Ocultar não apaga nada
- R8. Itens **não são excluídos**; o caminho é ocultar, para preservar o
  histórico de compras
- R9. Para itens sem código de barras comercial, o administrador pode
  gerar um código interno único e imprimir/usar uma etiqueta para
  leitura (Feature 003)

### Categorias
- R10. Cadastrar, renomear e remover categorias, com nome único (Feature
  001, R10)
- R11. Uma categoria com itens não pode ser removida; os itens precisam
  ser movidos antes. A remoção e as movimentações relacionadas ficam
  registradas na auditoria

### Configurações
- R12. Ligar e desligar o **aviso de estoque mínimo** (Feature 001,
  R5.1)
- R13. Definir o **limite padrão de "Últimas unidades"** (inteiro maior ou
  igual a zero; 0 = não existe) (Feature 001, R12)
- R14. Definir a **chave Pix** exibida no pagamento (Feature 005, R10),
  obrigatória para o Pix funcionar

### Comprovantes e baixa
- R15. Lista dos comprovantes **Aguardando conferência** com: pessoa,
  data, valor, compras vinculadas e o arquivo para visualizar
- R16. **Confirmar** um comprovante passa as compras vinculadas a
  **Paga**. **Recusar** exige um motivo, devolve as compras a
  **Pendente** e o usuário vê o motivo (Feature 005, R17)
- R17. **Dar baixa manual** em compras Pendentes de qualquer pessoa (por
  exemplo, pagamento em dinheiro), com observação, registrando data e
  quem deu a baixa (Feature 004, R22)
- R18. **Cancelar** uma compra, com motivo: ela passa a **Cancelada** e
  não é apagada. O cancelamento não devolve estoque automaticamente;
  eventual devolução física deve ser conferida e registrada como ajuste
  separado de estoque
- R19. Ver o valor pendente por pessoa e o total geral de pendências, com
  a lista de compras por pessoa e por status

### Contas e acessos
- R20. Lista de contas com nome, e-mail, status (Ativa, Pendente,
  Bloqueada), permissões "Comprar na ficha" e "Usar crédito" (quando
  Feature 006 estiver implementada), valor pendente e compras na Ficha
  vencidas
- R21. **Aprovar** ou **recusar** cadastros Pendentes (Feature 004, R16).
  Um cadastro recusado fica "Bloqueada", o que impede um novo cadastro
  com o mesmo e-mail (decisão da Feature 004)
- R22. **Bloquear** e **desbloquear** contas, com motivo opcional (Feature
  004, R17 e R20). **Restringir** e liberar a permissão "Comprar na
  ficha" (Feature 004, R18) e, após a Feature 006, a permissão
  independente "Usar crédito"
- R23. O administrador não pode bloquear a si mesmo nem o único
  administrador (Feature 004, casos de borda)
- R24. O detalhe da conta mostra dados, status, permissões, compras e
  valor pendente. Bloquear ou restringir nunca apaga dados (Feature
  004, R21)

### Controle
- R25. Toda ação sensível do administrador fica registrada, sem poder ser
  editada: confirmar e recusar comprovante, baixa manual, cancelamento,
  ajuste de estoque, mudança de preço, bloqueio, restrição e alteração
  de configuração, criação/edição/remoção de categorias e movimentação
  de itens entre categorias. O registro guarda data, responsável e
  valores anteriores e novos, quando aplicável
- R26. A tela inicial da área mostra um resumo: comprovantes aguardando
  conferência, cadastros pendentes, itens indisponíveis ou com estoque
  baixo e valor pendente total

### Geral
- R27. As telas se adaptam a mobile, tablet e desktop e funcionam por
  teclado, com rótulos para leitores de tela
- R28. Estados tratados: carregando, erro (com "Tentar de novo") e vazio

## Critérios de aceite

### Acesso
- Dado um Usuário comum, quando tentar abrir a área administrativa,
  então aparece "Acesso negado".
- Dado o administrador logado, então a área abre e mostra o resumo.

### Itens
- Dado um cadastro com nome de 2 caracteres, então aparece o erro e o
  item não é criado.
- Dado um preço zero ou negativo, então aparece o erro.
- Dado um código de barras já usado por outro item, então aparece "Este
  código já está em uso" e o item não é criado.
- Dado um cadastro válido, então o item aparece no catálogo (se não
  estiver oculto) com a categoria, o preço e a quantidade informados.
- Dado um produto sem código de barras comercial, então o administrador
  pode gerar um código interno único e usar sua etiqueta no leitor.
- Dado a mudança de preço de um item, então novas compras usam o preço
  novo e compras antigas mostram o antigo.
- Dado um item oculto, então ele continua na lista do administrador e
  some do catálogo.
- Dado um item reexibido sem informar a quantidade, então o sistema pede
  a quantidade e não reexibe.
- Dado um item reexibido com quantidade 10, então ele volta ao catálogo
  com "Disponível: 10".
- Dado um item já comprado, então não existe ação de excluir.
- Dado um ajuste de estoque, então ele aparece no registro de
  movimentações com data, tipo, quantidade, estoque depois e motivo.
- Dado um ajuste de estoque sem motivo, então o sistema não permite
  salvá-lo.

### Categorias
- Dado o nome de uma categoria já existente, então aparece o erro de
  nome em uso.
- Dado uma categoria com itens, quando tentar remover, então o sistema
  impede e pede para mover todos os itens antes.
- Dado uma categoria removida após mover seus itens, então a remoção e
  as movimentações ficam no registro de auditoria.
- Dado uma categoria nova com um item visível, então ela aparece no
  filtro do catálogo.

### Configurações
- Dado o aviso de estoque mínimo desligado, então nenhum item exibe
  "Estoque baixo" no catálogo.
- Dado o limite de "Últimas unidades" alterado para 5, então o filtro do
  catálogo passa a usar 5 para itens sem mínimo.
- Dado a chave Pix alterada, então o pagamento mostra a chave nova.
- Dado a chave Pix vazia, então o sistema não permite salvar.

### Comprovantes e baixa
- Dado um comprovante Aguardando conferência, quando o administrador
  confirmar, então as compras vinculadas passam a "Paga".
- Dado um comprovante, quando o administrador recusar sem motivo, então
  o sistema pede o motivo e não recusa.
- Dado um comprovante recusado com motivo, então as compras voltam a
  "Pendente" e o usuário vê o motivo.
- Dado uma compra Pendente, quando o administrador der baixa manual com
  uma observação, então ela passa a "Paga" com data e responsável.
- Dado uma compra, quando o administrador cancelar com um motivo, então
  ela passa a "Cancelada", não entra nos valores e não altera o estoque
  automaticamente. Se os itens forem devolvidos fisicamente, o
  administrador registra um ajuste de estoque separado.
- Dado uma pessoa com compras pendentes, então o administrador vê o
  valor pendente dela e o total geral.

### Contas
- Dado um cadastro Pendente, quando aprovar, então a conta passa a
  Ativa.
- Dado um cadastro Pendente, quando recusar, então a conta fica
  Bloqueada e o mesmo e-mail não pode ser cadastrado novamente.
- Dado uma conta, quando bloquear, então a pessoa perde o acesso
  (Feature 004).
- Dado uma conta bloqueada com valor pendente, então o administrador
  ainda vê o valor e dá baixa.
- Dado o administrador, quando tentar bloquear a si mesmo, então o
  sistema impede.
- Dado a restrição "Comprar na ficha" desligada, então a pessoa vê "Ficha"
  indisponível no pagamento.
- Dado uma compra na Ficha vencida e não quitada, então a conta aparece
  com atraso e novas compras na Ficha são restringidas automaticamente.

### Controle
- Dado qualquer ação sensível, então ela aparece no registro imutável
  com data, responsável e valores anteriores e novos, quando aplicável.
- Dado um registro de ação, então não existe ação de editar ou apagar.

## Casos de borda
- **Estoque negativo:** o sistema não aceita ajuste ou compra que deixe
  o estoque abaixo de zero
- **Confirmar um comprovante já conferido:** o sistema impede e mostra o
  estado atual
- **Baixa em compra já paga ou cancelada:** impedir e avisar
- **Preço alterado com o item em carrinhos abertos:** os carrinhos usam o
  preço novo e avisam a pessoa (Feature 002)
- **Valor do comprovante diferente da soma das compras:** o administrador
  pode confirmar compras inteiras cobertas pelo valor comprovado; a
  diferença restante é tratada manualmente, sem crédito ou reembolso
  automático
- **Item ocultado com o item no carrinho de alguém:** o item passa a
  indisponível no carrinho (Feature 002)
- **Dois administradores editando o mesmo item:** garantia do back-end
  (Fase 5); na versão simulada vale a última alteração
- **Arquivo do comprovante indisponível:** mensagem clara e opção de
  recusar com motivo
- **Nome de item ou categoria muito longo:** não quebrar o layout

## Fora do escopo
- Promover outras contas a administrador e perfis intermediários (por
  exemplo, só conferir comprovantes) (Feature 004, R14)
- Relatórios, exportação e gráficos
- Importação de itens em lote e fotos dos produtos
- Notificações para o administrador
- Recargas, ajustes de saldo e extrato do crédito pré-pago: entram quando
  a Feature 006 for implementada
- Segurança real (autenticação e armazenamento): Fase 5

## Dependências com outras features
- **001 Catálogo:** itens, categorias, estoque mínimo, itens ocultos,
  limite de "Últimas unidades" e chave Pix
- **002 Carrinho:** reage a preço alterado e item oculto ou sem estoque
- **003 Código de barras:** código único e itens sem código comercial
- **004 Identificação:** perfis, status de conta, bloqueio e restrição
- **005 Pagamento:** compras, comprovantes e a chave Pix
- **007 Histórico:** exibe os status que esta área altera
- **006 Crédito pré-pago:** evolução que acrescentará recargas e ajustes
  de saldo a esta área

## Decisões já tomadas
- Categorias cadastradas pelo administrador
- O administrador pode ocultar um item em vez de deixá-lo indisponível
  e, ao reexibir, informa a quantidade
- O limite de "Últimas unidades" é configurável (0 = não existe)
- Itens sem mínimo usam mínimo 0 = "sem mínimo"
- O administrador confere comprovantes e dá baixa nos valores pendentes
- O administrador gerencia acessos: aprovar cadastros, bloquear
  (inclusive ex-funcionários) e restringir a ficha
- Quando a Feature 006 for implementada, o administrador também poderá
  gerenciar a permissão independente "Usar crédito"
- Um único administrador na primeira versão
- Categorias com produtos não podem ser removidas até que todos sejam
  movidos; a remoção e a movimentação ficam registradas na auditoria
- Todo ajuste de estoque exige motivo e mantém histórico completo de
  movimentações
- Toda ação administrativa sensível, inclusive ações de categoria,
  mantém registro imutável com data, responsável e alterações
- A página inicial administrativa mostra o resumo operacional definido
  em R26
- Produtos sem código de barras comercial recebem código interno único
  gerado pelo administrador, utilizável em etiqueta (Feature 003)
- O perfil Administrador não realiza compras como colaborador na
  primeira versão (Feature 004)
- Cancelar uma compra não altera o estoque; eventual retorno físico é
  registrado em ajuste separado
- Compras na Ficha vencem no dia 15 do mês seguinte ou no próximo dia
  útil quando a data cair em fim de semana ou feriado; novas compras na
  Ficha são restringidas automaticamente após o vencimento até a
  confirmação da quitação pelo administrador
