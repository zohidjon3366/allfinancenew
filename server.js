const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'consult-requests.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const TEAM_FILE = path.join(DATA_DIR, 'team.json');
const MEDIA_DIR = path.join(DATA_DIR, 'media');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const BACKUP_RETENTION_WEEKS = Math.max(2, Number(process.env.BACKUP_RETENTION_WEEKS || 8));
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '');
const ADMIN_SESSION_SECRET = String(process.env.ADMIN_SESSION_SECRET || '');
const SESSION_COOKIE = 'af_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const loginAttempts = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(REQUESTS_FILE)) fs.writeFileSync(REQUESTS_FILE, '[]', 'utf8');
  if (!fs.existsSync(NEWS_FILE)) {
    const fallback = path.join(ROOT, 'data', 'news.json');
    if (fallback !== NEWS_FILE && fs.existsSync(fallback)) fs.copyFileSync(fallback, NEWS_FILE);
    else fs.writeFileSync(NEWS_FILE, '[]', 'utf8');
  }
  if (!fs.existsSync(TEAM_FILE)) {
    const fallback = path.join(ROOT, 'data', 'team.json');
    if (fallback !== TEAM_FILE && fs.existsSync(fallback)) fs.copyFileSync(fallback, TEAM_FILE);
    else fs.writeFileSync(TEAM_FILE, '[]', 'utf8');
  }
}
ensureDataFiles();

function send(res, status, body, type = 'application/json; charset=utf-8', extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...extraHeaders });
  res.end(body);
}

function sendJson(res, status, value, extraHeaders = {}) {
  send(res, status, JSON.stringify(value), 'application/json; charset=utf-8', extraHeaders);
}

function replaceHtmlMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const patterns = {
    title: /<title>.*?<\/title>/is,
    description: /<meta[^>]+name="description"[^>]*>/i,
    ogTitle: /<meta[^>]+property="og:title"[^>]*>/i,
    ogDescription: /<meta[^>]+property="og:description"[^>]*>/i,
    ogUrl: /<meta[^>]+property="og:url"[^>]*>/i,
    ogImage: /<meta[^>]+property="og:image"[^>]*>/i,
    ogType: /<meta[^>]+property="og:type"[^>]*>/i,
    twitterTitle: /<meta[^>]+name="twitter:title"[^>]*>/i,
    twitterDescription: /<meta[^>]+name="twitter:description"[^>]*>/i,
    twitterImage: /<meta[^>]+name="twitter:image"[^>]*>/i
  };
  const tags = {
    title: `<title>${escaped}</title>`,
    description: `<meta name="description" content="${escaped}"/>`,
    ogTitle: `<meta property="og:title" content="${escaped}"/>`,
    ogDescription: `<meta property="og:description" content="${escaped}"/>`,
    ogUrl: `<meta property="og:url" content="${escaped}"/>`,
    ogImage: `<meta property="og:image" content="${escaped}"/>`,
    ogType: `<meta property="og:type" content="${escaped}"/>`,
    twitterTitle: `<meta name="twitter:title" content="${escaped}"/>`,
    twitterDescription: `<meta name="twitter:description" content="${escaped}"/>`,
    twitterImage: `<meta name="twitter:image" content="${escaped}"/>`
  };
  return patterns[selector]?.test(html) ? html.replace(patterns[selector], tags[selector]) : html;
}
function serveArticleHtml(req, res, filePath, url, lang) {
  if (!fs.existsSync(filePath)) return serveFile(res, filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const id = String(url.searchParams.get('id') || '');
  const item = readNews().map(normalizeNewsItem).find(x => x.id === id && x.status !== 'draft' && hasLangTranslation(x, lang));
  if (item) {
    const article = localizedNewsItem(item, lang);
    const publicUrl = `https://allfinance.uz${url.pathname}?id=${encodeURIComponent(id)}`;
    const image = article.image ? `https://allfinance.uz${article.image}` : `https://allfinance.uz/assets/img/og/og-${lang}.jpg`;
    const pageTitle = `${article.title} — ALL FINANCE`;
    html = replaceHtmlMeta(html, 'title', pageTitle);
    html = replaceHtmlMeta(html, 'description', article.excerpt);
    html = replaceHtmlMeta(html, 'ogTitle', pageTitle);
    html = replaceHtmlMeta(html, 'ogDescription', article.excerpt);
    html = replaceHtmlMeta(html, 'ogUrl', publicUrl);
    html = replaceHtmlMeta(html, 'ogImage', image);
    html = replaceHtmlMeta(html, 'ogType', 'article');
    html = replaceHtmlMeta(html, 'twitterTitle', pageTitle);
    html = replaceHtmlMeta(html, 'twitterDescription', article.excerpt);
    html = replaceHtmlMeta(html, 'twitterImage', image);
  }
  return send(res, 200, html, 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache' });
}

function serveFile(res, filePath, status = 200) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const notFound = path.join(ROOT, '404.html');
    if (filePath !== notFound && fs.existsSync(notFound)) return serveFile(res, notFound, 404);
    return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  }
  const ext = path.extname(filePath).toLowerCase();
  const cache = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)
    ? 'public, max-age=3600'
    : 'no-cache';
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
  fs.createReadStream(filePath).pipe(res);
}

function readJsonBody(req, maxBytes = 6_000_000) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
        reject(new Error('REQUEST_TOO_LARGE'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('INVALID_JSON')); }
    });
    req.on('error', reject);
  });
}

function readNews() {
  try {
    const value = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeNews(items) {
  const temp = `${NEWS_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(items, null, 2), 'utf8');
  fs.renameSync(temp, NEWS_FILE);
}

function normalizeTeamItem(item) {
  const baseTranslations = { uz: {}, ru: {}, en: {}, zh: {} };
  const translations = item?.translations || {};
  for (const lang of SUPPORTED_LANGS) {
    const t = translations[lang] || {};
    baseTranslations[lang] = {
      name: String(t.name || '').trim(),
      role: String(t.role || '').trim(),
      experienceText: String(t.experienceText || '').trim(),
      bio: String(t.bio || '').trim()
    };
  }
  return {
    id: String(item?.id || '').trim() || `member-${Date.now()}`,
    order: Number.isFinite(Number(item?.order)) ? Number(item.order) : 100,
    status: item?.status === 'hidden' ? 'hidden' : 'active',
    image: String(item?.image || '').trim(),
    translations: baseTranslations,
    createdAt: item?.createdAt || '',
    updatedAt: item?.updatedAt || ''
  };
}
function readTeam() {
  try {
    const value = JSON.parse(fs.readFileSync(TEAM_FILE, 'utf8'));
    return Array.isArray(value) ? value.map(normalizeTeamItem) : [];
  } catch {
    return [];
  }
}
function writeTeam(items) {
  const temp = `${TEAM_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(items.map(normalizeTeamItem), null, 2), 'utf8');
  fs.renameSync(temp, TEAM_FILE);
}
function teamLangPart(item, lang) {
  const normalized = normalizeTeamItem(item);
  const selected = normalized.translations?.[lang] || {};
  const uz = normalized.translations?.uz || {};
  return {
    name: selected.name || uz.name || '',
    role: selected.role || uz.role || '',
    experienceText: selected.experienceText || uz.experienceText || '',
    bio: selected.bio || uz.bio || ''
  };
}
function localizedTeamItem(item, lang) {
  const normalized = normalizeTeamItem(item);
  return {
    id: normalized.id,
    order: normalized.order,
    image: normalized.image,
    ...teamLangPart(normalized, lang)
  };
}
function validateTeamInput(data, existingId = '') {
  const raw = data.translations || {};
  const translations = {};
  for (const lang of SUPPORTED_LANGS) {
    const part = raw[lang] || {};
    translations[lang] = {
      name: String(part.name || '').trim(),
      role: String(part.role || '').trim(),
      experienceText: String(part.experienceText || '').trim(),
      bio: String(part.bio || '').trim()
    };
  }
  if (!translations.uz.name || translations.uz.name.length < 3) throw new Error('Özbekça F.I.Sh. majburiy');
  if (!translations.uz.role || translations.uz.role.length < 2) throw new Error('Özbekça lavozim majburiy');
  if (!translations.uz.experienceText || translations.uz.experienceText.length < 3) throw new Error('Özbekça tajriba/maʼlumot majburiy');
  for (const lang of SUPPORTED_LANGS) {
    if (translations[lang].name.length > 160) throw new Error(`${lang.toUpperCase()}: F.I.Sh. juda uzun`);
    if (translations[lang].role.length > 120) throw new Error(`${lang.toUpperCase()}: lavozim juda uzun`);
    if (translations[lang].experienceText.length > 800) throw new Error(`${lang.toUpperCase()}: tajriba matni juda uzun`);
    if (translations[lang].bio.length > 1200) throw new Error(`${lang.toUpperCase()}: izoh juda uzun`);
  }
  const order = Number.isFinite(Number(data.order)) ? Number(data.order) : 100;
  const status = data.status === 'hidden' ? 'hidden' : 'active';
  return { id: existingId || slugify(data.id || translations.uz.name), order, status, translations, updatedAt: new Date().toISOString() };
}

function countFilesAndBytes(dir) {
  let files = 0, bytes = 0;
  if (!fs.existsSync(dir)) return { files, bytes };
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = countFilesAndBytes(full); files += nested.files; bytes += nested.bytes;
    } else if (entry.isFile()) {
      files += 1; bytes += fs.statSync(full).size;
    }
  }
  return { files, bytes };
}
function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const full = path.join(BACKUP_DIR, entry.name);
      let manifest = {};
      try { manifest = JSON.parse(fs.readFileSync(path.join(full, 'manifest.json'), 'utf8')); } catch {}
      return { name: entry.name, createdAt: manifest.createdAt || fs.statSync(full).mtime.toISOString(), mediaFiles: manifest.mediaFiles || 0, mediaBytes: manifest.mediaBytes || 0 };
    })
    .sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}
function createFullBackup(force = false) {
  const existing = listBackups();
  if (!force && existing[0]) {
    const age = Date.now() - new Date(existing[0].createdAt).getTime();
    if (Number.isFinite(age) && age < WEEK_MS) return { skipped: true, ...existing[0] };
  }
  const createdAt = new Date();
  const name = createdAt.toISOString().replace(/[:.]/g, '-');
  const temp = path.join(BACKUP_DIR, `.tmp-${name}`);
  const finalDir = path.join(BACKUP_DIR, name);
  fs.rmSync(temp, { recursive: true, force: true });
  fs.mkdirSync(temp, { recursive: true });
  if (fs.existsSync(NEWS_FILE)) fs.copyFileSync(NEWS_FILE, path.join(temp, 'news.json'));
  if (fs.existsSync(TEAM_FILE)) fs.copyFileSync(TEAM_FILE, path.join(temp, 'team.json'));
  if (fs.existsSync(MEDIA_DIR)) fs.cpSync(MEDIA_DIR, path.join(temp, 'media'), { recursive: true });
  const stats = countFilesAndBytes(path.join(temp, 'media'));
  fs.writeFileSync(path.join(temp, 'manifest.json'), JSON.stringify({ createdAt: createdAt.toISOString(), mediaFiles: stats.files, mediaBytes: stats.bytes, newsFile: 'news.json', teamFile: 'team.json' }, null, 2), 'utf8');
  fs.renameSync(temp, finalDir);
  const all = listBackups();
  all.slice(BACKUP_RETENTION_WEEKS).forEach(item => fs.rmSync(path.join(BACKUP_DIR, item.name), { recursive: true, force: true }));
  return { skipped: false, name, createdAt: createdAt.toISOString(), mediaFiles: stats.files, mediaBytes: stats.bytes };
}
function scheduleBackups() {
  const run = () => { try { const result = createFullBackup(false); console.log(result.skipped ? `Backup is current: ${result.name}` : `Weekly backup created: ${result.name}`); } catch (error) { console.error('Backup error:', error); } };
  setTimeout(run, 15_000).unref();
  setInterval(run, 24 * 60 * 60 * 1000).unref();
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function getCookies(req) {
  const out = {};
  const raw = req.headers.cookie || '';
  raw.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > 0) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

function sign(value) {
  return crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(value).digest('base64url');
}

function createSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(18).toString('base64url');
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (!token || !ADMIN_SESSION_SECRET) return false;
  const parts = String(token).split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  if (!safeEqual(parts[2], sign(payload))) return false;
  const expires = Number(parts[0]);
  return Number.isFinite(expires) && expires > Math.floor(Date.now() / 1000);
}

function isAdmin(req) {
  return verifySessionToken(getCookies(req)[SESSION_COOKIE]);
}

function sessionCookie(req, token, maxAge = SESSION_TTL_SECONDS) {
  const forwarded = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  const secure = forwarded === 'https' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { message: 'Avtorizatsiya talab qilinadi' });
    return false;
  }
  return true;
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[’‘ʻʼ']/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90) || `yangilik-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function textToHtml(value) {
  const lines = String(value || '').replace(/\r/g, '').split('\n');
  let html = '';
  let listOpen = false;
  const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (line.startsWith('## ')) {
      closeList(); html += `<h3>${escapeHtml(line.slice(3))}</h3>`;
    } else if (line.startsWith('- ')) {
      if (!listOpen) { html += '<ul>'; listOpen = true; }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else {
      closeList(); html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  closeList();
  return html;
}


const SUPPORTED_LANGS = ['uz','ru','en','zh'];
function normalizeNewsItem(item){
  if(item && item.translations) return item;
  const uz={title:String(item?.title||''),category:String(item?.category||''),excerpt:String(item?.excerpt||''),content:String(item?.content||'')};
  const rest={...item}; delete rest.title; delete rest.category; delete rest.excerpt; delete rest.content;
  return {...rest,translations:{uz,ru:{title:'',category:'',excerpt:'',content:''},en:{title:'',category:'',excerpt:'',content:''},zh:{title:'',category:'',excerpt:'',content:''}}};
}
function hasLangTranslation(item, lang) {
  const normalized = normalizeNewsItem(item);
  const selected = normalized.translations?.[lang] || {};
  return ['title', 'category', 'excerpt', 'content'].every(key => String(selected[key] || '').trim().length > 0);
}
function localizedNewsItem(item,lang){
  const normalized=normalizeNewsItem(item);
  const selected=normalized.translations?.[lang]||{};
  const {translations,...meta}=normalized;
  return {...meta,title:String(selected.title||'').trim(),category:String(selected.category||'').trim(),excerpt:String(selected.excerpt||'').trim(),content:String(selected.content||'').trim()};
}

function validateNewsInput(data, existingId = '') {
  const raw = data.translations || {};
  const translations = {};
  const presentLangs = [];
  for (const lang of SUPPORTED_LANGS) {
    const part = raw[lang] || {};
    const title = String(part.title || '').trim();
    const category = String(part.category || '').trim();
    const excerpt = String(part.excerpt || '').trim();
    const contentText = String(part.contentText || '').trim();
    const hasAny = [title, category, excerpt, contentText].some(v => v.length > 0);
    if (!hasAny) {
      translations[lang] = { title: '', category: '', excerpt: '', content: '' };
      continue;
    }
    if (title.length < 5 || title.length > 180) throw new Error(`${lang.toUpperCase()}: sarlavha 5–180 belgi bölişi kerak`);
    if (category.length < 2 || category.length > 60) throw new Error(`${lang.toUpperCase()}: kategoriya notöğri`);
    if (excerpt.length < 15 || excerpt.length > 500) throw new Error(`${lang.toUpperCase()}: qisqa tavsif 15–500 belgi bölişi kerak`);
    if (contentText.length < 30 || contentText.length > 30000) throw new Error(`${lang.toUpperCase()}: maqola matni 30–30000 belgi bölişi kerak`);
    translations[lang] = { title, category, excerpt, content: textToHtml(contentText) };
    presentLangs.push(lang);
  }
  if (!presentLangs.length) throw new Error('Kamida bitta tilda yangilik matni kiritilişi kerak');
  if (!presentLangs.includes('uz')) throw new Error('Özbek tili bölimi majburiy');
  const date = String(data.date || '').trim();
  const status = data.status === 'draft' ? 'draft' : 'published';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Sana notöğri');
  return { id: existingId || slugify(data.id || translations.uz.title), date, status, translations, updatedAt: new Date().toISOString(), availableLangs: presentLangs };
}

function saveImage(dataUrl, originalName = '') {
  if (!dataUrl) return '';
  const match = String(dataUrl).match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error('Rasm formati PNG, JPG yoki WEBP bölişi kerak');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 3_000_000) throw new Error('Rasm hajmi 3 MB dan oşmasligi kerak');
  const extMap = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' };
  const ext = extMap[match[1]];
  const base = slugify(path.basename(originalName, path.extname(originalName))) || 'news';
  const filename = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}-${base.slice(0, 35)}${ext}`;
  fs.writeFileSync(path.join(MEDIA_DIR, filename), buffer);
  return `/media/${filename}`;
}

function deleteManagedImage(imagePath) {
  if (!String(imagePath || '').startsWith('/media/')) return;
  const filename = path.basename(imagePath);
  const full = path.join(MEDIA_DIR, filename);
  if (full.startsWith(MEDIA_DIR) && fs.existsSync(full)) {
    try { fs.unlinkSync(full); } catch {}
  }
}


const USEFUL_CACHE_FILE = path.join(DATA_DIR, 'useful-cache.json');
const USEFUL_CACHE_TTL_MS = Math.max(10 * 60 * 1000, Number(process.env.USEFUL_CACHE_TTL_MINUTES || 360) * 60 * 1000);
const USEFUL_STATIC_FILE = path.join(ROOT, 'data', 'useful-data.json');
const USEFUL_SOURCES = {
  calendar: { title: 'Buxgalter taqvimi', url: 'https://buxgalterpro.uz/calendar.html' },
  workdays: { title: '2026-yil ish kunlari', url: 'https://buxgalterpro.uz/tools/ish_vaqti_normasi_2026.html' },
  rent: { title: 'Eng kam ijara stavkalari', url: 'https://buxgalterpro.uz/tools/eng_kam_ijara_stavkalari_2026.html' },
  laws: { title: 'Qonun hujjatlar', url: 'https://buxgalterpro.uz/content/lex/lexuz.html' },
  links: { title: 'Foydali linklar', url: 'https://buxgalterpro.uz/' },
  info: { title: 'Amaldagi info', url: 'https://buxgalterpro.uz/' }
};

function readUsefulCache() {
  try { return JSON.parse(fs.readFileSync(USEFUL_CACHE_FILE, 'utf8')); } catch { return {}; }
}
function writeUsefulCache(cache) {
  try { fs.writeFileSync(USEFUL_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8'); } catch {}
}
function htmlDecode(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function normalizeText(value) {
  return htmlDecode(String(value || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/li>/gi, '\n').replace(/<\/h[1-6]>/gi, '\n'))
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function extractAnchors(html, baseUrl) {
  const out = [];
  String(html || '').replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
    const text = normalizeText(label);
    if (!text || text.length > 180) return '';
    try { href = new URL(href, baseUrl).href; } catch {}
    out.push({ text, href });
    return '';
  });
  return out;
}
function usefulFallback(slug) {
  const now = new Date().toISOString();
  const common = { slug, title: USEFUL_SOURCES[slug]?.title || 'Foydali maʼlumot', sourceUrl: USEFUL_SOURCES[slug]?.url || 'https://buxgalterpro.uz/', updatedAt: now, fromCache: false, fallback: true };
  const fallbacks = {
    calendar: { ...common, summary: 'Soliq hisobotlari, to‘lov muddatlari va buxgalter uchun muhim eslatmalar taqvimi.', groups: [{ title: 'Buxgalter taqvimi', items: ['Hisobot muddatlari', 'To‘lov muddatlari', 'Boshqa majburiy eslatmalar'] }] },
    workdays: { ...common, summary: '2026-yil uchun ish kunlari va ish soatlari balansi.', groups: [{ title: '2026-yil ish vaqti', items: ['5 kunlik ish haftasi', '6 kunlik ish haftasi', 'Oylar kesimida ish kuni va ish soati'] }] },
    rent: { ...common, summary: '2026-yil uchun ijara to‘lovining eng kam stavkalari.', groups: [{ title: 'Ijara stavkalari', items: ['Turar joy', 'Noturar joy', 'so‘m/m² / oy'] }] },
    laws: { ...common, summary: 'BHMS, buxgalteriya, soliq, huquq va kadr bo‘yicha asosiy normativ hujjatlar.', groups: [{ title: 'Qonun hujjatlar', items: ['BHMS', 'Buxgalteriya', 'Soliq', 'Huquq', 'Kadr'] }] },
    links: { ...common, summary: 'Buxgalter uchun tezkor foydali havolalar.', groups: [{ title: 'Foydali linklar', links: [{ text: 'mySoliq', href: 'https://my.soliq.uz' }, { text: 'myMehnat', href: 'https://my.mehnat.uz' }, { text: 'CBU', href: 'https://cbu.uz' }] }] },
    info: { ...common, summary: 'Amaldagi asosiy ko‘rsatkichlar.', metrics: [{ label: 'BHM', value: '412 000' }, { label: 'MHEKM', value: '1 271 000' }, { label: 'Asosiy stavka', value: '14 %' }] }
  };
  return fallbacks[slug] || common;
}
function buildUsefulData(slug, html, sourceUrl) {
  const text = normalizeText(html);
  const lines = text.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const anchors = extractAnchors(html, sourceUrl).filter(a => !/telegram|bosh|бош|ўтиш|o‘tish/i.test(a.text)).slice(0, 80);
  const now = new Date().toISOString();
  const base = { slug, title: USEFUL_SOURCES[slug].title, sourceUrl, updatedAt: now, fallback: false };
  if (slug === 'info') {
    const metric = (name, pattern) => {
      const m = text.match(pattern);
      return { label: name, value: m ? m[1].replace(/\s+/g, ' ').trim() : '' };
    };
    const metrics = [
      metric('BHM', /БҲМ\s+([\d\s]+)/i),
      metric('MHEKM', /МҲЭКМ\s+([\d\s]+)/i),
      metric('Asosiy stavka', /Асосий ставка\s+([\d\s.,]+\s*%)/i)
    ].filter(x => x.value);
    const quick = anchors.filter(a => /soliq|mehnat|cbu|nps|faktura|my/i.test(a.href + ' ' + a.text)).slice(0, 12);
    return { ...base, summary: 'BuxgalterPRO manbasidagi amaldagi ko‘rsatkichlar va tezkor havolalar.', metrics: metrics.length ? metrics : usefulFallback('info').metrics, groups: [{ title: 'Tezkor havolalar', links: quick }] };
  }
  if (slug === 'laws') {
    const sections = ['БҲМС','Бухгалтерия','Солиқ','Хуқуқ','Кадр'];
    const groups = sections.map(section => ({
      title: section,
      links: anchors.filter(a => new RegExp(section.slice(0,4), 'i').test(a.text) || (section === 'Солиқ' && /Солиқ|кодекс|ҚҚС/i.test(a.text)) || (section === 'Кадр' && /Меҳнат|Касаба/i.test(a.text))).slice(0, 20)
    })).filter(g => g.links.length);
    return { ...base, summary: 'BHMS, buxgalteriya, soliq, huquq va kadr bo‘yicha lex.uz havolalari.', groups: groups.length ? groups : [{ title: 'Qonun hujjatlar', links: anchors.slice(0, 40) }] };
  }
  if (slug === 'links') {
    const picked = anchors.filter(a => /my\.soliq|my\.mehnat|nps\.xb|cbu\.uz|lex\.uz|buxgalterpro/i.test(a.href)).slice(0, 30);
    const posts = anchors.filter(a => /buxgalterpro\.uz/i.test(a.href)).slice(0, 24);
    return { ...base, summary: 'Buxgalter va rahbar uchun foydali xizmatlar, maqolalar va tezkor havolalar.', groups: [{ title: 'Tezkor havolalar', links: picked }, { title: 'Foydali materiallar', links: posts }] };
  }
  if (slug === 'workdays') {
    const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    const items = [];
    for (const month of months) {
      const idx = lines.findIndex(x => x.toLowerCase() === month.toLowerCase());
      if (idx >= 0) {
        const window = lines.slice(idx, idx + 70).filter(x => /^(\d{1,3}|Х|X|[А-Яа-я]+)$/.test(x)).slice(-8);
        items.push(`${month}: ${window.join(' · ')}`);
      }
    }
    return { ...base, summary: '2026-yil uchun ish kunlari, dam olish kunlari va ish soatlari balansi.', groups: [{ title: 'Oylar kesimidagi ish vaqti normasi', items: items.length ? items : lines.slice(0, 60) }] };
  }
  if (slug === 'rent') {
    return { ...base, summary: 'Mol-mulkni ijaraga beruvchi jismoniy va yuridik shaxslar uchun 2026-yil eng kam ijara stavkalari.', groups: [{ title: 'Ijara turlari', items: lines.filter(x => /турар|нотурар|сўм|м²|ҳудуд|ижара/i.test(x)).slice(0, 30) }] };
  }
  if (slug === 'calendar') {
    const items = lines.filter(x => /ҳисобот|тўлов|муддат|солиқ|бошқа/i.test(x)).slice(0, 80);
    return { ...base, summary: 'Soliq hisobotlari, to‘lov muddatlari va buxgalter uchun muhim eslatmalar.', groups: [{ title: 'Taqvim bo‘limlari', items: items.length ? items : lines.slice(0, 40) }] };
  }
  return { ...base, summary: lines.slice(0, 4).join(' '), groups: [{ title: USEFUL_SOURCES[slug].title, items: lines.slice(0, 40) }] };
}

function readUsefulStatic() {
  try {
    const value = JSON.parse(fs.readFileSync(USEFUL_STATIC_FILE, 'utf8'));
    return Array.isArray(value.items) ? value.items : [];
  } catch {
    return [];
  }
}
function usefulTranslate(value, lang) {
  if (Array.isArray(value)) return value.map(x => usefulTranslate(x, lang));
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    const isLangMap = keys.some(k => SUPPORTED_LANGS.includes(k)) && keys.every(k => SUPPORTED_LANGS.includes(k));
    if (isLangMap) return value[lang] ?? value.uz ?? value.ru ?? value.en ?? value.zh ?? '';
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = usefulTranslate(v, lang);
    return out;
  }
  return value;
}
async function getUsefulData(slug, force = false, lang = 'uz') {
  const items = readUsefulStatic();
  const found = items.find(x => x.slug === slug);
  if (!found) return null;
  let updatedAt = new Date().toISOString();
  try { updatedAt = fs.statSync(USEFUL_STATIC_FILE).mtime.toISOString(); } catch {}
  return { ...usefulTranslate(found, lang), updatedAt, fromCache: false, internal: true };
}


const BUXPRO_ORIGIN = 'https://buxgalterpro.uz';
const BUXPRO_PAGES = {
  calendar: '/calendar.html',
  workdays: '/tools/ish_vaqti_normasi_2026.html',
  rent: '/tools/eng_kam_ijara_stavkalari_2026.html',
  laws: '/content/lex/lexuz.html',
  links: '/'
};

function buxproUrlFor(key) {
  const pathname = BUXPRO_PAGES[key];
  if (!pathname) return '';
  return new URL(pathname, BUXPRO_ORIGIN).href;
}

function isAllowedBuxproUrl(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || ''), BUXPRO_ORIGIN);
    return parsed.origin === BUXPRO_ORIGIN || /(^|\.)buxgalterpro\.uz$/.test(parsed.hostname);
  } catch {
    return false;
  }
}

async function fetchBuxpro(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 ALL-FINANCE-LiveUseful/23',
      'Accept': '*/*',
      'Accept-Language': 'uz-UZ,uz;q=0.9,ru;q=0.8,en;q=0.7'
    }
  });
  const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
  const buffer = Buffer.from(await response.arrayBuffer());
  return { response, contentType, buffer };
}

function buxproErrorHtml(title, sourceUrl, message) {
  return `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
    body{margin:0;font-family:Inter,Arial,sans-serif;background:#f3f8fb;color:#092454}.box{max-width:920px;margin:40px auto;padding:34px;border-radius:28px;background:#fff;border:1px solid #dbe8f6;box-shadow:0 18px 50px rgba(18,59,139,.12)}h1{margin:0 0 10px;font-size:30px;color:#123b8b}.source{display:inline-flex;padding:8px 12px;border-radius:999px;background:#e6f7ef;color:#0d8e57;font-weight:800;margin-top:14px}p{font-size:16px;line-height:1.6}.hint{color:#5b708f}</style></head><body><div class="box"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message || 'Manba saytga vaqtincha ulanib bo‘lmadi.')}</p><p class="hint">Render serverida internet/DNS ulanishi yoki BuxgalterPRO sahifasi vaqtincha javob bermagan bo‘lishi mumkin. Sahifa yangilanganda qayta urinadi.</p><span class="source">${escapeHtml(sourceUrl)}</span></div></body></html>`;
}

function injectBuxproHtml(html, key, sourceUrl) {
  let output = String(html || '');
  output = output.replace(/<script[^>]+src=["'][^"']*googletagmanager[^>]*><\/script>/gi, '');
  output = output.replace(/<script[^>]+src=["'][^"']*google-analytics[^>]*><\/script>/gi, '');
  output = output.replace(/<script[^>]+src=["'][^"']*yandex[^>]*><\/script>/gi, '');

  const injectedHead = `
  <base href="${BUXPRO_ORIGIN}/">
  <style id="allfinance-buxpro-style">
    :root{--af-navy:#123b8b;--af-deep:#08275d;--af-green:#16a66a;--af-line:#dbe7f5;--af-bg:#eef6fa;--af-soft:#f6f9fd;}
    html,body{background:linear-gradient(180deg,#eef7fb 0%,#f8fbff 100%)!important;color:#0a285a!important;font-family:Inter,Arial,"Noto Sans",sans-serif!important;}
    body{margin:0!important;overflow-x:auto!important;}
    body:before{content:"ALL FINANCE live data";position:fixed;right:18px;top:14px;z-index:9999;background:rgba(255,255,255,.86);border:1px solid var(--af-line);border-radius:999px;padding:7px 13px;font:800 12px/1 Inter,Arial;color:var(--af-navy);box-shadow:0 12px 34px rgba(18,59,139,.10);backdrop-filter:blur(8px)}
    a{color:var(--af-navy)!important;text-decoration:none!important}a:hover{color:var(--af-green)!important}
    h1,h2,h3{color:var(--af-navy)!important;letter-spacing:-.02em!important}
    button,.btn,input,select{border-radius:14px!important;font-family:inherit!important}
    input,select{border:1px solid var(--af-line)!important;background:#fff!important;color:#0a285a!important;box-shadow:0 8px 24px rgba(18,59,139,.05)!important}
    button,.btn,[role="button"]{background:linear-gradient(135deg,var(--af-navy),#2468d8)!important;color:#fff!important;border:0!important;box-shadow:0 12px 30px rgba(18,59,139,.16)!important;font-weight:800!important}
    table{border-collapse:separate!important;border-spacing:0!important;background:#fff!important;border:1px solid var(--af-line)!important;border-radius:18px!important;overflow:hidden!important;box-shadow:0 18px 50px rgba(18,59,139,.10)!important;}
    th{background:#eaf2ff!important;color:#456080!important;font-weight:900!important;border-color:#d4e2f1!important;}
    td{background:#fff!important;color:#0a285a!important;border-color:#e7eef7!important;}
    tr:nth-child(even) td{background:#fbfdff!important;}
    .container,.wrapper,.main,.content,main,section{max-width:1240px!important;margin-left:auto!important;margin-right:auto!important;}
    .calendar-card,.month-card,.region-card,.card,.box,.panel{border-radius:22px!important;border-color:var(--af-line)!important;box-shadow:0 16px 46px rgba(18,59,139,.10)!important;}
    footer,.footer,[class*="telegram"],iframe[src*="youtube"],.ads,.ad,[id*="ad" i],[class*="advert" i]{display:none!important;}
    @media(max-width:900px){body:before{display:none}.container,.wrapper,.main,.content,main,section{max-width:100%!important;padding-left:8px!important;padding-right:8px!important}table{font-size:12px!important}}
  </style>
  <script id="allfinance-buxpro-bridge">
  (function(){
    var sourceKey=${JSON.stringify(key)};
    var buxOrigin=${JSON.stringify(BUXPRO_ORIGIN)};
    function mapUrl(value){
      try{
        var u=new URL(value, buxOrigin + '/');
        if(u.hostname==='buxgalterpro.uz' || /\\.buxgalterpro\\.uz$/.test(u.hostname)) return '/buxpro/raw?url=' + encodeURIComponent(u.href);
      }catch(e){}
      return value;
    }
    var oldFetch=window.fetch;
    if(oldFetch){
      window.fetch=function(input, init){
        var url=typeof input==='string'?input:(input&&input.url)||'';
        var mapped=mapUrl(url);
        if(typeof input==='string') return oldFetch(mapped, init);
        try{input=new Request(mapped, input);}catch(e){}
        return oldFetch(input, init);
      };
    }
    var OldXHR=window.XMLHttpRequest;
    if(OldXHR){
      window.XMLHttpRequest=function(){
        var xhr=new OldXHR();
        var oldOpen=xhr.open;
        xhr.open=function(method,url){ arguments[1]=mapUrl(url); return oldOpen.apply(xhr, arguments); };
        return xhr;
      };
    }
    function sendHeight(){
      var d=document.documentElement,b=document.body;
      var h=Math.max(d?d.scrollHeight:0,b?b.scrollHeight:0,d?d.offsetHeight:0,b?b.offsetHeight:0,760);
      parent.postMessage({type:'af-buxpro-height',source:sourceKey,height:h}, '*');
    }
    window.addEventListener('load',function(){setTimeout(sendHeight,100);setTimeout(sendHeight,800);setTimeout(sendHeight,1800);});
    document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a'); if(!a) return; var h=a.getAttribute('href')||''; if(/^https?:/i.test(h)&&h.indexOf('buxgalterpro.uz')<0){a.target='_blank';a.rel='noopener noreferrer';}},true);
    setInterval(sendHeight,1200);
  })();
  </script>`;
  if (/<head[^>]*>/i.test(output)) output = output.replace(/<head([^>]*)>/i, `<head$1>${injectedHead}`);
  else output = `<!doctype html><html><head>${injectedHead}</head><body>${output}</body></html>`;
  return output;
}

async function serveBuxproPage(res, key) {
  const sourceUrl = buxproUrlFor(key);
  if (!sourceUrl) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  try {
    const { response, contentType, buffer } = await fetchBuxpro(sourceUrl);
    if (!response.ok) throw new Error(`BuxgalterPRO ${response.status}`);
    const html = buffer.toString('utf8');
    return send(res, 200, injectBuxproHtml(html, key, sourceUrl), 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache, no-store, must-revalidate' });
  } catch (error) {
    return send(res, 200, buxproErrorHtml(USEFUL_SOURCES[key]?.title || 'Foydali maʼlumot', sourceUrl, error.message), 'text/html; charset=utf-8', { 'Cache-Control': 'no-cache, no-store, must-revalidate' });
  }
}

async function serveBuxproRaw(req, res, url) {
  const raw = url.searchParams.get('url') || '';
  if (!isAllowedBuxproUrl(raw)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  try {
    const { response, contentType, buffer } = await fetchBuxpro(raw);
    return send(res, response.ok ? 200 : response.status, buffer, contentType, { 'Cache-Control': 'public, max-age=900' });
  } catch (error) {
    return send(res, 502, `BuxgalterPRO proxy error: ${error.message}`, 'text/plain; charset=utf-8');
  }
}

async function sendTelegram(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return true;
  const text = [
    '📩 Yangi murojaat', '',
    `👤 Ism: ${data.name || '-'}`,
    `📞 Telefon: ${data.phone || '-'}`,
    `🏢 Korxona: ${data.company || '-'}`,
    `🧾 Xizmat: ${data.service || '-'}`,
    `💬 Izoh: ${data.comment || '-'}`
  ].join('\n');
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  return response.ok;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === '/health') return sendJson(res, 200, { ok: true, service: 'allfinanceuz' });


    const buxproToolMatch = pathname.match(/^\/buxpro\/(calendar|workdays|rent|laws|links)$/);
    if (buxproToolMatch && req.method === 'GET') return serveBuxproPage(res, buxproToolMatch[1]);
    if (pathname === '/buxpro/raw' && req.method === 'GET') return serveBuxproRaw(req, res, url);



    if (pathname === '/api/team' && req.method === 'GET') {
      const lang = SUPPORTED_LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'uz';
      const members = readTeam()
        .filter(item => item.status !== 'hidden')
        .sort((a, b) => Number(a.order || 100) - Number(b.order || 100))
        .map(item => localizedTeamItem(item, lang))
        .filter(item => item.name && item.role);
      return sendJson(res, 200, members);
    }

    if (pathname === '/api/useful' && req.method === 'GET') {
      const lang = SUPPORTED_LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'uz';
      const slugs = readUsefulStatic().map(x => x.slug);
      const items = await Promise.all(slugs.map(slug => getUsefulData(slug, false, lang)));
      return sendJson(res, 200, items.filter(Boolean));
    }

    const usefulMatch = pathname.match(/^\/api\/useful\/([a-z0-9-]+)$/);
    if (usefulMatch && req.method === 'GET') {
      const lang = SUPPORTED_LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'uz';
      const slug = usefulMatch[1];
      const data = await getUsefulData(slug, url.searchParams.get('refresh') === '1', lang);
      if (!data) return sendJson(res, 404, { message: 'Foydali bo‘lim topilmadi' });
      return sendJson(res, 200, data);
    }

    if (pathname === '/api/news' && req.method === 'GET') {
      const lang = SUPPORTED_LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'uz';
      const news = readNews()
        .map(normalizeNewsItem)
        .filter(item => item.status !== 'draft')
        .filter(item => hasLangTranslation(item, lang))
        .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
        .map(item=>localizedNewsItem(item,lang));
      return sendJson(res, 200, news);
    }

    if (pathname === '/api/consult' && req.method === 'POST') {
      const data = await readJsonBody(req, 1_000_000);
      data.createdAt = new Date().toISOString();
      let requests = [];
      try { requests = JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8')); } catch {}
      requests.push(data);
      fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf8');
      const sent = await sendTelegram(data);
      if (!sent) return sendJson(res, 502, { message: 'Telegramga yuborilmadi' });
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/login' && req.method === 'POST') {
      if (!ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) {
        return sendJson(res, 503, { message: 'Render Environmentʼda ADMIN_PASSWORD va ADMIN_SESSION_SECRET sozlanmagan' });
      }
      const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
      const state = loginAttempts.get(ip) || { count: 0, until: 0 };
      if (state.until > Date.now()) return sendJson(res, 429, { message: 'Köp uriniş. 15 daqiqadan keyin qayta urinib köring' });
      const data = await readJsonBody(req, 50_000);
      if (!safeEqual(String(data.password || ''), ADMIN_PASSWORD)) {
        state.count += 1;
        if (state.count >= 5) { state.until = Date.now() + 15 * 60 * 1000; state.count = 0; }
        loginAttempts.set(ip, state);
        return sendJson(res, 401, { message: 'Parol notöğri' });
      }
      loginAttempts.delete(ip);
      const token = createSessionToken();
      return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, token) });
    }

    if (pathname === '/api/admin/logout' && req.method === 'POST') {
      return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, '', 0) });
    }

    if (pathname === '/api/admin/session' && req.method === 'GET') {
      return sendJson(res, isAdmin(req) ? 200 : 401, { authenticated: isAdmin(req) });
    }


    if (pathname === '/api/admin/team' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const members = readTeam().sort((a, b) => Number(a.order || 100) - Number(b.order || 100));
      return sendJson(res, 200, members);
    }

    if (pathname === '/api/admin/team' && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const data = await readJsonBody(req);
      const team = readTeam();
      const item = validateTeamInput(data);
      let id = item.id;
      let suffix = 2;
      while (team.some(x => x.id === id)) id = `${item.id}-${suffix++}`;
      item.id = id;
      item.createdAt = new Date().toISOString();
      item.image = data.imageData ? saveImage(data.imageData, data.imageName || `${id}.webp`) : '';
      team.push(item);
      writeTeam(team);
      return sendJson(res, 201, item);
    }

    const adminTeamMatch = pathname.match(/^\/api\/admin\/team\/([^/]+)$/);
    if (adminTeamMatch && req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const id = adminTeamMatch[1];
      const data = await readJsonBody(req);
      const team = readTeam();
      const index = team.findIndex(x => x.id === id);
      if (index < 0) return sendJson(res, 404, { message: 'Xodim topilmadi' });
      const old = team[index];
      const item = validateTeamInput(data, id);
      item.createdAt = old.createdAt || new Date().toISOString();
      item.image = old.image || '';
      if (data.removeImage) {
        deleteManagedImage(item.image);
        item.image = '';
      }
      if (data.imageData) {
        deleteManagedImage(item.image);
        item.image = saveImage(data.imageData, data.imageName || `${id}.webp`);
      }
      team[index] = item;
      writeTeam(team);
      return sendJson(res, 200, item);
    }

    if (adminTeamMatch && req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      const id = adminTeamMatch[1];
      const team = readTeam();
      const index = team.findIndex(x => x.id === id);
      if (index < 0) return sendJson(res, 404, { message: 'Xodim topilmadi' });
      const [removed] = team.splice(index, 1);
      deleteManagedImage(removed.image);
      writeTeam(team);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/news' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      const news = readNews().map(normalizeNewsItem).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      return sendJson(res, 200, news);
    }

    if (pathname === '/api/admin/news/export' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      return send(res, 200, fs.readFileSync(NEWS_FILE), 'application/json; charset=utf-8', {
        'Content-Disposition': `attachment; filename="allfinance-news-${new Date().toISOString().slice(0, 10)}.json"`
      });
    }


    if (pathname === '/api/admin/backups' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      return sendJson(res, 200, listBackups());
    }

    if (pathname === '/api/admin/backups/run' && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      return sendJson(res, 201, createFullBackup(true));
    }

    if (pathname === '/api/admin/news' && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const data = await readJsonBody(req);
      const news = readNews();
      const item = validateNewsInput(data);
      let id = item.id;
      let suffix = 2;
      while (news.some(x => x.id === id)) id = `${item.id}-${suffix++}`;
      item.id = id;
      item.createdAt = new Date().toISOString();
      item.image = data.imageData ? saveImage(data.imageData, data.imageName) : '';
      news.unshift(item);
      writeNews(news);
      return sendJson(res, 201, item);
    }

    const adminNewsMatch = pathname.match(/^\/api\/admin\/news\/([^/]+)$/);
    if (adminNewsMatch && req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const id = adminNewsMatch[1];
      const data = await readJsonBody(req);
      const news = readNews();
      const index = news.findIndex(x => x.id === id);
      if (index < 0) return sendJson(res, 404, { message: 'Yangilik topilmadi' });
      const old = news[index];
      const item = validateNewsInput(data, id);
      item.createdAt = old.createdAt || new Date().toISOString();
      item.image = old.image || '';
      if (data.removeImage) {
        deleteManagedImage(item.image);
        item.image = '';
      }
      if (data.imageData) {
        deleteManagedImage(item.image);
        item.image = saveImage(data.imageData, data.imageName);
      }
      news[index] = item;
      writeNews(news);
      return sendJson(res, 200, item);
    }

    if (adminNewsMatch && req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      const id = adminNewsMatch[1];
      const news = readNews();
      const index = news.findIndex(x => x.id === id);
      if (index < 0) return sendJson(res, 404, { message: 'Yangilik topilmadi' });
      const [removed] = news.splice(index, 1);
      deleteManagedImage(removed.image);
      writeNews(news);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname.startsWith('/api/')) return sendJson(res, 404, { message: 'API endpoint topilmadi' });

    if (pathname.startsWith('/media/')) {
      const filename = path.basename(pathname);
      return serveFile(res, path.join(MEDIA_DIR, filename));
    }

    const requested = pathname === '/' ? '/index.html' : pathname;
    const target = path.normalize(path.join(ROOT, requested));
    if (!target.startsWith(ROOT)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    if (pathname.endsWith('/maqola.html') || pathname === '/maqola.html') {
      const lang = pathname.startsWith('/ru/') ? 'ru' : pathname.startsWith('/en/') ? 'en' : pathname.startsWith('/zh/') ? 'zh' : 'uz';
      return serveArticleHtml(req, res, target, url, lang);
    }
    return serveFile(res, target);
  } catch (error) {
    console.error(error);
    const message = error.message === 'REQUEST_TOO_LARGE' ? 'Fayl yoki sörov hajmi juda katta' :
      error.message === 'INVALID_JSON' ? 'Notöğri sörov formati' : error.message || 'Server xatosi';
    return sendJson(res, error.message === 'REQUEST_TOO_LARGE' ? 413 : 500, { message });
  }
});

server.listen(PORT, '0.0.0.0', () => { console.log(`ALL FINANCE running on port ${PORT}`); scheduleBackups(); });
