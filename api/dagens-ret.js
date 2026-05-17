// Vercel Serverless Function — henter dagens ret fra Notion API.
// Bruger plain fetch (Node 18+) — ingen npm-deps nødvendige.
//
// ENVIRONMENT VARIABLES kræves:
//   NOTION_TOKEN        — integration-token fra https://notion.so/profile/integrations
//   NOTION_DAGENS_DB_ID — 32-tegns database ID fra Notion-URL'en
//
// Returnerer JSON: { dagens: { ret, beskrivelse, pris, billede, dato } | null }
// Returnerer { dagens: null } hvis ingen aktiv ret findes.

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

// === Property readers ===========================================
// Notion's API returnerer kompliceret nested JSON. De her helpers
// pakker det ud til simple værdier.

function readTitle(p) {
  if (!p || !Array.isArray(p.title)) return "";
  return p.title.map((t) => t.plain_text || "").join("");
}

function readRichText(p) {
  if (!p || !Array.isArray(p.rich_text)) return "";
  return p.rich_text.map((t) => t.plain_text || "").join("");
}

function readNumber(p) {
  if (!p || typeof p.number !== "number") return null;
  return p.number;
}

function readCheckbox(p) {
  return !!(p && p.checkbox);
}

function readDate(p) {
  if (!p || !p.date) return null;
  return p.date.start || null;
}

function readFirstFileUrl(p) {
  if (!p || !Array.isArray(p.files) || !p.files.length) return null;
  const f = p.files[0];
  if (f.type === "external") return f.external?.url || null;
  return f.file?.url || null;
}

// === Main handler ===============================================

module.exports = async function handler(req, res) {
  // CORS — tillad fetch fra samme domæne
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DAGENS_DB_ID;

  if (!token) {
    return res.status(500).json({
      error: "NOTION_TOKEN ikke konfigureret",
      hint: "Tjek Vercel Settings → Environment Variables",
    });
  }
  if (!dbId) {
    return res.status(500).json({
      error: "NOTION_DAGENS_DB_ID ikke konfigureret",
      hint: "Tjek Vercel Settings → Environment Variables",
    });
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Aktiv",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Dato", direction: "descending" }],
        page_size: 1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "Notion API fejl",
        status: response.status,
        details: errText.slice(0, 500),
      });
    }

    const data = await response.json();
    const row = data.results && data.results[0];

    if (!row) {
      // Ingen aktiv dagens ret — vis placeholder på frontend
      // Cache i 60s før vi tjekker igen
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ dagens: null });
    }

    const props = row.properties || {};
    const dagens = {
      ret: readTitle(props["Ret"]),
      beskrivelse: readRichText(props["Beskrivelse"]),
      pris: readNumber(props["Pris"]),
      billede: readFirstFileUrl(props["Billede"]),
      dato: readDate(props["Dato"]),
      aktiv: readCheckbox(props["Aktiv"]),
    };

    // Skip rækker uden ret-navn (skulle ikke ske, men sikkerhedsnet)
    if (!dagens.ret) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ dagens: null });
    }

    // Cache ved Vercel edge: 60s frisk, max 5 min stale
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ dagens });
  } catch (e) {
    return res.status(500).json({
      error: "Server-fejl ved Notion-fetch",
      details: e?.message || String(e),
    });
  }
};
