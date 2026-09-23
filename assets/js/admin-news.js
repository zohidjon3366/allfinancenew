var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _a;
var $ = function (id) { return document.getElementById(id); };
var LANGS = ['uz', 'ru', 'en', 'zh'];
var LANG_LABELS = { uz: 'UZ', ru: 'RU', en: 'EN', zh: '中文' };
var allNews = [];
var imageData = '';
var imageName = '';
var removeImage = false;
function showMessage(el, text, success) {
    if (success === void 0) { success = false; }
    el.textContent = text || '';
    el.classList.toggle('success', success);
}
function today() { return new Date().toISOString().slice(0, 10); }
function escapeHtml(v) { return String(v || '').replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]); }); }
function htmlToText(value) {
    var div = document.createElement('div');
    div.innerHTML = value || '';
    div.querySelectorAll('h1,h2,h3,h4').forEach(function (el) { return el.replaceWith(document.createTextNode("\n## ".concat(el.textContent.trim(), "\n"))); });
    div.querySelectorAll('li').forEach(function (el) { return el.replaceWith(document.createTextNode("\n- ".concat(el.textContent.trim()))); });
    div.querySelectorAll('p').forEach(function (el) { return el.append(document.createTextNode('\n\n')); });
    return div.textContent.replace(/\n{3,}/g, '\n\n').trim();
}
function textToPreviewHtml(value) {
    var lines = String(value || '').replace(/\r/g, '').split('\n');
    var out = '', list = false;
    var close = function () { if (list) {
        out += '</ul>';
        list = false;
    } };
    lines.forEach(function (raw) {
        var line = raw.trim();
        if (!line) {
            close();
            return;
        }
        if (line.startsWith('## ')) {
            close();
            out += "<h3>".concat(escapeHtml(line.slice(3)), "</h3>");
        }
        else if (line.startsWith('- ')) {
            if (!list) {
                out += '<ul>';
                list = true;
            }
            out += "<li>".concat(escapeHtml(line.slice(2)), "</li>");
        }
        else {
            close();
            out += "<p>".concat(escapeHtml(line), "</p>");
        }
    });
    close();
    return out;
}
function api(url_1) {
    return __awaiter(this, arguments, void 0, function (url, options) {
        var res, data, _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url, __assign({ headers: __assign({ 'Content-Type': 'application/json' }, (options.headers || {})) }, options))];
                case 1:
                    res = _b.sent();
                    data = {};
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (res.status === 401) {
                        showLogin();
                        throw new Error(data.message || 'Sessiya tugadi');
                    }
                    if (!res.ok)
                        throw new Error(data.message || 'Xatolik yuz berdi');
                    return [2 /*return*/, data];
            }
        });
    });
}
function showLogin() { $('loginView').classList.remove('hidden'); $('panelView').classList.add('hidden'); }
function showPanel() { $('loginView').classList.add('hidden'); $('panelView').classList.remove('hidden'); }
function checkSession() {
    return __awaiter(this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, api('/api/admin/session')];
            case 1:
                _b.sent();
                showPanel();
                return [4 /*yield*/, loadNews()];
            case 2:
                _b.sent();
                resetForm();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                showLogin();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    }); });
}
$('loginForm').addEventListener('submit', function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                showMessage($('loginMessage'), '');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: $('password').value }) })];
            case 2:
                _a.sent();
                $('password').value = '';
                showPanel();
                return [4 /*yield*/, loadNews()];
            case 3:
                _a.sent();
                resetForm();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                showMessage($('loginMessage'), err_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
$('logoutBtn').addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0:
            _a.trys.push([0, , 2, 3]);
            return [4 /*yield*/, api('/api/admin/logout', { method: 'POST', body: '{}' })];
        case 1:
            _a.sent();
            return [3 /*break*/, 3];
        case 2:
            showLogin();
            return [7 /*endfinally*/];
        case 3: return [2 /*return*/];
    }
}); }); });
$('exportBtn').addEventListener('click', function () { return location.href = '/api/admin/news/export'; });
(_a = $('fullBackupBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var btn, old, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                btn = $('fullBackupBtn');
                old = btn.textContent;
                btn.disabled = true;
                btn.textContent = 'Backup...';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, api('/api/admin/backups/run', { method: 'POST', body: '{}' })];
            case 2:
                result = _a.sent();
                alert("T\u00F6liq backup yaratildi: ".concat(result.name));
                return [3 /*break*/, 5];
            case 3:
                err_2 = _a.sent();
                alert(err_2.message);
                return [3 /*break*/, 5];
            case 4:
                btn.disabled = false;
                btn.textContent = old;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
$('newBtn').addEventListener('click', resetForm);
$('searchInput').addEventListener('input', renderList);
$('statusFilter').addEventListener('change', renderList);
document.querySelectorAll('[data-lang-tab]').forEach(function (btn) { return btn.addEventListener('click', function () {
    document.querySelectorAll('[data-lang-tab]').forEach(function (x) { return x.classList.toggle('active', x === btn); });
    document.querySelectorAll('[data-lang-panel]').forEach(function (x) { return x.classList.toggle('active', x.dataset.langPanel === btn.dataset.langTab); });
}); });
function loadNews() {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api('/api/admin/news')];
            case 1:
                allNews = _a.sent();
                renderList();
                return [2 /*return*/];
        }
    }); });
}
function tr(n, l) {
    var _a;
    if (l === void 0) { l = 'uz'; }
    return ((_a = n.translations) === null || _a === void 0 ? void 0 : _a[l]) || {};
}
function translationState(n, l) {
    var t = tr(n, l);
    var values = [t.title, t.category, t.excerpt, t.content].map(function (v) { return String(v || '').trim(); });
    if (values.every(Boolean))
        return 'complete';
    if (values.some(Boolean))
        return 'partial';
    return 'missing';
}
function languageBadges(n) {
    return "<div class=\"lang-status-badges\">".concat(LANGS.map(function (l) {
        var state = translationState(n, l);
        var title = state === 'complete' ? 'Töliq' : state === 'partial' ? 'Qisman' : 'Kiritilmagan';
        return "<span class=\"lang-status ".concat(state, " lang-").concat(l, "\" title=\"").concat(title, "\">").concat(LANG_LABELS[l], "</span>");
    }).join(''), "</div>");
}
function renderList() {
    var q = $('searchInput').value.trim().toLowerCase(), status = $('statusFilter').value;
    var items = allNews.filter(function (n) {
        var allText = LANGS.map(function (l) { var t = tr(n, l); return "".concat(t.title || '', " ").concat(t.category || ''); }).join(' ').toLowerCase();
        return (status === 'all' || (n.status || 'published') === status) && (!q || allText.includes(q));
    });
    $('newsCount').textContent = allNews.length;
    $('newsList').innerHTML = items.length ? items.map(function (n) {
        var u = tr(n);
        var fallbackTitle = LANGS.map(function (l) { return tr(n, l).title; }).find(Boolean) || 'Sarlavhasiz';
        return "<article class=\"news-item ".concat($('editingId').value === n.id ? 'active' : '', "\"><div class=\"news-item-top\"><div><span class=\"eyebrow\">").concat(escapeHtml(u.category || 'Yangilik'), "</span><h3>").concat(escapeHtml(u.title || fallbackTitle), "</h3></div><span class=\"status-chip ").concat(n.status || 'published', "\">").concat((n.status || 'published') === 'draft' ? 'Qoralama' : 'Naşr qilingan', "</span></div><p>").concat(escapeHtml(n.date), "</p>").concat(languageBadges(n), "<div class=\"item-actions\"><button data-edit=\"").concat(escapeHtml(n.id), "\">Tahrirla\u015F</button><button class=\"delete\" data-delete=\"").concat(escapeHtml(n.id), "\">\u00D6\u00E7iri\u015F</button></div></article>");
    }).join('') : '<div class="news-item"><p>Yangilik topilmadi.</p></div>';
    $('newsList').querySelectorAll('[data-edit]').forEach(function (b) { return b.onclick = function () { return editNews(b.dataset.edit); }; });
    $('newsList').querySelectorAll('[data-delete]').forEach(function (b) { return b.onclick = function () { return deleteNews(b.dataset.delete); }; });
}
function resetForm() {
    $('newsForm').reset();
    $('editingId').value = '';
    $('formTitle').textContent = 'Yangi yangilik';
    $('date').value = today();
    $('status').value = 'published';
    imageData = '';
    imageName = '';
    removeImage = false;
    $('imagePreviewWrap').classList.add('hidden');
    $('imagePreview').removeAttribute('src');
    $('compressionInfo').textContent = '';
    showMessage($('formMessage'), '');
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function editNews(id) {
    var n = allNews.find(function (x) { return x.id === id; });
    if (!n)
        return;
    $('editingId').value = n.id;
    $('formTitle').textContent = 'Yangilikni tahrirlaş';
    $('date').value = n.date || today();
    $('status').value = n.status || 'published';
    LANGS.forEach(function (l) { var x = tr(n, l); $("title_".concat(l)).value = x.title || ''; $("category_".concat(l)).value = x.category || ''; $("excerpt_".concat(l)).value = x.excerpt || ''; $("contentText_".concat(l)).value = htmlToText(x.content || ''); });
    imageData = '';
    imageName = '';
    removeImage = false;
    $('compressionInfo').textContent = '';
    if (n.image) {
        $('imagePreview').src = n.image;
        $('imagePreviewWrap').classList.remove('hidden');
    }
    else
        $('imagePreviewWrap').classList.add('hidden');
    showMessage($('formMessage'), '');
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function readBlobAsDataURL(blob) { return new Promise(function (resolve, reject) { var r = new FileReader(); r.onload = function () { return resolve(r.result); }; r.onerror = reject; r.readAsDataURL(blob); }); }
function compressImageFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var bitmap, _a, maxW, maxH, scale, width, height, canvas, ctx, quality, blob;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (file.size > 10000000)
                        throw new Error('Rasm hajmi 10 MB dan oşmasligi kerak');
                    if (!('createImageBitmap' in window)) return [3 /*break*/, 2];
                    return [4 /*yield*/, createImageBitmap(file)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new Promise(function (resolve, reject) { var img = new Image(); img.onload = function () { return resolve(img); }; img.onerror = reject; img.src = URL.createObjectURL(file); })];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    bitmap = _a;
                    maxW = 1600, maxH = 1200;
                    scale = Math.min(1, maxW / bitmap.width, maxH / bitmap.height);
                    width = Math.max(1, Math.round(bitmap.width * scale)), height = Math.max(1, Math.round(bitmap.height * scale));
                    canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    ctx = canvas.getContext('2d', { alpha: false });
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(bitmap, 0, 0, width, height);
                    if (bitmap.close)
                        bitmap.close();
                    quality = .84;
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve, 'image/webp', quality); })];
                case 5:
                    blob = _c.sent();
                    _c.label = 6;
                case 6:
                    if (!(blob && blob.size > 1800000 && quality > .55)) return [3 /*break*/, 8];
                    quality -= .08;
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve, 'image/webp', quality); })];
                case 7:
                    blob = _c.sent();
                    return [3 /*break*/, 6];
                case 8:
                    if (!!blob) return [3 /*break*/, 10];
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve, 'image/jpeg', .82); })];
                case 9:
                    blob = _c.sent();
                    _c.label = 10;
                case 10:
                    if (!blob)
                        throw new Error('Rasmni siqib bölmadi');
                    _b = {};
                    return [4 /*yield*/, readBlobAsDataURL(blob)];
                case 11: return [2 /*return*/, (_b.data = _c.sent(), _b.name = (file.name.replace(/\.[^.]+$/, '') || 'news') + '.webp', _b.size = blob.size, _b.width = width, _b.height = height, _b)];
            }
        });
    });
}
$('imageFile').addEventListener('change', function () { return __awaiter(void 0, void 0, void 0, function () {
    var f, compressed, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f = $('imageFile').files[0];
                if (!f)
                    return [2 /*return*/];
                showMessage($('formMessage'), 'Rasm siqilmoqda...');
                $('compressionInfo').textContent = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, compressImageFile(f)];
            case 2:
                compressed = _a.sent();
                imageData = compressed.data;
                imageName = compressed.name;
                removeImage = false;
                $('imagePreview').src = imageData;
                $('imagePreviewWrap').classList.remove('hidden');
                $('compressionInfo').textContent = "".concat((f.size / 1024 / 1024).toFixed(2), " MB \u2192 ").concat((compressed.size / 1024 / 1024).toFixed(2), " MB \u00B7 ").concat(compressed.width, "\u00D7").concat(compressed.height);
                showMessage($('formMessage'), 'Rasm avtomatik siqildi.', true);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                showMessage($('formMessage'), err_3.message);
                $('imageFile').value = '';
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
$('removeImageBtn').addEventListener('click', function () { imageData = ''; imageName = ''; removeImage = true; $('imageFile').value = ''; $('imagePreviewWrap').classList.add('hidden'); $('compressionInfo').textContent = ''; });
$('newsForm').addEventListener('submit', function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var id, translations, payload, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                id = $('editingId').value;
                translations = {};
                LANGS.forEach(function (l) { return translations[l] = { title: $("title_".concat(l)).value, category: $("category_".concat(l)).value, excerpt: $("excerpt_".concat(l)).value, contentText: $("contentText_".concat(l)).value }; });
                payload = { date: $('date').value, status: $('status').value, translations: translations, imageData: imageData, imageName: imageName, removeImage: removeImage };
                showMessage($('formMessage'), 'Saqlanmoqda...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api(id ? "/api/admin/news/".concat(encodeURIComponent(id)) : '/api/admin/news', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })];
            case 2:
                _a.sent();
                showMessage($('formMessage'), 'Yangilik muvaffaqiyatli saqlandi.', true);
                return [4 /*yield*/, loadNews()];
            case 3:
                _a.sent();
                if (!id)
                    resetForm();
                else
                    editNews(id);
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                showMessage($('formMessage'), err_4.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function deleteNews(id) {
    return __awaiter(this, void 0, void 0, function () { var n, u, err_5; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                n = allNews.find(function (x) { return x.id === id; }), u = tr(n);
                if (!n || !confirm("\u201C".concat(u.title || id, "\u201D yangiligini \u00F6\u00E7irasizmi?")))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api("/api/admin/news/".concat(encodeURIComponent(id)), { method: 'DELETE' })];
            case 2:
                _a.sent();
                if ($('editingId').value === id)
                    resetForm();
                return [4 /*yield*/, loadNews()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_5 = _a.sent();
                alert(err_5.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    }); });
}
$('previewBtn').addEventListener('click', function () { var _a; var active = ((_a = document.querySelector('[data-lang-tab].active')) === null || _a === void 0 ? void 0 : _a.dataset.langTab) || 'uz'; $('previewArticle').innerHTML = "<div class=\"eyebrow\">".concat(escapeHtml($("category_".concat(active)).value || 'Category'), " \u00B7 ").concat(escapeHtml($('date').value || today()), "</div><h1>").concat(escapeHtml($("title_".concat(active)).value || 'Title'), "</h1><p class=\"lead\">").concat(escapeHtml($("excerpt_".concat(active)).value || 'Short description'), "</p>").concat(textToPreviewHtml($("contentText_".concat(active)).value)); $('previewDialog').showModal(); });
$('closePreview').addEventListener('click', function () { return $('previewDialog').close(); });
checkSession();
