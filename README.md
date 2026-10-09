# StoryForge

Editor de artes de Feed para a LP Zero Brasil.

## Uso

- Envie uma imagem ou use a opção de imagem aleatória.
- Arraste a imagem na arte para mover; use o scroll para alterar o zoom.
- Clique no título, chapéu ou subtítulo para editar em uma bolha.
- Selecione um trecho do subtítulo e clique com o botão direito para aplicar ou remover o negrito.
- Selecione trechos do título e clique com o botão direito para aplicar ou remover tarjas. O texto começa sem destaque.
- A tipografia e as margens das tarjas são fixas, baseadas no Canva. Escolha a cor no Layout.
- A imagem mantém a proporção original e só é recortada pela moldura; fotos maiores começam em seu tamanho original, e o arraste e o zoom impedem áreas vazias.
- Ajuste o logo e exporte em PNG.

## Executar e validar

Requisito: Node.js 22 ou superior. Não há dependências de produção.

```sh
node server.mjs
npm run build
node --check app.js
node --test scripts/editor-core.test.mjs
```

## Estrutura

| Caminho | Finalidade |
| --- | --- |
| `index.html` | Interface do editor |
| `app.js` | Interação, prévia e exportação |
| `styles.css` | Estilos e adaptação à tela |
| `assets/` | Fontes, logos e texturas |
| `api/` | Função de imagem aleatória |
| `scripts/build.mjs` | Geração do site e catálogos em dist |
| `server.mjs` | Servidor local |
| `vercel.json` | Configuração de publicação |
| `docs/` | Histórico, bugs e configuração de branches/deploy |

## Estado do projeto

Há bugs conhecidos ainda não corrigidos. Consulte [BUGS.md](docs/BUGS.md), [CHANGELOG.md](docs/CHANGELOG.md) e [DEPLOYMENT.md](docs/DEPLOYMENT.md).
