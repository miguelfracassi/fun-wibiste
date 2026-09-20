// API de inscrições de stand da Expo Fun.
// POST -> salva uma nova inscrição (usado pela página cadastro-stand.html)
// GET  -> lista todas as inscrições (usado pela página escondida /acess-adm),
//         só funciona com o header "x-admin-key" batendo com a env var ADMIN_KEY.
//
// Armazenamento: Upstash Redis (integração nativa da Vercel, Storage → Marketplace → Upstash).
// A integração cria variáveis com prefixo KV_ (compatibilidade com o antigo Vercel KV),
// por isso apontamos o cliente pra elas manualmente em vez de usar Redis.fromEnv().
// Veja o arquivo LEIA-ME-ADMIN.md na raiz do projeto para o passo a passo de configuração.

const { Redis } = require("@upstash/redis");
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const CHAVE_LISTA = "inscricoes-expo-fun";

function limpar(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const body = req.body || {};
    const inscricao = {
      empresa: limpar(body.empresa),
      representante: limpar(body.representante),
      whatsapp: limpar(body.whatsapp),
      email: limpar(body.email),
    };

    if (!inscricao.empresa || !inscricao.representante || !inscricao.whatsapp || !inscricao.email) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    inscricao.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    inscricao.criadoEm = new Date().toISOString();

    try {
      await redis.rpush(CHAVE_LISTA, JSON.stringify(inscricao));
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao salvar inscrição:", err);
      return res.status(500).json({ error: "Erro ao salvar a inscrição." });
    }
  }

  if (req.method === "GET") {
    const chaveEnviada = req.headers["x-admin-key"];
    const chaveEsperada = process.env.ADMIN_KEY;

    if (!chaveEsperada) {
      return res.status(500).json({ error: "ADMIN_KEY não configurada no servidor." });
    }
    if (!chaveEnviada || chaveEnviada !== chaveEsperada) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    try {
      const bruto = await redis.lrange(CHAVE_LISTA, 0, -1);
      const inscricoes = bruto
        .map((item) => {
          try {
            return typeof item === "string" ? JSON.parse(item) : item;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .reverse(); // mais recentes primeiro

      return res.status(200).json({ inscricoes });
    } catch (err) {
      console.error("Erro ao listar inscrições:", err);
      return res.status(500).json({ error: "Erro ao buscar as inscrições." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Método não permitido." });
};
