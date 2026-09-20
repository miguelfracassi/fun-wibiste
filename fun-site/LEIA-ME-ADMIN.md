# Cadastro de stand + painel admin — como configurar

Foram adicionados:
- `cadastro-stand.html` — formulário público (pede WhatsApp, nome da empresa, representante e email).
- `acess-adm.html` — página escondida (não tem link em nenhum menu) que lista todas as inscrições. Fica acessível em `seusite.com/acess-adm` graças ao `cleanUrls` já configurado no `vercel.json`.
- `api/inscricoes.js` — função serverless que recebe o formulário (POST) e entrega a lista pro painel admin (GET, protegido por senha).

## Passo a passo no Vercel

1. **Criar o banco de dados (armazenamento das inscrições)**
   No painel do seu projeto na Vercel: aba **Storage** → **Create Database** → escolha **KV** (Redis) → conecte ao projeto `fun-site`. A Vercel injeta sozinha as variáveis de ambiente que o `@vercel/kv` precisa — não precisa copiar nada manualmente.

2. **Criar a senha do painel admin**
   Em **Settings → Environment Variables**, adicione:
   - Nome: `ADMIN_KEY`
   - Valor: uma senha forte, só sua (ex: gere uma em https://www.uuidgenerator.net/)

   Aplique em Production (e Preview, se quiser testar antes de publicar).

3. **Instalar a dependência**
   Já deixei o `package.json` com `@vercel/kv`. Ao fazer o deploy, a Vercel instala sozinha. Se for rodar localmente, rode `npm install` antes.

4. **Deploy**
   Suba o projeto normalmente (git push ou `vercel --prod`). Depois disso:
   - O formulário fica em `/cadastro-stand`
   - O painel escondido fica em `/acess-adm` — abre pedindo a senha que você definiu em `ADMIN_KEY`.

## Sobre a "página escondida"

Ela não aparece em nenhum menu e tem `noindex` pra não cair no Google, mas o URL em si não é segredo perfeito — qualquer um que descobrir o endereço só consegue ver os dados se souber a senha (`ADMIN_KEY`). Guarde essa senha com cuidado e troque-a se desconfiar que vazou.
