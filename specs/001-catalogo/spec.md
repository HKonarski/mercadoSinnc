# Feature 001: Catálogo de produtos

**Versão 2.** Incorpora a busca ampliada, as categorias, os filtros e a
visualização em lista, que já existiam no código da Fase 2 sem estar na
spec. Pontos marcados com **[a confirmar]** são propostas à espera de
aprovação.

## Histórico de alterações
- **v1:** catálogo com lista, preço, estoque, estoque mínimo opcional,
  busca por nome e formas de pagamento Pix e Ficha - v1 está na pasta obsoletos.
- **v2:** busca passa a considerar nome, categoria, código e preço
  (R3); entram categorias (R10), filtros (R11), "Últimas unidades"
  (R12) e visualização em grade ou lista (R13); a mensagem de busca sem
  resultado passa a cobrir busca e filtros; categorias e filtros saem do
  "Fora do escopo"

## Objetivo
Permitir que o usuário consulte os itens do mercadinho, com preço e
quantidade disponível, e veja as formas de pagamento aceitas, sem
precisar conferir a tabela de preços em papel.

## Usuários
- **Usuário (colaborador):** consulta o catálogo
- **Administrador:** visualiza o catálogo e define se o aviso de estoque
  mínimo está ativo (a edição de itens fica na spec da área
  administrativa)
- **Visitante (sem login):** também consulta o catálogo, que é público

## Requisitos

### Listar e exibir
- R1. Listar todos os itens ativos do mercadinho
- R2. Cada item exibe categoria, nome, preço (R$ com 2 casas decimais),
  quantidade disponível e os selos de estoque (R4 e R5)
- R8. Cada item mostra seu código de barras, para conferência

### Buscar
- R3. Buscar itens digitando em um campo de busca, sem diferenciar
  maiúsculas/minúsculas, acentos nem espaços repetidos. A busca
  considera:
  - nome do item
  - categoria (ex.: "salgados")
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
    mínimo; itens sem mínimo definido não exibem alerta
  - R5.4. Quando a quantidade disponível for menor ou igual ao mínimo
    (e maior que zero), o item exibe o aviso "Estoque baixo"

### Pagamento
- R6. Exibir as formas de pagamento aceitas, somente duas:
  - **Pix** (com a chave Pix para cópia)
  - **Ficha** (caderneta/fiado): a compra fica registrada para pagar
    depois
- R7. As formas de pagamento são tratadas como uma lista extensível,
  para que cartão possa entrar no futuro sem refazer o catálogo

### Organizar a lista
- R10. Cada item pertence a uma categoria. Na primeira versão: Doces,
  Salgados, Bebidas e Chocolates
- R11. O usuário pode filtrar a lista por:
  - **Categoria:** uma ou mais; sem nenhuma selecionada, mostra todas
  - **Em estoque:** só itens com quantidade maior que zero
  - **Últimas unidades:** só itens nas últimas unidades (R12)

  Os filtros combinam entre si e com a busca: o item precisa atender a
  tudo o que estiver ativo
- R12. **Últimas unidades [a confirmar]:** item com quantidade maior que
  zero e menor ou igual ao seu limite, que é:
  - o estoque mínimo do item, quando o aviso de estoque mínimo está
    ativo e o item tem mínimo definido
  - o limite padrão de **3 unidades**, nos demais casos
- R13. A lista pode ser vista em **grade** (padrão) ou em **lista**; a
  escolha não altera quais itens aparecem

### Geral
- R9. O layout se adapta a mobile, tablet e desktop

## Critérios de aceite

### Listagem e preço
- Dado que existem itens cadastrados, quando abrir o catálogo, então
  todos os itens ativos aparecem com categoria, nome, preço e
  quantidade.
- Dado um item com preço 3.5, quando exibir, então aparece "R$ 3,50".

### Busca
- Dado o termo "agua", quando buscar, então aparece "Água mineral 500
  ml" e não aparece "Pão de queijo" (ignora acento e caixa).
- Dado o termo "salgados", quando buscar, então aparecem os itens da
  categoria Salgados e nenhum de outra categoria.
- Dado o termo "R$ 2,50", quando buscar, então aparecem os itens com
  esse preço e não aparecem itens com outro preço.
- Dado o código de barras completo de um item, quando buscar, então
  aparece só esse item.
- Dado um termo sem resultado, quando buscar, então aparece "Nenhum
  produto encontrado para esses filtros."
- Dado que a busca foi limpa, quando apagar o termo, então a lista
  volta a mostrar todos os itens (respeitando os filtros ativos).

### Filtros
- Dado o filtro "Doces" marcado, quando visualizar, então aparecem só
  itens de Doces; ao desmarcar, todos voltam.
- Dado o filtro "Em estoque" marcado, quando visualizar, então itens com
  estoque 0 não aparecem.
- Dado o filtro "Últimas unidades" marcado, aviso ativo, e um item com
  mínimo 6 e estoque 4, então o item aparece.
- Dado o filtro "Últimas unidades" marcado e um item sem mínimo com
  estoque 1, então o item aparece (limite padrão de 3).
- Dado o filtro "Últimas unidades" marcado e um item sem mínimo com
  estoque 18, então o item não aparece.
- Dado o aviso de estoque mínimo desativado e um item com mínimo 6 e
  estoque 5, quando marcar "Últimas unidades", então o item **não**
  aparece (vale o limite padrão de 3). **[a confirmar]**
- Dado uma busca e um filtro de categoria ativos ao mesmo tempo, então
  aparecem só os itens que atendem aos dois.
- Dado filtros que não retornam nada, então aparece "Nenhum produto
  encontrado para esses filtros."

### Visualização
- Dado o catálogo aberto, então a visualização inicial é grade.
- Dado que cliquei em "lista", então a lista muda de formato, o botão
  fica marcado como selecionado e os mesmos itens continuam aparecendo.

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
- Catálogo vazio (nenhum item cadastrado): mostrar "Nenhum item
  cadastrado ainda", diferente da mensagem de busca sem resultado
- Nome muito longo: não quebrar o layout
- Falha ao carregar os dados: mensagem de erro com opção de tentar de
  novo
- Carregando: indicador de carregamento visível
- Estoque mínimo maior que o estoque atual no cadastro: o aviso aparece
  normalmente
- Busca por número curto (ex.: "5"): pode casar com preço, código e
  quantidade de vários itens; o comportamento esperado está em aberto
  (ver perguntas em aberto)
- Categoria sem nenhum item: continua aparecendo na lista de filtros e,
  ao marcar, mostra "Nenhum produto encontrado para esses filtros."

## Fora do escopo
- Leitura de código de barras pela câmera (Feature 003)
- Adicionar ao carrinho e total (Feature 002)
- Registro do pagamento Pix e da ficha (Feature 005)
- Cadastro e edição de itens, categorias, estoque mínimo, limite de
  "Últimas unidades" e chave Pix (área do administrador, Feature 008)
- Ordenação da lista (por preço, nome etc.) e filtro por faixa de preço
- Pagamento com cartão (futuro)
- Fotos dos produtos

## Dependências com outras features
- **002 Carrinho:** recebe os itens da ação "Adicionar ao carrinho"
- **003 Código de barras:** usa os mesmos dados e a mesma regra de
  indisponível e de selos
- **004 Identificação:** o catálogo não exige login. A opção "Ficha"
  só fica habilitada para contas com a permissão "Comprar na ficha";
  essa regra é aplicada no pagamento (Feature 005)
- **008 Área do administrador:** define quem altera o aviso de estoque
  mínimo, o mínimo por item, a categoria de cada item, o limite de
  "Últimas unidades" e a chave Pix

## Decisões já tomadas
- Estoque mínimo flexível: chave geral que liga e desliga o aviso, mais
  um mínimo opcional por item
- Formas de pagamento da primeira versão: somente Pix e Ficha
- Cartão pode ser pensado no futuro, mas não entra na primeira entrega
- Catálogo com busca, filtros por categoria e disponibilidade e
  visualização em grade ou lista (v2)

## Perguntas em aberto
- **"Últimas unidades" (R12):** confirmar a definição proposta, em
  especial que, com o aviso de estoque mínimo desativado, o filtro usa o
  limite padrão de 3 em vez do mínimo do item. O limite padrão deve ser
  configurável pelo administrador?
- **Busca por código e por preço:** manter a busca por trecho, como hoje
  (digitar "78" casa com todos os códigos), ou exigir código completo e
  preço exato?
- **Categorias:** são fixas (as quatro atuais) ou o administrador
  cadastra novas? "Chocolates" fica separado de "Doces"?
- **Celular:** a caixa de filtros aparece antes da lista e empurra os
  produtos para baixo. Recolher os filtros atrás de um botão "Filtros"
  no mobile?