# Marco: Fase 4 - Leitura de dados a partir de um JSON externo

Entrega prevista: 13/11/2026 (cronograma do professor).

Branch: `feature/fase-4-json`.

## Objetivo
Trocar a fonte dos dados do catálogo: em vez de módulos TypeScript, os
produtos, as categorias e a configuração passam a vir de um arquivo
JSON lido por `fetch`. Os componentes e hooks **não mudam**; só as
implementações dos serviços. Isso confirma a decisão de isolar os dados
atrás de uma interface de serviço (D1 do plano do catálogo).

## Requisitos cobertos
Da Feature 001 (Catálogo de produtos), versão 3:
- R1: lista dos itens visíveis, agora vinda do JSON
- R10: categorias vindas do JSON
- R5, R12 e R14: aviso de estoque mínimo, limite de "Últimas unidades" e
  chave Pix vindos da configuração do JSON; itens `ativo: false` não
  aparecem
- Casos de borda de carregamento e falha ao carregar

## Tarefas
- T20 Dados a partir de JSON externo
- T21 Entrega da Fase 4

## Formato do arquivo `public/data/catalogo.json`
Preços em **centavos** (decisão D2). Cada produto referencia a categoria
por `categoriaId`; o carregador monta a categoria completa no produto.

```json
{
  "configuracao": 
  {
    "avisoEstoqueMinimoAtivo": true,
    "limiteUltimasUnidades": 3,
    "chavePix": "CHAVE-PIX-DA-SINNC"
  },
  "categorias": 
  [
    { "id": "bebidas", "nome": "Bebidas" },
    { "id": "salgados", "nome": "Salgados" },
    { "id": "doces", "nome": "Doces" },
    { "id": "chocolates", "nome": "Chocolates" }
  ],
  "produtos": 
  [
    {
      "id": "1",
      "nome": "Água mineral 500 ml",
      "categoriaId": "bebidas",
      "precoCentavos": 250,
      "quantidade": 24,
      "estoqueMinimo": 6,
      "codigoBarras": "7891000000011",
      "ativo": true
    }
  ]
}
```

Regras do formato:
- `estoqueMinimo` é um inteiro; 0 significa "sem mínimo"
- `limiteUltimasUnidades` é um inteiro; 0 significa "não existe"
- `ativo: false` é um item oculto
- O arquivo é **público** (vai no repositório e no site). Não colocar
  chave Pix real nem dados de pessoas nele

## Fora do marco
- Escrever no JSON: ele é **somente leitura**. Compras, ajustes e
  alterações do administrador não persistem; isso é da Fase 5
- Back-end, login, carrinho, pagamento com registro, histórico, leitor de
  código de barras e área do administrador (Features 002 a 008)
- Crédito pré-pago (Feature 006)

## Critérios de aceite
- [x] Os dados do catálogo vêm de `public/data/catalogo.json` por
      `fetch`; não há dados de produto no código da aplicação
- [x] Os componentes e hooks não foram alterados para trocar a fonte;
      só os serviços
- [ ] Editar o JSON e recarregar a página muda o que aparece
- [x] Itens `ativo: false` não aparecem
- [x] Preços em centavos aparecem como "R$ 0,00"
- [x] Arquivo ausente (404), JSON malformado e estrutura inválida mostram
      a mensagem de erro com "Tentar de novo", sem quebrar a página
- [x] "Tentar de novo" refaz a leitura
- [x] Testes com `fetch` simulado cobrem sucesso, HTTP 404, JSON
      malformado, estrutura inválida e tentar de novo
- [x] `npm run build` seguido de `npm run preview` carrega o JSON
- [x] `npm test`, `npm run build`, `npm run lint` e `npm run format`
      sem erros
- [x] README explica onde fica o JSON e como editar os dados
- [ ] PR aberto

## Riscos e pontos a confirmar
- **"JSON externo":** o PDF diz "um JSON externo". Pode significar um
  arquivo separado do código (como neste marco) ou um endereço na
  internet. **Confirmar com o professor.** A URL é configurável por
  `VITE_CATALOGO_URL`; com um endereço remoto, o servidor precisa
  permitir CORS
- **Caminho do arquivo:** usar `import.meta.env.BASE_URL`, para o
  caminho continuar certo se o site for publicado em uma subpasta (por
  exemplo, no GitHub Pages)
- **Cache do navegador:** ao editar o JSON, pode ser preciso recarregar
  sem cache para ver a mudança
- **Testes de integração:** passam a simular o `fetch` ou usar o serviço
  mock; os testes da Fase 3 devem continuar passando
- **Um arquivo ou vários:** o PDF fala em "um JSON", então o marco usa um
  arquivo só (`catalogo.json`). Separar em vários arquivos fica como
  melhoria
