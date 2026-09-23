var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var newsLang = document.body.dataset.lang || document.documentElement.lang || 'uz';
var newsUI = { uz: { more: "Köproq öqiş", empty: "Yangiliklar hozirça mavjud emas.", eyebrow: "Yangiliklar", title: "Ekspert maqolalari", lead: "Soliq, buxgalteriya va audit böyiça foydali materiallar.", notFound: "Maqola topilmadi.", back: "← Yangiliklarga qaytiş", locale: "uz-UZ" }, ru: { more: "Читать далее", empty: "Новости пока отсутствуют.", eyebrow: "Новости", title: "Экспертные статьи", lead: "Полезные материалы по налогам, бухгалтерии и аудиту.", notFound: "Статья не найдена.", back: "← Вернуться к новостям", locale: "ru-RU" }, en: { more: "Read more", empty: "No news is available yet.", eyebrow: "News", title: "Expert articles", lead: "Useful materials on tax, accounting and audit.", notFound: "Article not found.", back: "← Back to news", locale: "en-US" }, zh: { more: "阅读更多", empty: "暂时没有新闻。", eyebrow: "新闻", title: "专家文章", lead: "有关税务、会计和审计的实用资料。", notFound: "未找到文章。", back: "← 返回新闻", locale: "zh-CN" } };
var T = newsUI[newsLang] || newsUI.uz;
function loadNews() {
    return __awaiter(this, void 0, void 0, function () { var res, data, e_1; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("/api/news?lang=".concat(encodeURIComponent(newsLang)))];
            case 1:
                res = _a.sent();
                if (!res.ok)
                    throw new Error('load');
                return [4 /*yield*/, res.json()];
            case 2:
                data = _a.sent();
                renderHomeNews(data);
                renderNewsPage(data);
                renderArticlePage(data);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                renderHomeNews([]);
                renderNewsPage([]);
                renderArticlePage([]);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    }); });
}
function esc(v) { return String(v || '').replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]); }); }
function card(a) { return "<article class=\"news-card\"><div class=\"news-cover\">".concat(a.image ? "<img src=\"".concat(esc(a.image), "\" alt=\"").concat(esc(a.title), "\" loading=\"lazy\">") : '', "</div><div class=\"news-content\"><div class=\"news-meta\"><span>").concat(esc(a.category), "</span><span>").concat(formatDate(a.date), "</span></div><h3>").concat(esc(a.title), "</h3><p>").concat(esc(a.excerpt || ''), "</p><a class=\"btn outline\" href=\"maqola.html?id=").concat(encodeURIComponent(a.id), "\">").concat(T.more, "</a></div></article>"); }
function formatDate(d) { var dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString(T.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function renderHomeNews(data) { var el = document.getElementById('homeNewsGrid'); if (!el)
    return; var items = data.slice(0, 3); el.innerHTML = items.length ? items.map(card).join('') : "<div class=\"news-loading\">".concat(T.empty, "</div>"); }
function renderNewsPage(data) { var section = document.querySelector('body[data-page="news"] .section'); if (!section)
    return; section.innerHTML = "<div class=\"shell\"><div class=\"section-head\"><div><span class=\"eyebrow\">".concat(T.eyebrow, "</span><h2 class=\"section-title\">").concat(T.title, "</h2><p class=\"lead\">").concat(T.lead, "</p></div></div><div class=\"news-grid\">").concat(data.length ? data.map(card).join('') : "<div class=\"news-loading\">".concat(T.empty, "</div>"), "</div></div>"); }
function renderArticlePage(data) { var root = document.getElementById('articleRoot'); if (!root)
    return; var id = new URLSearchParams(location.search).get('id'); var a = id ? data.find(function (x) { return x.id === id; }) : data[0]; if (!a) {
    root.innerHTML = "<div class=\"shell\"><div class=\"article-card\">".concat(T.notFound, "</div></div>");
    return;
} root.innerHTML = "<div class=\"shell\"><article class=\"article-card\">".concat(a.image ? "<img class=\"article-cover\" src=\"".concat(esc(a.image), "\" alt=\"").concat(esc(a.title), "\">") : '', "<div class=\"news-meta\"><span>").concat(esc(a.category), "</span><span>").concat(formatDate(a.date), "</span></div><h2 class=\"section-title\">").concat(esc(a.title), "</h2><p class=\"lead\">").concat(esc(a.excerpt || ''), "</p>").concat(a.content || '', "<div style=\"margin-top:26px\"><a class=\"btn outline\" href=\"yangiliklar.html\">").concat(T.back, "</a></div></article></div>"); }
loadNews();
