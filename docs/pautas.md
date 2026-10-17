# Pautas conectadas ao Trello

O site consulta `/api/content-ideas` ao carregar, ao abrir Pautas e a cada cinco minutos enquanto estiver visível. Ao voltar ao app, consulta novamente se a última carga tem mais de um minuto. O servidor permite cache de até 60 segundos na CDN da Vercel.

## Configuração

1. Obtenha uma chave e um token de **leitura** pela [autorização oficial do Trello](https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/). A conta precisa acessar o quadro LP ZERO BR.
2. Em Settings → Environment Variables do projeto Vercel, cadastre `TRELLO_API_KEY` e `TRELLO_TOKEN` para Production. Para testar em Preview, cadastre também nesse ambiente. Nunca coloque o token no código, no chat ou em variáveis públicas.
3. Faça um novo deployment depois de cadastrar as variáveis. Confirme que o popup mostra **Trello conectado** e que `/api/content-ideas` retorna `mode: "live"`.
4. Localmente, guarde as variáveis em `.env.local` e inicie com `node --env-file=.env.local server.mjs`.

Somente as listas **💡 IDEIAS / INBOX** e **📆 DATAS ESPECIAIS**, com IDs fixos e nomes correspondentes, são publicadas. Membros, comentários e outras listas não são enviados ao navegador. O popup exclui datas vencidas e exibe datas especiais de hoje até os próximos seis dias. Novidades consideram atualizações dos últimos sete dias.

A rotina de pesquisa do ChatGPT continua responsável por pesquisar e criar os cards no Trello. Esta integração lê o resultado; ela não modifica nem agenda aquela rotina e não cria posts. Não é necessário republicar o site para receber novos cards.

Sem credenciais ou em falha do Trello, o site mostra a cópia em `data/content-ideas.json` e informa que a conexão está pendente ou indisponível. A data dessa cópia nunca é substituída pela data de uma tentativa de atualização.
