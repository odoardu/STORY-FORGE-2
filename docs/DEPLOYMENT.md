# Branches e publicação

## Configuração proposta para a republicação

| Opção | Valor |
| --- | --- |
| Repositório | odoardu/storyforge-online |
| Branch de produção | main |
| Branch de trabalho | feat/<nome-da-mudanca> ou fix/<nome-do-bug> |
| Projeto Vercel | storyforge-online, um único projeto |
| Diretório raiz | raiz do repositório |
| Framework | Other / nenhum, conforme vercel.json |
| Build | npm run build |
| Saída | dist |
| Node.js | 24.x, compatível com requisito >=22 |
| Deploy de produção | main |
| Deploy de prévia | branches de trabalho e PRs |

## Fluxo

1. Criar branch a partir de main.
2. Validar build e comportamento.
3. Abrir PR com mudança, testes e bugs ainda existentes.
4. Conferir a prévia e fazer merge.
5. Confirmar deploy READY, commit e domínio principal.

As mudanças anteriores estão em CHANGELOG.md. Os três bugs relatados estão em BUGS.md. Após a recriação, registrar aqui o novo primeiro commit e o deployment de produção confirmado.

## Recursos anteriores identificados

- GitHub: odoardu/storyforge-online.
- Vercel: storyforge-online, storyforge-online-woso, storyforge-online-vio4 e storyforge-online-ob8l.
- Branches de trabalho anteriores: feat/interface-nova, feat/feed-editor-simplificado e feat/edicao-texto-na-arte.

Esses recursos não devem ser considerados apagados até a confirmação da exclusão e da republicação.
