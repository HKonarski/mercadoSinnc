# Feature 004: Identificação do usuário (cadastro, login e gestão de acessos)

## Objetivo
Permitir que o colaborador se cadastre e entre na plataforma, para que
compras, ficha, histórico e comprovantes fiquem ligados a ele, e
permitir que o administrador controle quem acessa o mercadinho e o que
cada pessoa pode fazer.

## Usuários
- **Colaborador:** faz cadastro, login e logout
- **Convidado (e-mail de fora da SINNC):** faz cadastro e aguarda
  aprovação
- **Administrador:** faz login, aprova cadastros e gerencia acessos

## Requisitos

### Cadastro
- R1. Cadastro com: nome completo, e-mail, senha e confirmação de senha
- R2. O identificador de acesso é o e-mail, único por pessoa. E-mails
  são tratados sem diferenciar maiúsculas/minúsculas e ignorando
  espaços no começo e no fim
- R3. Senha com no mínimo 8 caracteres
- R4. E-mail do domínio `@sinnc.com.br`: a conta fica **Pendente** até
  a pessoa confirmar a posse do endereço pelo link enviado por e-mail;
  após a confirmação, passa a **Ativa** e pode acessar a plataforma
- R5. E-mail de outro domínio: a conta é criada como **Pendente** e
  aguarda aprovação administrativa. Após aprovada, passa a **Ativa**;
  não exige link de confirmação de e-mail nesta versão

### Login e sessão
- R6. Login com e-mail e senha
- R7. Quando os dados não conferem, mensagem genérica ("E-mail ou
  senha inválidos"), sem dizer qual dos dois errou
- R8. Logout disponível a qualquer momento
- R9. A sessão é mantida ao recarregar a página, até o logout
- R10. O ícone "Usuario" do cabeçalho abre o login (sem sessão) ou o
  menu da conta (com sessão)

### Perfis e áreas protegidas
- R11. Perfis: **Usuário** e **Administrador**. Páginas e ações do
  administrador ficam bloqueadas para o Usuário
- R12. O catálogo continua acessível sem login. Carrinho, pagamento,
  ficha, histórico e comprovante exigem login
- R13. Todo registro da ficha e todo comprovante ficam vinculados ao
  usuário logado
- R14. Na primeira versão existe um único administrador, criado nos
  dados mock. Promover outras contas a administrador fica fora do
  escopo e entra numa versão futura

### Status da conta e gestão de acessos
- R15. Status possíveis: **Ativa**, **Pendente** e **Bloqueada**
- R16. O administrador vê a lista de cadastros pendentes e pode aprovar
  ou recusar cada um
- R17. **Bloqueio total:** a conta fica "Bloqueada" e a pessoa não
  acessa nada que exija login (carrinho, pagamento, ficha, histórico,
  comprovante). Vale para qualquer conta, inclusive de e-mail da
  SINNC. Uso típico: ex-funcionários
- R18. **Restrição parcial:** a conta continua "Ativa", mas o
  administrador desliga uma permissão específica. Na primeira versão
  existe uma: "Comprar na ficha (fiado)". Com ela desligada, a pessoa
  vê o catálogo, monta o carrinho e paga via Pix, mas a opção "Ficha"
  aparece indisponível. A permissão vem ligada por padrão em toda
  conta nova ativa, exceto enquanto houver restrição automática por
  atraso na ficha. Quando a Feature 006 for implementada, haverá também
  uma permissão independente "Usar crédito"; desligá-la impede usar o
  saldo em compras, mas não impede consultar ou recarregar
- R19. A restrição de comprar na ficha pode ser aplicada manualmente
  pelo administrador ou automaticamente quando houver compra na ficha
  vencida e não quitada. O bloqueio automático afeta somente novas
  compras na ficha: login, catálogo, Pix e histórico continuam
  disponíveis. Após a quitação e confirmação pelo administrador, a
  restrição automática é removida; uma restrição manual já existente
  permanece
- R20. Ao bloquear ou restringir, o administrador pode registrar um
  motivo (opcional), visível só para administradores
- R21. Bloquear ou restringir nunca apaga dados: histórico, ficha e
  valor pendente continuam existindo e visíveis ao administrador
- R22. O administrador continua podendo dar baixa em valores pendentes
  de uma conta bloqueada (ex.: ex-funcionário que quita a dívida
  depois)
- R23. O administrador vê a lista de contas com nome, e-mail e status,
  e pode bloquear, desbloquear e alterar a restrição de ficha
- R24. Aprovar cadastros e gerenciar acessos são ações exclusivas do
  Administrador

### Mensagens ao usuário
- R25. Mensagens exibidas:
  - Pendente aguardando confirmação de e-mail: "Confirme seu e-mail
    para ativar seu cadastro"
  - Pendente aguardando aprovação: "Seu cadastro aguarda aprovação"
  - Bloqueada: "Seu acesso está bloqueado, fale com o responsável"
  - Sem permissão de ficha: "A compra na ficha não está liberada para
    você. Pague via Pix ou fale com o responsável"

## Critérios de aceite

### Cadastro
- Dado um cadastro com e-mail `@sinnc.com.br`, quando enviar, então a
  conta fica Pendente e recebe um link de confirmação; após abrir o link,
  a conta fica Ativa e o usuário pode entrar.
- Dado um cadastro com e-mail de outro domínio, quando enviar, então a
  conta fica Pendente e aparece "Cadastro enviado, aguarde a aprovação
  do responsável".
- Dado um cadastro `@sinnc.com.br` ainda não confirmado, então a pessoa
  não consegue entrar nem acessar funcionalidades protegidas.
- Dado um e-mail já cadastrado, quando tentar cadastrar, então aparece
  "Este e-mail já está em uso".
- Dado senha com menos de 8 caracteres, então aparece o erro e o
  cadastro não é feito.
- Dado senha e confirmação diferentes, então aparece o erro.
- Dado o e-mail "Ana@Dominio.com " com espaço e maiúsculas, então é
  tratado como "ana@dominio.com".

### Login e sessão
- Dado login correto de conta Ativa, então o usuário vê o próprio nome
  no cabeçalho.
- Dado login incorreto, então aparece a mensagem genérica (R7).
- Dado uma conta Pendente, quando tentar logar, então aparece "Seu
  cadastro aguarda aprovação" e a pessoa não entra.
- Dado o recarregamento da página com sessão ativa, então o usuário
  continua logado.
- Dado o logout, então a sessão é encerrada e as telas protegidas
  deixam de ser acessíveis.

### Áreas protegidas
- Dado um usuário sem login, quando tentar acessar o carrinho ou o
  histórico, então é levado ao login e, depois de entrar, volta à tela
  pedida.
- Dado um usuário sem login, quando abrir o catálogo, então consegue
  ver tudo normalmente.
- Dado um Usuário comum, quando tentar abrir a área administrativa ou
  a gestão de acessos, então o acesso é negado.

### Aprovação
- Dado o administrador na lista de pendentes, quando aprovar, então a
  conta passa a Ativa e a pessoa consegue entrar.

### Bloqueio total
- Dado o administrador, quando bloquear uma conta (inclusive com
  e-mail da SINNC), então a pessoa não consegue logar e vê a mensagem
  de bloqueio.
- Dado uma pessoa já logada, quando o administrador bloquear a conta,
  então na próxima ação protegida ela é desconectada.
- Dado uma conta bloqueada com valor pendente, quando o administrador
  abrir a conta, então vê o valor e consegue dar baixa.
- Dado uma conta bloqueada, quando a pessoa tentar se cadastrar de
  novo com o mesmo e-mail, então vê "Este e-mail já está em uso" e não
  cria outra conta.
- Dado o administrador, quando desbloquear a conta, então o acesso
  volta ao normal.

### Restrição parcial
- Dado uma conta com "Comprar na ficha" desligada, quando abrir o
  pagamento, então "Pix" está disponível e "Ficha" aparece indisponível
  com a mensagem explicando.
- Dado uma conta com a restrição de ficha, quando consultar o catálogo
  e montar o carrinho, então tudo funciona normalmente.
- Dado o administrador, quando religar a permissão de ficha, então a
  opção "Ficha" volta a ficar disponível.
- Dado uma conta com "Usar crédito" desligado (Feature 006), então a
  pessoa pode consultar e recarregar o saldo, mas não pode usá-lo no
  pagamento.
- Dado uma compra na ficha vencida e não quitada, então novas compras
  na ficha ficam indisponíveis, mas a conta continua Ativa e pode usar
  o catálogo, Pix e histórico.
- Dado que o administrador confirma a quitação de todas as compras
  vencidas, então a restrição automática da ficha é removida; qualquer
  restrição manual pré-existente permanece.

## Casos de borda
- Falha no cadastro ou no login: mensagem clara e opção de tentar de
  novo
- Dois cadastros iguais enviados em sequência rápida: criar só um
- Administrador tentando bloquear a si mesmo: impedir
- Bloquear o único administrador: impedir
- Restringir a ficha de quem já tem itens na ficha: histórico e valor
  pendente continuam visíveis; só novas compras na ficha ficam
  bloqueadas
- A restrição automática por atraso não altera o status da conta e não
  remove restrições manuais de ficha existentes
- Carrinho aberto quando a restrição de ficha é aplicada: ao finalizar,
  a opção "Ficha" já aparece indisponível
- Bloqueio total vale para qualquer status anterior da conta (Ativa ou
  Pendente)

## Fora do escopo (nesta versão)
- Segurança real (senha criptografada, token, sessão no servidor):
  chega com o back-end, Fase 5
- Confirmação de posse do e-mail para domínios diferentes de
  `@sinnc.com.br`; esses cadastros dependem de aprovação manual
- Recuperação e troca de senha
- Login por Google ou outros provedores
- Promover outras contas a administrador (R14)
- Tela de gestão de contas: as regras ficam definidas aqui, e a tela
  entra na área do administrador (Feature 008)
- Armazenamento real do comprovante (Fase 5)

## Dependências com outras features
- **005 Pagamento:** a opção "Ficha" só fica habilitada se a conta tiver
  a permissão "Comprar na ficha" (R18)
- **007 Histórico e valor pendente:** sempre consulta os dados do
  usuário logado (R13)
- **008 Área do administrador:** abriga a tela de gestão de contas e a
  baixa de valores pendentes (R22, R23)

## Observações

### Primeira versão (mock)
No front, o serviço de autenticação é simulado: guarda as contas só no
navegador e serve apenas para demonstrar o fluxo. Não deve receber
senhas reais. Bloquear só vale no navegador de quem está testando; a
garantia real (derrubar a sessão em outros dispositivos) é do back-end.

### Para a Fase 5
A conta `@sinnc.com.br` só pode ser ativada após confirmação real do
endereço por link enviado por e-mail. A versão mock pode simular o fluxo,
mas não deve ser usada com senhas reais. Contas de outros domínios
continuam pendentes até aprovação manual.

## Decisões já tomadas
- Identificador de acesso: e-mail
- E-mail `@sinnc.com.br` fica Pendente até confirmação por link e então
  entra como Ativo; e-mail de outro domínio fica Pendente até aprovação
  manual, sem confirmação por link nesta versão
- O administrador gerencia os acessos e pode restringir mesmo
  colaboradores da SINNC
- Duas formas de restrição: bloqueio total e restrição parcial (ficha)
- Quando a Feature 006 for implementada, "Usar crédito" será uma
  permissão separada, que bloqueia somente o uso do saldo em compras
- Primeira versão com um administrador fixo nos dados mock
- Cadastro recusado fica **Bloqueado**; o mesmo e-mail não pode ser
  cadastrado novamente
- Os perfis Usuário e Administrador são exclusivos na primeira versão;
  o Administrador não realiza compras como colaborador
