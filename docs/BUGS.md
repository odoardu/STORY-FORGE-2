# Bugs conhecidos

Relatados pelo responsável em 05/10/2026. Todos estão pendentes de investigação e correção futura; a reorganização não os corrige nem promete uma data.

## SF-001 — Formato da imagem

- Relato: qualquer imagem inserida fica em 1080 × 1300 pixels.
- Referência técnica: o código atual define o Feed e o canvas em 1080 × 1350 pixels. A divergência com o relato precisa ser reproduzida e investigada.
- Impacto: dimensões ou enquadramento diferentes do esperado.
- Para reproduzir: inserir imagens de diferentes proporções e conferir a prévia e o tamanho do PNG exportado.
- Status: correção futura; dimensões desejadas a confirmar.

## SF-002 — Negrito acompanhando o mouse

- Relato: a bolha acompanha o cursor, tornando a opção de negrito praticamente inutilizável.
- Para reproduzir: abrir o subtítulo, selecionar texto e tentar clicar no botão de negrito enquanto se move o mouse.
- Impacto: dificuldade para aplicar/remover negrito.
- Status: correção futura; interação a rever.

## SF-003 — Artefatos visuais na exportação PNG

- Relato: o PNG exportado contém linhas e efeitos de degradê luminoso indesejados.
- Para reproduzir: inserir uma imagem, exportar PNG e comparar com a prévia, observando linhas, máscara, blur e gradientes.
- Impacto: exportação inadequada para publicação.
- Status: correção futura; causa ainda não confirmada.
