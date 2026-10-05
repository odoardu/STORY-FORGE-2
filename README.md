# StoryForge

Editor de artes de Feed para a LP Zero Brasil.

## Uso

- Envie uma imagem ou use a opção de imagem aleatória.
- Arraste a imagem na arte para mover; use o scroll para alterar o zoom.
- Clique no título, chapéu ou subtítulo para editar em uma bolha.
- Selecione um trecho do subtítulo para acessar o negrito contextual.
- Ajuste o layout e o logo e exporte em PNG.

## Executar e validar

Requisito: Node.js 22 ou superior. Não há dependências de produção.

```sh
node server.mjs
npm run build
node --check app.js
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
