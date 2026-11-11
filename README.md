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
npm run preview  # serve a versão de produção localmente
npm run lint     # verifica o código
npm run format   # formata o código
```

### Dados do catálogo

Os produtos, as categorias e as configurações do catálogo ficam em
`public/data/catalogo.json`. Edite esse arquivo e recarregue a página para
ver as alterações. Os preços são inteiros em centavos (por exemplo,
`250` = R$ 2,50); `ativo: false` oculta um produto. A chave Pix do arquivo
é apenas um placeholder público: não coloque chaves reais nem dados
pessoais no repositório.

### Imagens dos produtos

Coloque as fotos em `public/assets/img` e informe o nome do arquivo no campo
opcional `imagem` do produto em `public/data/catalogo.json`. Se o campo não
existir, o catálogo procura um arquivo com o código de barras no nome e as
extensões `.jfif`, `.jpg`, `.jpeg`, `.jpe`, `.png` e `.webp`. Sem uma imagem
correspondente, exibe um espaço reservado no card.

Para apontar o catálogo a outro endereço, defina `VITE_CATALOGO_URL`.
O servidor remoto precisa permitir requisições CORS.

## Fases do trabalho

| Fase | Entrega | Situação |
|---|---|---|
| 1 | Wireframes mobile, tablet e desktop | ✅ Entregue |
| 2 | Página no `App.tsx` com Tailwind CSS | ✅ Entregue |
| 3 | Componentes, serviços, hooks e regras do catálogo | ✅ Implementação e aceite concluídos; PR pendente |
| 4 | Leitura do catálogo a partir de JSON | ✅ Implementação concluída; aceite final/PR pendentes |
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
| 001 Catálogo de produtos | ✅ | ✅ | ✅ (Fases 3 e 4 implementadas) |
| 002 Carrinho | ✅ | ⏳ | ⏳ |
| 003 Leitura de código de barras | ✅ | ⏳ | ⏳ |
| 004 Identificação do usuário | ✅ | ⏳ | ⏳ |
| 005 Pagamento (Pix, ficha e comprovante) | ✅ | ⏳ | ⏳ |
| 006 Crédito pré-pago (evolução)| ✅ | ⏳ | ⏳ |
| 007 Histórico e valor pendente | ✅ | ⏳ | ⏳ |
| 008 Área do administrador | ✅ | ⏳ | ⏳ |

### Ordem de implementação das funcionalidades

O crédito pré-pago (Feature 006) é uma evolução posterior: será
implementado somente depois das Features 005 (Pagamento), 007 (Histórico
e valor pendente) e 008 (Área do administrador).

## Decisões importantes

- Formas de pagamento na primeira versão: **somente Pix e Ficha**
  (cartão fica para o futuro).
- Estoque mínimo é **opcional**: o administrador liga ou desliga o aviso e
  define o mínimo por item.
- Nas fases de front-end, login e dados são **simulados (mock)**. A
  autenticação e o armazenamento reais chegam com o back-end.

## Licença

Projeto acadêmico.