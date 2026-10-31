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

| Tamanho | Elementos e disposição |
|---|---|
| Mobile | Cabeçalho; busca e ação de código de barras; categorias em faixa horizontal; produtos em lista vertical; seção "Como comprar"; pagamento Pix/Ficha; rodapé. |
| Tablet | Cabeçalho; busca e ação de código de barras; categorias em faixa horizontal; produtos em grade de duas colunas; "Como comprar" em três cartões lado a lado; pagamento abaixo, ocupando a largura. |
| Desktop | Cabeçalho; filtros laterais (categoria, disponibilidade e visualização); busca e produtos em grade de três colunas; pagamento na coluna direita, acima de "Como comprar"; rodapé. |

Em todos os tamanhos, os cartões mostram nome, categoria, preço,
quantidade/situação e código de barras. O cabeçalho inclui o logo SINNC
e o ícone "Usuário". O pagamento mostra o valor, a ação para copiar a
chave Pix e "Registrar na Ficha".

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
  cadastro e login (Feature 004) e área do administrador (Feature 008).
  O botão para escanear código aparece nos wireframes; o fluxo do leitor
  é definido pela Feature 003 e fica para essa funcionalidade.

## Critérios de aceite
- [x] Wireframe mobile entregue
- [x] Wireframe tablet entregue
- [x] Wireframe desktop entregue
- [x] Elementos acima conferidos com as imagens e a lista completada
- [x] Diferenças entre os wireframes e as specs registradas (abaixo)

## Diferenças entre wireframes e specs
Os wireframes vieram antes do SDD, então as specs acrescentaram regras
que eles não mostram. Registre aqui o que divergir, para que a spec ou
o código não contradigam o desenho sem uma decisão explícita.

| Tema | Wireframe | Spec | Decisão |
|---|---|---|---|
| Busca e leitor | Busca e botão de código aparecem nos três wireframes. | A busca pertence ao catálogo; a câmera e a leitura manual são definidas pela Feature 003. | Implementar a busca no catálogo; manter leitura para a Feature 003. |
| Filtros | Categorias horizontais no mobile/tablet; painel lateral no desktop. | A spec inclui também estoque, últimas unidades e visualização; filtros recolhíveis no celular. | Manter a faixa de categorias em mobile/tablet, filtros completos no desktop e painel expansível no celular. |
| Cartões de produto | Há espaço reservado para imagem e ação "Ver mais produtos". | A spec 001 não define imagem nem paginação do catálogo. | Não inventar imagens/paginação sem requisito; exibir os dados definidos na spec. |
| Pagamento | O bloco Pix aparece no desktop ao lado da lista e abaixo de "Como comprar" no mobile/tablet; o wireframe também mostra "Registrar na Ficha". | A constituição permite Pix e Ficha; o catálogo só mostra as formas e não conclui compras. | Preservar a ordem visual por tamanho; pagamento funcional pertence à Feature 005. |
| Conteúdo | O desenho contém produtos e controles visuais provisórios. | A spec define os dados e regras do catálogo. | A spec governa conteúdo e comportamento; o wireframe orienta somente o layout. |

## Observações
- Nas fases seguintes, o wireframe é referência de **layout**; o
  comportamento e as regras vêm das specs.
- Se uma spec e um wireframe divergirem, a spec manda, e a diferença
  entra na tabela acima.
