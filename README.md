# 🛒 mercadoSinnc

Plataforma web para o **mercadinho interno da SINNC**, que substitui a ficha
de papel por um fluxo digital: consultar preços, montar o carrinho, pagar via
Pix ou deixar na ficha (caderneta/fiado) e acompanhar o histórico e o valor
pendente.

Trabalho de Conclusão da Disciplina de **Desenvolvimento em Ambiente Web**.

## Autor

Higor Konarski ([@HKonarski](https://github.com/HKonarski))

## Sobre o projeto

Hoje, quem compra no mercadinho confere o preço numa tabela, anota data,
quantidade, item e assinatura na ficha, e marca se pagou. A plataforma
organiza esse processo para dois perfis:

| Perfil | O que faz |
|---|---|
| **Usuário (colaborador)** | Consulta preços, formas de pagamento e estoque; escaneia o código de barras; monta o carrinho; paga via Pix ou registra na ficha; consulta histórico e valor pendente |
| **Administrador** | Cadastra e edita itens, preços e estoque; confere registros e comprovantes; dá baixa em valores pendentes; gerencia acessos (aprovar, bloquear, restringir) |

## Tecnologias

- React + TypeScript (modo `strict`)
- Tailwind CSS
- Vite
- Vitest + Testing Library
- Planejado para as fases finais: Java (back-end) e SQL (banco de dados)

## Como rodar

Requer Node.js 20 ou superior.

```bash
git clone https://github.com/HKonarski/mercadoSinnc.git
cd mercadoSinnc
npm install
npm run dev
```

Outros comandos:

```bash
npm test         # roda os testes
npm run build    # gera a versão de produção
npm run lint     # verifica o código
```

## Fases do trabalho

| Fase | Entrega | Situação |
|---|---|---|
| 1 | Wireframes mobile, tablet e desktop | ✅ Entregue |
| 2 | Página no `App.tsx` com Tailwind CSS |  ✅ Entregue |
| 3 | Evolução do front-end em React, TypeScript e Tailwind | ⏳ Planejado (06/11)|
| 4 | Leitura de dados de um JSON externo (13/11) | ⏳ Planejado |
| 5 e 6 | Back-end em Java e banco de dados SQL | ⏳ Planejado |

## Como o projeto é desenvolvido (SDD)

O projeto segue o **Spec Driven Development**: a especificação é a fonte da
verdade e o código nasce dela. Para cada funcionalidade o fluxo é
**spec → plano técnico → tarefas → implementação**, e qualquer mudança de
comportamento atualiza a spec antes do código.

```
specs/
├── constitution.md       # princípios e regras fixas do projeto
├── marcos/               # recortes de entrega por fase (ex.: fase-2.md)
├── 001-catalogo/         # spec, plan e tasks
├── 004-identificacao/    # cadastro, login e gestão de acessos
└── ...                   # carrinho, código de barras, pagamento, histórico e admin
```

| Funcionalidade | Spec | Plano | Tarefas |
|---|---|---|---|
| 001 Catálogo de produtos | ✅ | ✅ | ✅ |
| 002 Carrinho | ✅ | ⏳ | ⏳ |
| 003 Leitura de código de barras | ✅ | ⏳ | ⏳ |
| 004 Identificação do usuário | ✅ | ⏳ | ⏳ |
| 005 Pagamento (Pix, ficha e comprovante) | ⏳ | ⏳ | ⏳ |
| 006 Crédito pré-pago (evolução)| ✅ | ⏳ | ⏳ |
| 007 Histórico e valor pendente | ⏳ | ⏳ | ⏳ |
| 008 Área do administrador | ⏳ | ⏳ | ⏳ |

## Decisões importantes

- Formas de pagamento na primeira versão: **somente Pix e Ficha**
  (cartão fica para o futuro).
- Estoque mínimo é **opcional**: o administrador liga ou desliga o aviso e
  define o mínimo por item.
- Nas fases de front-end, login e dados são **simulados (mock)**. A
  autenticação e o armazenamento reais chegam com o back-end.

## Licença

Projeto acadêmico.