# Feature 001: Catálogo de produtos

**Versão 3.** Fecha as perguntas em aberto da v2: limite de "Últimas
unidades" configurável, busca por trecho, categorias cadastradas pelo
administrador, itens ocultos e filtros recolhíveis no celular. Pontos
marcados com **[a confirmar]** são interpretações à espera de aprovação.

## Histórico de alterações
- **v1:** catálogo com lista, preço, estoque, estoque mínimo opcional,
  busca por nome e formas de pagamento Pix e Ficha (arquivo guardado
  na pasta `obsoleto/`)
- **v2:** busca ampliada (nome, categoria, código, preço), categorias,
  filtros, "Últimas unidades" e visualização em grade ou lista
- **v3:**
  - "Últimas unidades" passa a ter limite configurável pelo
    administrador; valor 0 significa "não existe" (R5.3 e R12)
  - Busca por trecho confirmada, com exemplo (R3)
  - Categorias deixam de ser uma lista fixa e passam a ser cadastradas
    pelo administrador (R10)
  - Entra o **item oculto** (R14), diferente de "Indisponível"
  - Filtros recolhidos atrás de um botão no celular, adaptando-se ao
    tamanho da tela conforme os wireframes (R15)

## Objetivo
Permitir que o usuário consulte os itens do mercadinho, com preço e
quantidade disponível, e veja as formas de pagamento aceitas, sem
precisar conferir a tabela de preços em papel.

## Usuários
- **Usuário (colaborador):** consulta o catálogo
- **Administrador:** visualiza o catálogo, define o aviso de estoque
  mínimo, o limite de "Últimas unidades", as categorias e quais itens
  ficam visíveis (as telas de edição ficam na Feature 008)
- **Visitante (sem login):** também consulta o catálogo, que é público

## Requisitos

### Listar e exibir
- R1. Listar todos os itens **visíveis** do mercadinho, ou seja, os que
  não estão ocultos (R14)
- R2. Cada item exibe categoria, nome, preço (R$ com 2 casas decimais),
  quantidade disponível e os selos de estoque (R4 e R5)
- R8. Cada item mostra seu código de barras, para conferência

### Buscar
- R3. Buscar itens digitando em um campo de busca, sem diferenciar
  maiúsculas/minúsculas, acentos nem espaços repetidos. A busca é **por
  trecho**: digitar só uma parte já mostra os itens correspondentes
  (ex.: "choco" mostra barra de chocolate, bolacha de chocolate, torta
  de chocolate etc.). A busca considera:
  - nome do item
  - categoria
  - código de barras
  - preço, aceitando os formatos "R$ 2,50", "2,50" e "2.5"

### Estoque
- R4. Itens com estoque zero aparecem como "Indisponível" e não podem
  ser adicionados ao carrinho
- R5. Estoque mínimo é opcional e controlado pelo administrador:
  - R5.1. Existe uma configuração geral para ativar ou desativar o
    aviso de estoque mínimo
  - R5.2. Com o aviso desativado, nenhum item exibe alerta de estoque
    baixo
  - R5.3. Com o aviso ativado, cada item pode ter seu próprio estoque
    mínimo. **Mínimo 0 significa "sem mínimo"**, e itens sem mínimo não
    exibem alerta **[a confirmar a interpretação do 0]**
  - R5.4. Quando a quantidade disponível for menor ou igual ao mínimo
    (e maior que zero), o item exibe o aviso "Estoque baixo"

### Pagamento
- R6. Exibir as formas de pagamento aceitas, somente duas:
  - **Pix** (com a chave Pix para cópia)
  - **Ficha** (caderneta/fiado): a compra fica registrada para pagar
    depois

  O crédito pré-pago (Feature 006) é uma evolução posterior e não entra
  na primeira entrega; esta lista só muda quando ele for implementado
- R7. As formas de pagamento são tratadas como uma lista extensível,
  para que novas formas entrem sem refazer o catálogo

### Organizar a lista
- R10. Cada item pertence a uma categoria. As categorias são
  **cadastradas e mantidas pelo administrador** (Feature 008); não existe
  lista fixa
- R11. O usuário pode filtrar a lista por:
  - **Categoria:** uma ou mais; sem nenhuma selecionada, mostra todas.
    Aparecem no filtro só as categorias que têm pelo menos um item
    visível **[a confirmar]**
  - **Em estoque:** só itens com quantidade maior que zero
  - **Últimas unidades:** só itens nas últimas unidades (R12)

  Os filtros combinam entre si e com a busca: o item precisa atender a
  tudo o que estiver ativo
- R12. **Últimas unidades:** item com quantidade maior que zero e menor
  ou igual ao seu limite, que é:
  - o estoque mínimo do item, quando o aviso de estoque mínimo está
    ativo e o item tem mínimo definido (maior que 0)
  - o **limite padrão**, nos demais casos

  O limite padrão é **configurável pelo administrador** (valor inicial:
  3 unidades). **Limite padrão 0 significa "não existe"**: nenhum item
  sem mínimo entra em "Últimas unidades" **[a confirmar a interpretação
  do 0]**
- R13. A lista pode ser vista em **grade** (padrão) ou em **lista**; a
  escolha não altera quais itens aparecem

### Itens ocultos
- R14. O administrador pode **ocultar** um item. Item oculto não aparece
  no catálogo, na busca, nos filtros nem na leitura de código de barras,
  e não pode ser adicionado ao carrinho. É diferente de "Indisponível":
  o item indisponível continua visível, com estoque zero, e o oculto
  desaparece para o usuário. Um item pode ser ocultado, por exemplo,
  quando acabou e não há previsão de reposição. Ao reexibir o item, o
  administrador informa a quantidade disponível (Feature 008). Itens
  ocultos continuam existindo no cadastro e nos históricos de compra

### Geral
- R9. O layout se adapta a mobile, tablet e desktop
- R15. A caixa de filtros se adapta ao tamanho da tela, seguindo os
  wireframes da Fase 1 (`docs/wireframe-mobile`, `-tablet` e
  `-desktop`):
  - em telas grandes, a caixa de filtros fica visível ao lado da lista
  - em telas pequenas (celular), os filtros ficam **recolhidos atrás de
    um botão "Filtros"**, que abre e fecha o painel
  - o botão indica quantos filtros estão ativos **[a confirmar]**

## Critérios de aceite

### Listagem e preço
- Dado que existem itens visíveis, quando abrir o catálogo, então todos
  aparecem com categoria, nome, preço e quantidade.
- Dado um item com preço 3.5, quando exibir, então aparece "R$ 3,50".

### Busca
- Dado o termo "agua", quando buscar, então aparece "Água mineral 500
  ml" e não aparece "Pão de queijo" (ignora acento e caixa).
- Dado o termo "choco", quando buscar, então aparecem todos os itens
  que tenham "choco" no nome ou na categoria, como "Barra de chocolate"
  e "Biscoito recheado sabor chocolate".
- Dado o termo "salgados", quando buscar, então aparecem os itens da
  categoria Salgados e nenhum de outra categoria.
- Dado o termo "R$ 2,50", quando buscar, então aparecem os itens com
  esse preço e não aparecem itens com outro preço.
- Dado um trecho do código de barras, quando buscar, então aparecem
  todos os itens cujo código contém esse trecho.
- Dado o código de barras completo de um item, quando buscar, então
  aparece esse item.
- Dado um termo sem resultado, quando buscar, então aparece "Nenhum
  produto encontrado para esses filtros."
- Dado que a busca foi limpa, quando apagar o termo, então a lista
  volta a mostrar todos os itens (respeitando os filtros ativos).

### Filtros
- Dado o filtro de uma categoria marcado, quando visualizar, então
  aparecem só os itens dela; ao desmarcar, todos voltam.
- Dado o filtro "Em estoque" marcado, quando visualizar, então itens com
  estoque 0 não aparecem.
- Dado o filtro "Últimas unidades" marcado, aviso ativo, e um item com
  mínimo 6 e estoque 4, então o item aparece.
- Dado o mesmo filtro e um item com mínimo 6 e estoque 6 (igual ao
  mínimo), então o item aparece: o limite é inclusivo, como no selo
  "Estoque baixo" (R5.4).
- Dado o mesmo filtro e um item com mínimo 6 e estoque 7, então o item
  não aparece.
- Dado o filtro "Últimas unidades" marcado, limite padrão 3 e um item
  sem mínimo com estoque 1, então o item aparece.
- Dado o filtro "Últimas unidades" marcado e um item sem mínimo com
  estoque 18, então o item não aparece.
- Dado o limite padrão alterado para 5 e um item sem mínimo com estoque
  5, quando marcar "Últimas unidades", então o item aparece.
- Dado o limite padrão 0 e um item sem mínimo com estoque 1, quando
  marcar "Últimas unidades", então o item **não** aparece. **[a
  confirmar]**
- Dado um item com mínimo 0 e estoque 1, então não aparece "Estoque
  baixo", e em "Últimas unidades" ele é avaliado pelo limite padrão.
  **[a confirmar]**
- Dado o aviso de estoque mínimo desativado e um item com mínimo 6 e
  estoque 5, quando marcar "Últimas unidades", então o item aparece
  apenas se o limite padrão for maior ou igual a 5.
- Dado uma busca e um filtro de categoria ativos ao mesmo tempo, então
  aparecem só os itens que atendem aos dois.
- Dado uma categoria sem nenhum item visível, então ela não aparece na
  lista de filtros. **[a confirmar]**
- Dado filtros que não retornam nada, então aparece "Nenhum produto
  encontrado para esses filtros."

### Visualização
- Dado o catálogo aberto, então a visualização inicial é grade.
- Dado que cliquei em "lista", então a lista muda de formato, o botão
  fica marcado como selecionado e os mesmos itens continuam aparecendo.

### Filtros adaptáveis
- Dado uma tela de celular, quando abrir o catálogo, então os filtros
  estão recolhidos e aparece o botão "Filtros".
- Dado o botão "Filtros", quando tocar, então o painel abre; ao tocar
  de novo, o painel fecha.
- Dado uma tela grande (desktop), quando abrir o catálogo, então a
  caixa de filtros já aparece visível, sem botão para abrir.
- Dado filtros ativos com o painel recolhido, então o botão mostra a
  quantidade de filtros ativos. **[a confirmar]**
- Dado que mudo o tamanho da tela, então o catálogo se adapta sem
  perder os filtros e a busca já escolhidos.

### Itens ocultos
- Dado um item oculto pelo administrador, quando abrir o catálogo, então
  ele não aparece na lista, na busca nem nos filtros.
- Dado um item com estoque 0 que **não** está oculto, então ele aparece
  como "Indisponível".
- Dado um item reexibido pelo administrador com quantidade 10, então ele
  volta ao catálogo com "Disponível: 10".

### Estoque
- Dado um item com estoque 0, quando visualizar, então aparece
  "Indisponível" e o botão de adicionar ao carrinho fica desabilitado.
- Dado o aviso de estoque mínimo desativado, quando um item tiver
  estoque 1 e mínimo 5, então nenhum selo "Estoque baixo" aparece.
- Dado o aviso ativado e um item com mínimo 5 e estoque 5, quando
  visualizar, então aparece "Estoque baixo".
- Dado o aviso ativado e um item sem mínimo definido com estoque 1,
  quando visualizar, então nenhum selo "Estoque baixo" aparece.

### Pagamento
- Dado que abri a área de pagamento, quando visualizar as formas
  aceitas, então aparecem apenas "Pix" e "Ficha".

## Casos de borda
- Nenhum item visível (catálogo vazio ou tudo oculto): mostrar "Nenhum
  item cadastrado ainda", diferente da mensagem de busca sem resultado
- Nome muito longo: não quebrar o layout
- Falha ao carregar os dados: mensagem de erro com opção de tentar de
  novo
- Carregando: indicador de carregamento visível
- Estoque mínimo maior que o estoque atual no cadastro: o aviso aparece
  normalmente
- Busca por trecho curto (ex.: "5"): pode casar com preço, código e
  nome de vários itens; mostrar todos é o comportamento esperado
- Item ocultado enquanto o usuário está com a página aberta: some ao
  recarregar; se estiver no carrinho, é tratado como indisponível
  (Feature 002)
- Item sem categoria (dado inconsistente): aparece na lista, mas não
  casa com nenhum filtro de categoria; a Feature 008 deve exigir
  categoria no cadastro
- Painel de filtros aberto ao girar ou redimensionar a tela: manter o
  estado dos filtros

## Fora do escopo
- Leitura de código de barras pela câmera (Feature 003)
- Adicionar ao carrinho e total (Feature 002)
- Registro do pagamento Pix e da ficha (Feature 005) e crédito
  pré-pago (Feature 006)
- Telas de cadastro e edição de itens, categorias, estoque mínimo,
  limite de "Últimas unidades", ocultar e reexibir itens e chave Pix
  (Feature 008)
- Ordenação da lista (por preço, nome etc.) e filtro por faixa de preço
- Fotos dos produtos

## Dependências com outras features
- **002 Carrinho:** recebe os itens da ação "Adicionar ao carrinho";
  trata item oculto como indisponível
- **003 Código de barras:** usa os mesmos dados; item oculto vale como
  "Produto não encontrado"
- **004 Identificação:** o catálogo não exige login. A opção "Ficha"
  só fica habilitada para contas com a permissão "Comprar na ficha";
  essa regra é aplicada no pagamento (Feature 005)
- **006 Crédito pré-pago:** evolução posterior que adicionará uma
  terceira forma de pagamento
- **008 Área do administrador:** cadastrar e manter categorias; ocultar
  e reexibir itens (reexibir exige informar a quantidade); definir o
  mínimo de cada item (0 = sem mínimo), o limite padrão de "Últimas
  unidades", o aviso de estoque mínimo e a chave Pix

## Decisões já tomadas
- Estoque mínimo flexível: chave geral que liga e desliga o aviso, mais
  um mínimo opcional por item
- Formas de pagamento da primeira versão: somente Pix e Ficha (o
  crédito, Feature 006, fica como evolução posterior)
- Catálogo com busca, filtros por categoria e disponibilidade e
  visualização em grade ou lista
- Limite de "Últimas unidades" configurável pelo administrador
- Busca por trecho em nome, categoria, código e preço
- Categorias cadastradas pelo administrador
- Itens podem ser ocultados pelo administrador, como alternativa a
  deixá-los indisponíveis
- Filtros recolhidos atrás de um botão no celular, adaptando-se ao
  tamanho da tela conforme os wireframes

## Perguntas em aberto
- **Valor 0:** confirmar que 0 em "estoque mínimo do item" e em "limite
  padrão" significa "não existe" (R5.3 e R12), conforme os critérios de
  aceite acima
- **Busca com várias palavras:** "bolacha chocolate" deve achar "Bolacha
  de chocolate" (todas as palavras, em qualquer ordem)? Hoje a busca
  trata o texto digitado como um trecho único
- **Filtro de categorias:** mostrar só as categorias que têm pelo menos
  um item visível (R11)?
- **Contador no botão "Filtros":** mostrar quantos filtros estão ativos
  (R15)?
- **Tablet:** os filtros ficam visíveis ou recolhidos? Seguir o
  wireframe de tablet; os tamanhos de tela exatos ficam para o plano
