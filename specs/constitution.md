# Constitution - Mercadinho SINNC

Regras fixas que valem para o projeto inteiro. Se uma spec, um plano ou
uma tarefa entrar em conflito com este documento, este documento vence.

## Contexto
Plataforma web para o mercadinho interno da SINNC. Substitui a ficha de
papel (conferir preço na tabela, anotar data, quantidade, item,
assinatura e se pagou) por um fluxo digital: consultar preços, montar o
carrinho, pagar via Pix ou deixar na ficha (caderneta/fiado) e
acompanhar histórico e valor pendente.

Projeto acadêmico: Trabalho de Conclusão da Disciplina de
Desenvolvimento em Ambiente Web.

## Perfis
- **Usuário (colaborador):** consulta preços, formas de pagamento e
  estoque; escaneia código de barras; monta o carrinho; paga via Pix ou
  registra na ficha; consulta histórico e valor pendente
- **Administrador:** cadastra e edita itens, preços e estoque; confere
  registros e comprovantes; dá baixa em valores pendentes; gerencia
  acessos (aprovar, bloquear, restringir)

## Stack
- React + TypeScript (`strict` ligado) + Tailwind CSS
- Vite como ferramenta de build
- Vitest + Testing Library para testes
- Fases 1 a 4: front-end. Fase 5 (back-end em Java) e Fase 6 (banco SQL)
  entram depois
- Enquanto não houver back-end, os dados vêm de uma **camada de serviço
  com dados simulados (mock)**, isolada atrás de uma interface, para ser
  trocada pela API real sem mexer nos componentes
- Autenticação e dados reais só na Fase 5. No front, login, sessão e
  contas são simulados e não devem receber senhas reais

## Metodologia (SDD)
- A especificação é a fonte da verdade; o código nasce dela
- Fluxo de cada funcionalidade: **spec -> plano técnico -> tarefas ->
  implementação -> conferência contra os critérios de aceite**
- A spec descreve o quê e o porquê, **sem tecnologia**. O como fica no
  plano
- Mudou o comportamento? Atualiza a spec **antes** do código
- Nada é implementado se não estiver em uma spec
- Uma spec por funcionalidade, pequena e com critérios de aceite
  verificáveis (formato "Dado... quando... então...")
- Perguntas em aberto ficam registradas na própria spec, nunca
  resolvidas por suposição silenciosa no código
- Entregas da faculdade que exijam um recorte provisório viram um
  **marco** em `specs/marcos/`, ligado aos requisitos das specs. O
  código provisório é refatorado para o plano depois da entrega

## Estrutura das specs
```
specs/
├── constitution.md
├── marcos/                  # recortes de entrega por fase
├── 001-catalogo/            # spec.md, plan.md, tasks.md
├── 002-carrinho/
├── 003-codigo-barras/
├── 004-identificacao/
├── 005-pagamento/           # Pix, ficha e comprovante
├── 006-historico-ficha/
└── 007-admin/               # itens, estoque, comprovantes, baixa, contas
```
Cada pasta de funcionalidade tem `spec.md`, `plan.md` e `tasks.md`.
Requisitos são numerados (R1, R2...) e as tarefas indicam quais
requisitos atendem.

## Princípios de código
- Componentes pequenos, com uma única responsabilidade
- Proibido `any`; tipos explícitos para Produto, Configuração,
  Forma de pagamento, Item do carrinho, Registro da ficha, Conta e
  Usuário
- Lógica de negócio (totais, pendência, estoque, permissões) em
  **funções puras** fora dos componentes visuais, com testes
- Componentes nunca leem dados mock diretamente: sempre pedem ao
  serviço correspondente
- Formas de pagamento e status de conta como tipos fechados e
  extensíveis (nada de condições espalhadas pelo código)
- Nomes de componentes e arquivos de componente em PascalCase; funções
  e variáveis em camelCase; nomes de domínio em português (produto,
  carrinho, ficha), consistentes com as specs
- Estilo somente com Tailwind (sem CSS próprio), mobile-first

## Interface
- Layouts para mobile, tablet e desktop
- Cabeçalho com logo SINNC e ícone "Usuario", que é o ponto de entrada
  do login e do menu da conta
- Valores sempre em reais com duas casas decimais (ex.: R$ 3,50)
- Estados sempre tratados: carregando, erro (com "Tentar de novo"),
  vazio e sem resultado de busca
- Acessibilidade: labels nos campos, foco visível, navegação por
  teclado, contraste adequado
- Mensagens ao usuário claras, em português, sem jargão técnico

## Regras de negócio globais
- Formas de pagamento da primeira versão: **somente Pix e Ficha**
  (caderneta/fiado). Cartão pode ser pensado no futuro, mas não entra
  na primeira entrega. A lista de formas de pagamento deve ser
  extensível
- Estoque mínimo é **opcional**: o administrador liga ou desliga o aviso
  e define o mínimo por item
- Catálogo é público; carrinho, pagamento, ficha, histórico e
  comprovante exigem login
- Registros da ficha e comprovantes sempre pertencem a um usuário
- Bloquear ou restringir uma conta nunca apaga dados; histórico e valor
  pendente continuam existindo

## Qualidade e definição de pronto
Uma tarefa só está pronta quando:
- O "Pronto quando" da tarefa é verdadeiro
- `npm run build` e `npm run lint` passam sem erros
- Os testes da tarefa passam
- Os critérios de aceite que ela cobre foram conferidos

Uma funcionalidade só está pronta quando todos os critérios de aceite da
spec foram percorridos um a um e o PR está aberto com a descrição ligada
à spec.

Testes:
- Funções puras de regra de negócio sempre têm testes unitários
- Cada critério de aceite deve ter pelo menos um teste ou uma
  verificação manual registrada

## Fluxo no Git
- Uma branch por funcionalidade (`feature/001-catalogo`) ou por marco
  (`feature/fase-2-pagina`)
- Um commit por tarefa, com mensagem que cita a tarefa
  (ex.: "T05: regras de estoque")
- Um PR por funcionalidade, com descrição ligada à spec

## Segurança e privacidade
- Nunca guardar senhas reais, chaves ou dados sensíveis no código ou no
  repositório. Placeholders (ex.: chave Pix) devem ser trocados antes de
  publicar
- Mensagens de erro de login são genéricas
- Nenhuma regra de segurança é considerada garantida enquanto estiver só
  no front-end; a garantia real vem do back-end (Fase 5)

## Nunca fazer
- Implementar algo que não esteja em uma spec
- Misturar tecnologia na spec (isso fica no plano)
- Usar `any` ou desligar o modo `strict`
- Ler dados mock direto nos componentes
- Espalhar regras de negócio dentro de componentes visuais
- Alterar o comportamento no código sem atualizar a spec antes
- Commitar senhas, chaves ou dados reais de pessoas
