# Tipografia do feed — referência Canva

Referência: primeira página do projeto [FEED](https://www.canva.com/design/DAHUWdeVWd0/rCfQG01UUMpf7YAmb-SskQ/edit), consultada em 09/10/2026. Arte de 1080 × 1350.

| Texto | Fonte | Tamanho no Canva | Letras | Linhas |
| --- | --- | ---: | ---: | ---: |
| Título | Tusker Grotesk Semibold | 52,8 | 60 | 1,29 |
| Subtítulo | Gotham Book | 16,1 | 60 | 1,29 |
| Chapéu | Gotham Book | 14,4 | 464 | 1,73 |

Esses valores são padrões fixos. As caixas de edição permitem alterar o conteúdo, sem campos numéricos de tipografia.

Os padrões usam a escala do Canva. Na arte, o tamanho é convertido para pixels por `tamanho × 4/3`; o espaçamento entre letras corresponde a `tamanhoEmPixels × letras/1000`; a distância entre linhas é `tamanhoEmPixels × linhas`. Prévia e PNG usam a mesma conversão. O título continua se ajustando quando uma palavra não cabe na largura disponível.

O subtítulo agora tem tamanho independente do título, largura de 647,5 px e nenhum espaçamento adicional entre palavras. A posição inicial do título é Y=761,8 px; sua largura útil de referência é 903,4 px, além das margens de tarja. O chapéu tem centro vertical em Y=737,35 px. O subtítulo acompanha o final do título com intervalo de 18,2 px, respeitando a área segura existente.

Os arquivos Gotham Book e Bold foram fornecidos pelo usuário. As fontes são carregadas antes de calcular as quebras de linha. O peso normal da Tusker evita negrito sintético na prévia que não aparecia na exportação.

A referência foi usada para tipografia. A imagem de fundo, o logo e os destaques parciais da arte do Canva não foram importados. O título começa sem destaque. Selecionar texto na caixa de edição e clicar com o botão direito aplica ou remove a tarja daquele trecho. Vários trechos podem coexistir; as quebras de linha preservam as seleções. Novos caracteres digitados entram sem tarja.

Validação: compilação, sintaxe JavaScript, múltiplas seleções e remoção individual de tarjas, dez testes automatizados e exportação PNG em 1080 × 1350. Com o texto da referência, título e subtítulo têm as mesmas quebras de linha observadas no Canva.

## Tarjas com margem fixa

O painel Layout mantém apenas as cores e uma indicação de margens fixas. Os controles Superior, Inferior, Esquerda e Direita foram removidos, assim como seu estado e eventos. As cores compartilham uma única configuração imutável: 10 px de cada lado e 7,46 px acima/abaixo da caixa nominal da fonte. Com o tamanho da referência, isso resulta em 85,32 px de altura. A posição da tarja foi compensada em -6,6 px para acompanhar a referência.

Medição no Canva: os dois retângulos da primeira página têm 85,3255 px de altura, com Y relativo 84,9937 e 174,916 px dentro do grupo. As margens são uma aproximação da referência, pois os retângulos do Canva são formas independentes e a extensão visível varia com os acentos e desenhos das letras. O editor mantém a margem nominal fixa quando o texto muda.

Verificado: amarelo e rosa conservam as mesmas dimensões; a prévia e o PNG usam o mesmo cálculo de tarja.

## Imagem original e máscara

A imagem mantém sua proporção e todo o conteúdo original. A moldura de 1080 × 1350 corta apenas a visualização/exportação; não há recorte prévio da imagem. Fotos maiores começam em suas dimensões originais; fotos menores são ampliadas apenas o necessário para cobrir a moldura. O zoom mínimo cobre a moldura. O arraste é limitado à sobra real de cada eixo. No exemplo de 2200 × 3450 px a 100%, a translação fica entre ±560 px horizontalmente e ±1050 px verticalmente. Uma nova imagem reinicia o enquadramento. Prévia, cópia desfocada e PNG usam a mesma geometria.

O negrito do subtítulo é aplicado/removido com o botão direito sobre uma seleção. Seleções separadas podem coexistir; a bolha flutuante foi removida.

Correção de interação: o arraste pode começar sobre os textos da arte, sem abrir a edição durante o movimento. Um clique sem arrastar continua abrindo o texto. Nos limites sem espaço para mover, o editor orienta a ampliar com a roda do mouse.

Correção das tarjas: a posição e a altura de cada retângulo são calculadas pela área real desenhada do trecho selecionado, com 7,46 px de folga acima e abaixo e 10 px nas laterais. Assim, acentos e cedilhas recebem a mesma folga visual que as demais letras, mesmo quando alteram a altura do desenho. A prévia usa a mesma métrica vertical da exportação. Verificado com “AQUI O TÍTULO” e “DA SUA PUBLICAÇÃO”, incluindo a cedilha.
