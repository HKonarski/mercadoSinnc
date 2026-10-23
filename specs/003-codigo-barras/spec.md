# Feature 003: Leitura de código de barras

## Objetivo
Permitir que o usuário identifique um item do mercadinho escaneando o
código de barras, para ver o preço ou adicioná-lo ao carrinho sem
precisar procurar na lista.

## Usuários
- **Usuário (colaborador):** escaneia para ver o preço e para comprar
- **Visitante (sem login):** pode escanear para ver o preço, mas para
  adicionar ao carrinho precisa entrar (Feature 002, R2)
- **Administrador:** usa o mesmo recurso; o cadastro dos códigos fica na
  área administrativa (Feature 008)

## Requisitos

### Leitura
- R1. O catálogo tem a ação "Escanear código de barras", que abre o
  leitor usando a câmera do dispositivo
- R2. Antes de abrir a câmera, a pessoa é informada de que precisa
  permitir o acesso. Se negar, vê uma mensagem explicando como liberar
  e a alternativa de digitar o código (R8)
- R3. Ao reconhecer um código, o leitor para e identifica o item
  cadastrado com aquele código
- R4. A leitura reconhece os formatos de código usados em produtos de
  varejo (no mínimo EAN-13 e EAN-8)
- R5. Há um retorno visual claro quando o código é lido
- R6. A câmera é desligada ao fechar o leitor, ao sair da tela e depois
  de uma leitura concluída

### Resultado
- R7. Ao encontrar o item, o resultado mostra nome, preço (R$ com 2
  casas decimais), quantidade disponível e os selos "Indisponível" e
  "Estoque baixo", seguindo as mesmas regras do catálogo (Feature 001,
  R4 e R5). Com isso a pessoa consegue **ver o preço** sem comprar

### Alternativa manual
- R8. A pessoa pode digitar o código de barras manualmente, para quando
  a câmera não está disponível, o código está danificado ou o aparelho
  não tem câmera

### Ações depois da leitura
- R9. No resultado há a ação "Adicionar ao carrinho", que usa a mesma
  regra da Feature 002: desabilitada para item indisponível e exigindo
  login
- R10. No resultado há também "Escanear outro", que volta ao leitor
- R11. Item não encontrado: mensagem "Produto não encontrado" com as
  opções de tentar de novo, digitar o código ou buscar pelo nome no
  catálogo

### Geral
- R12. O recurso funciona bem no celular. Em dispositivo sem câmera, o
  leitor mostra direto a digitação manual
- R13. O leitor e o resultado funcionam por teclado e têm rótulos para
  leitores de tela

## Critérios de aceite

### Leitura
- Dado o catálogo aberto, quando clicar em "Escanear código de
  barras", então o sistema pede permissão da câmera e abre o leitor.
- Dado um código cadastrado, quando a câmera ler, então o leitor para e
  aparece o resultado com nome, preço e quantidade.
- Dado que a permissão da câmera foi negada, então aparece a mensagem
  explicativa e o campo para digitar o código.
- Dado que fechei o leitor, então a câmera é desligada.

### Resultado
- Dado um item com preço 2.5, quando aparecer no resultado, então mostra
  "R$ 2,50".
- Dado um item com estoque 0, quando aparecer no resultado, então mostra
  "Indisponível" e o botão de adicionar está desabilitado.
- Dado o aviso de estoque mínimo ativo e um item com estoque igual ao
  mínimo, quando aparecer no resultado, então mostra "Estoque baixo".

### Digitação manual
- Dado um código cadastrado digitado à mão, quando confirmar, então
  aparece o mesmo resultado da leitura pela câmera.
- Dado um código com letras ou com tamanho inválido, quando confirmar,
  então aparece "Código inválido" e nada é buscado.
- Dado um dispositivo sem câmera, quando abrir o recurso, então a
  digitação manual já aparece disponível.

### Ações
- Dado um usuário logado e um item disponível no resultado, quando
  clicar em "Adicionar ao carrinho", então o item entra no carrinho com
  quantidade 1 (ou soma 1, se já estiver lá).
- Dado um visitante sem login, quando clicar em "Adicionar ao carrinho",
  então é levado ao login e depois volta com o item adicionado.
- Dado um visitante sem login, quando escanear um item, então consegue
  ver o preço normalmente.
- Dado um resultado na tela, quando clicar em "Escanear outro", então o
  leitor abre de novo.

### Não encontrado
- Dado um código que não existe no catálogo, quando ler ou digitar,
  então aparece "Produto não encontrado" com as opções de tentar de
  novo, digitar o código e buscar pelo nome.

## Casos de borda
- **Câmera em uso por outro aplicativo ou erro ao abrir:** mensagem
  clara, com opção de tentar de novo e de digitar o código
- **Navegador sem suporte à câmera:** mostrar direto a digitação manual
- **Mesmo código lido várias vezes seguidas, muito rápido:** tratar como
  uma única leitura
- **Código de item inativo:** tratar como "Produto não encontrado",
  porque o catálogo só lista itens ativos (Feature 001, R1)
- **Dois itens com o mesmo código:** não deve acontecer. A Feature 008
  precisa impedir código duplicado no cadastro
- **Pouca luz ou código borrado:** a pessoa consegue desistir a
  qualquer momento e usar a digitação manual
- **Código com espaços ou traços ao digitar:** ignorar os espaços e
  traços
- **Perda de conexão ou erro ao consultar o item:** mensagem de erro
  com opção de tentar de novo

## Fora do escopo
- Cadastro e edição do código de barras dos itens (Feature 008)
- Impressão de etiquetas ou geração de códigos
- Leitura de QR Code, inclusive o do Pix (Feature 005)
- Reconhecimento do item por foto
- Leitura contínua de vários itens em sequência, sem fechar o leitor
- Registro de compra e pagamento (Feature 005)

## Dependências com outras features
- **001 Catálogo:** fornece itens, preços, estoque, selos e a regra de
  indisponível; cada item já exibe o código (R8)
- **002 Carrinho:** recebe o item pela ação "Adicionar ao carrinho"
- **004 Identificação:** a consulta de preço é pública; adicionar ao
  carrinho exige login
- **008 Área do administrador:** cadastra o código de cada item e impede
  duplicidade

## Observações para o plano técnico
Não fazem parte da spec, mas o plano precisa tratar:
- O acesso à câmera no navegador só funciona em contexto seguro (HTTPS
  ou `localhost`), o que afeta como e onde o projeto é publicado
- Escolher e justificar a forma de ler o código (recurso nativo do
  navegador, quando existir, ou biblioteca), já que o suporte varia
  entre navegadores
- Garantir que a câmera seja sempre liberada ao sair da tela

## Decisões já tomadas
- O usuário escaneia o código de barras para ver o preço ou comprar
- Consulta de preço sem login; compra exige login

## Perguntas em aberto
- Alguns itens do mercadinho vêm sem código de barras comercial (ex.:
  salgados ou bolos feitos na casa)? Se sim, o administrador gera um
  código interno e imprime a etiqueta? (impacta a Feature 008)
- Vale oferecer, em uma versão futura, a leitura de vários itens em
  sequência, para quem leva mais de um produto?
