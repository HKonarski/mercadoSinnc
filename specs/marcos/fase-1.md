# Marco: Fase 1 - Wireframes

Entrega: [preencher a data do cronograma do professor].

Situação: **entregue**.

## Objetivo
Definir o desenho das telas do mercadinho em três tamanhos (mobile,
tablet e desktop) antes de qualquer código. Os wireframes são a
referência visual das fases seguintes e deste projeto em SDD: onde uma
spec diz "seguir os wireframes", é a esta entrega que ela se refere.

## Artefatos
| Arquivo | Tamanho de tela |
|---|---|
| `docs/wireframe-mobile.jpeg` | Mobile |
| `docs/wireframe-tablet.jpeg` | Tablet |
| `docs/wireframe-desktop.jpeg` | Desktop |

## O que os wireframes definem
Elementos registrados a partir da implementação da Fase 2, que seguiu
os wireframes. **[Conferir cada item com as imagens e completar o que
faltar, por tamanho de tela.]**

- Cabeçalho com o logo SINNC e o ícone "Usuário"
- Card de pagamento com o valor ("R$ Valor"), "Copiar Chave Pix" e
  "Registrar na Ficha"
- Seção "Como comprar" com três itens: Histórico de Compra, Valor
  Pendente na Ficha e Registro de Comprovante
- Lista de produtos com nome, preço e quantidade
- [Busca e filtros: presentes nos wireframes? Onde ficam em cada
  tamanho de tela?]
- [Ordem dos blocos no mobile: pagamento antes ou depois da lista?]
- [Comportamento no tablet: filtros visíveis ou recolhidos?]

## Como os wireframes alimentam as specs
| Elemento dos wireframes | Onde aparece nas specs |
|---|---|
| Lista de produtos, preço e estoque | Feature 001, R1, R2 |
| Card de pagamento: chave Pix e "Registrar na Ficha" | Feature 001, R6; Feature 005 |
| "Histórico de Compra" e "Valor Pendente na Ficha" | Feature 007 |
| "Registro de Comprovante" | Feature 005 |
| Ícone "Usuário" | Feature 004 (entrada do login e do menu da conta) |
| Layout por tamanho de tela | Feature 001, R9 e R15 (filtros adaptáveis) |

## Fora do marco
- Código, estilo final e dados reais
- Telas que só surgiram depois, nas specs: carrinho (Feature 002),
  leitor de código de barras (Feature 003), cadastro e login (Feature
  004) e área do administrador (Feature 008). **[Conferir se algum
  wireframe já as previa.]**

## Critérios de aceite
- [x] Wireframe mobile entregue
- [x] Wireframe tablet entregue
- [x] Wireframe desktop entregue
- [ ] Elementos acima conferidos com as imagens e a lista completada
- [ ] Diferenças entre os wireframes e as specs registradas (abaixo)

## Diferenças entre wireframes e specs
Os wireframes vieram antes do SDD, então as specs acrescentaram regras
que eles não mostram. Registre aqui o que divergir, para que a spec ou
o código não contradigam o desenho sem uma decisão explícita.

| Tema | Wireframe | Spec | Decisão |
|---|---|---|---|
| [preencher] | | | |

## Observações
- Nas fases seguintes, o wireframe é referência de **layout**; o
  comportamento e as regras vêm das specs.
- Se uma spec e um wireframe divergirem, a spec manda, e a diferença
  entra na tabela acima.
