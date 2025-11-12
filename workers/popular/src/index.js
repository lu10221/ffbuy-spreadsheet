// Cloudflare Workers - FFBuy Popular Search Terms
// Endpoints:
// POST /events/search { term }
// GET  /popular?limit=15

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      if (url.pathname === '/events/search' && method === 'POST') {
        return await handleSearchEvent(request, env);
      }
      if (url.pathname === '/popular' && method === 'GET') {
        return await handlePopular(request, env, url);
      }
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: 'Server error', detail: String(e) }, 500);
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders() }
  });
}

async function handleSearchEvent(request, env) {
  const payload = await request.json().catch(() => ({}));
  const raw = (payload.term || '').trim();
  const term = raw.toLowerCase();
  if (!term) return json({ ok: false, error: 'term_required' }, 400);

  const key = `term:${term}`;
  const now = Date.now();
  const existing = await env.POPULAR_TERMS.get(key);
  let doc = existing ? safeParse(existing, { count: 0, lastAt: 0, display: raw || term }) : { count: 0, lastAt: 0, display: raw || term };
  doc.count = (doc.count || 0) + 1;
  doc.lastAt = now;
  if (!doc.display && raw) doc.display = raw;
  await env.POPULAR_TERMS.put(key, JSON.stringify(doc));
  return json({ ok: true });
}

async function handlePopular(request, env, url) {
  const limit = clampInt(url.searchParams.get('limit'), 15, 1, 100);
  // 列出所有 term:* 键并获取内容
  const list = await env.POPULAR_TERMS.list({ prefix: 'term:', limit: 1000 });
  const keys = (list.keys || []).map(k => k.name);
  const values = await Promise.all(keys.map(name => env.POPULAR_TERMS.get(name)));
  const items = [];
  for (let i = 0; i < keys.length; i++) {
    const val = values[i];
    if (!val) continue;
    const doc = safeParse(val, null);
    if (!doc) continue;
    const term = keys[i].slice('term:'.length);
    items.push({ term, count: doc.count || 0, lastAt: doc.lastAt || 0, display: doc.display || term });
  }
  items.sort((a, b) => (b.count - a.count) || (b.lastAt - a.lastAt));
  const top = items.slice(0, limit);
  return json({ terms: top });
}

function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function clampInt(val, def, min, max) {
  const n = parseInt(val, 10);
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}