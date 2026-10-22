# Feature 001: Catálogo de produtos

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
- R1. Listar todos os itens ativos do mercadinho
- R2. Cada item exibe nome, preço (R$ com 2 casas decimais) e
  quantidade disponível
- R3. Buscar itens por nome, tipo/categoria, valor ou código de barras,
  sem diferenciar maiúsculas/minúsculas e acentos
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
- R6. Exibir as formas de pagamento aceitas, somente duas:
  - **Pix** (com a chave Pix para cópia)
  - **Ficha** (caderneta/fiado): a compra fica registrada para pagar
    depois
- R7. As formas de pagamento são tratadas como uma lista extensível,
  para que cartão possa entrar no futuro sem refazer o catálogo
- R8. Cada item mostra seu código de barras, para conferência
- R9. O layout se adapta a mobile, tablet e desktop
- R10. Permitir filtrar o catálogo por categoria e disponibilidade, e
  alternar entre visualização em grade e lista

## Critérios de aceite
- Dado que existem itens cadastrados, quando abrir o catálogo, então
  todos os itens ativos aparecem com nome, preço e quantidade.
- Dado o termo "agua", "bebidas", "2,50" ou um código de barras na
  busca, quando buscar, então aparecem os itens correspondentes
  (ignorando acento e caixa).
- Dado um termo sem resultado, quando buscar, então aparece a mensagem
  "Nenhum item encontrado".
- Dado que a busca foi limpa, quando apagar o termo, então a lista
  completa volta a aparecer.
- Dada uma categoria selecionada, quando aplicar o filtro, então só
  aparecem itens daquela categoria.
- Dado o filtro "Em estoque" selecionado, quando aplicar os filtros,
  então itens com quantidade zero não aparecem.
- Dado o filtro "Últimas unidades" selecionado, quando aplicar os
  filtros, então aparecem apenas itens com estoque positivo abaixo do
  mínimo definido ou, sem mínimo, com até três unidades.
- Dado que selecionei a visualização em lista, quando olhar o catálogo,
  então os produtos aparecem em uma única coluna.
- Dado um item com estoque 0, quando visualizar, então aparece
  "Indisponível" e o botão de adicionar ao carrinho fica desabilitado.
- Dado um item com preço 3.5, quando exibir, então aparece "R$ 3,50".
- Dado o aviso de estoque mínimo desativado, quando um item tiver
  estoque 1 e mínimo 5, então nenhum aviso aparece.
- Dado o aviso ativado e um item com mínimo 5 e estoque 5, quando
  visualizar, então aparece "Estoque baixo".
- Dado o aviso ativado e um item sem mínimo definido com estoque 1,
  quando visualizar, então nenhum aviso aparece.
- Dado que abri a área de pagamento, quando visualizar as formas
  aceitas, então aparecem apenas "Pix" e "Ficha".

## Casos de borda
- Catálogo vazio: mostrar "Nenhum item cadastrado ainda"
- Nome muito longo: não quebrar o layout
- Falha ao carregar os dados: mensagem de erro com opção de tentar de
  novo
- Carregando: indicador de carregamento visível
- Estoque mínimo maior que o estoque atual no cadastro: o aviso aparece
  normalmente

## Fora do escopo
- Leitura de código de barras pela câmera (Feature 003)
- Adicionar ao carrinho e total (Feature 002)
- Registro do pagamento Pix e da ficha (Feature 005)
- Cadastro e edição de itens, do estoque mínimo e da chave Pix (área do
  administrador, Feature 007)
- Pagamento com cartão (futuro)
- Fotos dos produtos
- Filtros avançados além de categoria e disponibilidade

## Dependências com outras features
- **004 Identificação:** o catálogo não exige login. A opção "Ficha"
  só fica habilitada para contas com a permissão "Comprar na ficha";
  essa regra é aplicada no pagamento (Feature 005)
- **007 Área do administrador:** define quem altera o aviso de estoque
  mínimo, o mínimo por item e a chave Pix

## Decisões já tomadas
- Estoque mínimo flexível: chave geral que liga e desliga o aviso, mais
  um mínimo opcional por item
- Formas de pagamento da primeira versão: somente Pix e Ficha
- Cartão pode ser pensado no futuro, mas não entra na primeira entrega

## Perguntas em aberto
- Nenhuma no momento
