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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var $ = function (id) { return document.getElementById(id); };
var store = null;
var currentSlug = 'info';
var LANGS = ['uz', 'ru', 'en', 'zh'];
var SLUG_LABELS = {
    info: 'Amaldagi info',
    calendar: 'Buxgalter taqvimi',
    workdays: '2026 ish kunlari',
    rent: 'Ijara stavkalari',
    laws: 'Qonun hujjatlar',
    links: 'Foydali linklar'
};
var META_KEYS = new Set(['slug', 'kind', 'title', 'subtitle', 'sourceName', 'sourceUrl', 'langData']);
function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]); }); }
function showMessage(el, text, ok) {
    if (ok === void 0) { ok = false; }
    el.textContent = text || '';
    el.className = 'message ' + (ok ? 'success' : '');
}
function safeStringify(value) { return JSON.stringify(value && typeof value === 'object' ? value : {}, null, 2); }
function parseJsonField(id, label) {
    var _a;
    var text = (((_a = $(id)) === null || _a === void 0 ? void 0 : _a.value) || '').trim();
    if (!text)
        return {};
    try {
        var parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
            throw new Error('JSON obyekt bo‘lishi kerak');
        return parsed;
    }
    catch (e) {
        throw new Error(label + ' JSON bloki noto‘g‘ri: ' + e.message);
    }
}
function basePayload(section) {
    var e_1, _a;
    var copy = JSON.parse(JSON.stringify(section || {}));
    try {
        for (var META_KEYS_1 = __values(META_KEYS), META_KEYS_1_1 = META_KEYS_1.next(); !META_KEYS_1_1.done; META_KEYS_1_1 = META_KEYS_1.next()) {
            var key = META_KEYS_1_1.value;
            delete copy[key];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (META_KEYS_1_1 && !META_KEYS_1_1.done && (_a = META_KEYS_1.return)) _a.call(META_KEYS_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return copy;
}
function isNonEmptyObject(value) { return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0; }
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
                return [4 /*yield*/, loadStore()];
            case 3:
                _a.sent();
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
function checkSession() {
    return __awaiter(this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, api('/api/admin/session')];
            case 1:
                _b.sent();
                showPanel();
                return [4 /*yield*/, loadStore()];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                showLogin();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    }); });
}
function loadStore() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api('/api/admin/useful-custom')];
                case 1:
                    store = _a.sent();
                    renderSectionList();
                    selectSection(currentSlug);
                    return [2 /*return*/];
            }
        });
    });
}
function renderSectionList() {
    var sections = store.sections || {};
    $('sectionList').innerHTML = Object.keys(sections).map(function (slug) { return "<button class=\"useful-admin-item ".concat(slug === currentSlug ? 'active' : '', "\" data-slug=\"").concat(escapeHtml(slug), "\"><strong>").concat(escapeHtml(SLUG_LABELS[slug] || slug), "</strong><span>").concat(escapeHtml(slug), " \u00B7 ").concat(escapeHtml(sections[slug].kind || 'section'), "</span></button>"); }).join('');
    $('sectionList').querySelectorAll('[data-slug]').forEach(function (b) { return b.onclick = function () { return selectSection(b.dataset.slug); }; });
}
function selectSection(slug) {
    currentSlug = slug;
    var d = store.sections[slug];
    if (!d)
        return;
    renderSectionList();
    $('editorTitle').textContent = SLUG_LABELS[slug] || slug;
    $('slug').value = d.slug || slug;
    $('kind').value = d.kind || '';
    $('sourceName').value = d.sourceName || '';
    $('sourceUrl').value = d.sourceUrl || '';
    LANGS.forEach(function (l) {
        var _a, _b;
        $("title_".concat(l)).value = ((_a = d.title) === null || _a === void 0 ? void 0 : _a[l]) || '';
        $("subtitle_".concat(l)).value = ((_b = d.subtitle) === null || _b === void 0 ? void 0 : _b[l]) || '';
    });
    var base = basePayload(d);
    var langData = d.langData && typeof d.langData === 'object' ? d.langData : null;
    LANGS.forEach(function (l) {
        var value = langData && isNonEmptyObject(langData[l]) ? langData[l] : (l === 'uz' ? base : {});
        $("json_".concat(l)).value = safeStringify(value);
    });
    showMessage($('formMessage'), '');
}
function collect() {
    var langData = {};
    LANGS.forEach(function (l) { langData[l] = parseJsonField("json_".concat(l), l.toUpperCase()); });
    var uzData = langData.uz || {};
    var data = __assign(__assign({}, uzData), { slug: $('slug').value.trim() || currentSlug, kind: $('kind').value.trim(), sourceName: $('sourceName').value.trim(), sourceUrl: $('sourceUrl').value.trim(), title: {}, subtitle: {}, langData: langData });
    LANGS.forEach(function (l) { data.title[l] = $("title_".concat(l)).value.trim(); data.subtitle[l] = $("subtitle_".concat(l)).value.trim(); });
    return data;
}
$('sectionForm').addEventListener('submit', function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                showMessage($('formMessage'), 'Saqlanmoqda...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                payload = collect();
                return [4 /*yield*/, api("/api/admin/useful-custom/".concat(encodeURIComponent(currentSlug)), { method: 'PUT', body: JSON.stringify(payload) })];
            case 2:
                _a.sent();
                showMessage($('formMessage'), 'Maʼlumotlar saqlandi. Saytda darhol ko‘rinadi.', true);
                return [4 /*yield*/, loadStore()];
            case 3:
                _a.sent();
                selectSection(payload.slug || currentSlug);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                showMessage($('formMessage'), err_2.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
$('downloadBtn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'allfinance-foydali-malumotlar.json';
    a.click();
    URL.revokeObjectURL(a.href);
});
$('resetBtn').addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!confirm('Foydali maʼlumotlarni boshlang‘ich paketdagi holatga qaytarasizmi?'))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api('/api/admin/useful-custom/reset', { method: 'POST', body: '{}' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, loadStore()];
            case 3:
                _a.sent();
                alert('Boshlang‘ich maʼlumotlar qayta tiklandi.');
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                alert(err_3.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
document.querySelectorAll('[data-lang-tab]').forEach(function (btn) { return btn.addEventListener('click', function () {
    document.querySelectorAll('[data-lang-tab]').forEach(function (x) { return x.classList.toggle('active', x === btn); });
    document.querySelectorAll('[data-lang-panel]').forEach(function (x) { return x.classList.toggle('active', x.dataset.langPanel === btn.dataset.langTab); });
}); });
checkSession();
