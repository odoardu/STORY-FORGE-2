# Histórico de mudanças

## 09/10/2026 — Interface mobile temporária

### Interface
- Criada uma variante mobile temporária, sem rolagem da página, preservando a interface de desktop.
- Prévia ocupa a área principal da tela; imagem, tarjas e textos ficam em controles compactos na base.
- Painéis de imagem e tarjas abrem como folhas sobrepostas e podem ser fechados pelo botão “Concluir”.
- Editor de título e subtítulo se adapta à altura disponível, com ações próprias para tarja e negrito em telas sem botão direito.
- Zoom da imagem ganhou controles de + e − para uso em dispositivos touch.
- Área segura para notch, teclado e barras do navegador usando o viewport visual.

### Ajustes
- Cabeçalho, navegação, exportação e mensagens foram compactados para telas pequenas.
- A variante mobile é temporária e ficará disponível para validação antes de substituir ou consolidar o layout definitivo.


## 09/10/2026 — Refinamento do editor de feed

### Novidades e melhorias
- Chapéu alternável entre texto e logo Mundo Soldier; atalhos para editar os textos.
- Tarjas e negrito aplicados a múltiplas seleções com o botão direito.
- Tipografia ajustada à referência do Canva, tarjas padronizadas e subtítulo menor com mais espaço até o título.
- Títulos longos crescem para cima, respeitam o limite inferior e ajustam a fonte quando necessário.
- Fotos preservam suas proporções, com arraste limitado às bordas da imagem.
- Logo Linkin Park Zero Brasil aplicado por padrão, com tamanho e posição fixos.
- Interface neutra e simplificada, sem os controles numéricos de tipografia, o painel de blur ou a aba do logo.
- Blur fixado em 19 px e degradê em 86%.

### Correções
- Amarelo das tarjas corrigido de #FACC15 para #DFC330 (RGB 223, 195, 48), conforme o tom medido no Canva. Aplicado à prévia, ao PNG e aos seletores de cor.
- Removidos os degradês rosados indesejados do PNG e alinhado o sombreamento com a prévia.
- Corrigidos o arraste sobre os textos, a sobreposição de painéis e o alinhamento das tarjas.

### Compatibilidade
- Exportação PNG em 1080 × 1350 px; API de geração de posts preservada.

### Próximos passos
- Adicionar modelo com foto e texto grande, seguindo o novo formato utilizado pelo perfil.
- Criar automaticamente o último slide do carrossel com a chamada “Siga a @lp_zerobr”.

## 05/10/2026 — Reorganização preparada

- Documentação central em README e docs.
- Referências do Figma e instruções antigas agrupadas em docs.
- Arquivos gerados, dependências e configurações locais excluídos do versionamento por .gitignore.
- Bugs relatados registrados em BUGS.md, sem correções nesta etapa.

## Edição contextual de textos — PR anterior #3

- Campos de título, chapéu e subtítulo retirados da coluna lateral.
- Clique em cada texto da arte abre uma bolha com o campo correspondente.
- Atualização imediata da prévia durante a edição.
- Fechamento por Escape, botão de fechar ou clique externo.
- Bolha de negrito acompanha o cursor enquanto há seleção no subtítulo.
- Bug conhecido: o acompanhamento do cursor dificulta o uso do botão.

## Simplificação do editor — PR anterior #2

- Atalhos duplicados de conteúdo removidos; navegação única.
- Modo Story retirado da interface e editor iniciado em Feed.
- Um único botão de exportação PNG.
- Controles visíveis de zoom e posição e reprodução removidos.
- Imagem movida por arraste; scroll amplia ou reduz em torno do cursor.
- Instruções da prévia retiradas.
- Painel fixo de negrito substituído por bolha contextual.
- Posição e tamanho iniciais do logo adaptados ao Feed.

## Nova interface — PR anterior #1

- Aplicação de index.html, app.js e styles.css do ZIP StoryForge-interface-nova(2).zip.
- Nova disposição da navegação, prévia e ajustes.
- Seleção de elementos pela arte e navegação por camadas.
- Controle de zoom da prévia introduzido e depois removido.
- Demais arquivos preservados nesta etapa.

## Validação anterior

- Build e sintaxe do JavaScript verificados.
- Interações verificadas em DOM simulado; não equivalem a teste visual completo.
- Deploys de produção confirmados e arquivos servidos comparados ao código publicado.
- Bugs visuais relatados permanecem pendentes.
