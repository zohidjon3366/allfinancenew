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
var $ = function (id) { return document.getElementById(id); };
var LANGS = ['uz', 'ru', 'en', 'zh'];
var LANG_LABELS = { uz: 'UZ', ru: 'RU', en: 'EN', zh: 'ZH' };
var members = [];
var imageData = '';
var imageName = '';
var removeImage = false;
function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]); }); }
function showMessage(el, text, ok) {
    if (ok === void 0) { ok = false; }
    el.textContent = text || '';
    el.className = 'message ' + (ok ? 'success' : '');
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
                return [4 /*yield*/, loadTeam()];
            case 2:
                _b.sent();
                resetForm(false);
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
                return [4 /*yield*/, loadTeam()];
            case 3:
                _a.sent();
                resetForm(false);
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
$('newBtn').addEventListener('click', function () { return resetForm(true); });
$('searchInput').addEventListener('input', renderList);
$('statusFilter').addEventListener('change', renderList);
document.querySelectorAll('[data-lang-tab]').forEach(function (btn) { return btn.addEventListener('click', function () {
    document.querySelectorAll('[data-lang-tab]').forEach(function (x) { return x.classList.toggle('active', x === btn); });
    document.querySelectorAll('[data-lang-panel]').forEach(function (x) { return x.classList.toggle('active', x.dataset.langPanel === btn.dataset.langTab); });
}); });
function tr(item, lang) {
    var _a;
    if (lang === void 0) { lang = 'uz'; }
    return ((_a = item.translations) === null || _a === void 0 ? void 0 : _a[lang]) || {};
}
function state(item, lang) { var t = tr(item, lang); var vals = [t.name, t.role, t.experienceText].map(function (v) { return String(v || '').trim(); }); if (vals.every(Boolean))
    return 'complete'; if (vals.some(Boolean))
    return 'partial'; return 'missing'; }
function badges(item) { return "<div class=\"lang-status-badges\">".concat(LANGS.map(function (l) { return "<span class=\"lang-status ".concat(state(item, l), " lang-").concat(l, "\">").concat(LANG_LABELS[l], "</span>"); }).join(''), "</div>"); }
function loadTeam() {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api('/api/admin/team')];
            case 1:
                members = _a.sent();
                renderList();
                return [2 /*return*/];
        }
    }); });
}
function renderList() {
    var q = $('searchInput').value.trim().toLowerCase();
    var status = $('statusFilter').value;
    var filtered = members.filter(function (m) {
        var all = LANGS.map(function (l) { var t = tr(m, l); return "".concat(t.name || '', " ").concat(t.role || '', " ").concat(t.experienceText || ''); }).join(' ').toLowerCase();
        return (status === 'all' || (m.status || 'active') === status) && (!q || all.includes(q));
    }).sort(function (a, b) { return Number(a.order || 100) - Number(b.order || 100); });
    $('teamCount').textContent = members.length;
    $('teamList').innerHTML = filtered.length ? filtered.map(function (m) {
        var u = tr(m);
        var title = u.name || m.id;
        var role = u.role || '';
        var img = m.image ? "<img class=\"team-mini-photo\" src=\"".concat(escapeHtml(m.image), "\" alt=\"").concat(escapeHtml(title), "\">") : '<span class="team-mini-photo placeholder">?</span>';
        return "<article class=\"news-item ".concat($('editingId').value === m.id ? 'active' : '', "\">\n      <div class=\"news-item-top team-admin-top\"><div class=\"team-admin-mini\">").concat(img, "<div><span class=\"eyebrow\">#").concat(escapeHtml(m.order || 100), " \u00B7 ").concat((m.status || 'active') === 'hidden' ? 'Yashirilgan' : 'Faol', "</span><h3>").concat(escapeHtml(title), "</h3><p>").concat(escapeHtml(role), "</p></div></div><span class=\"status-chip ").concat(m.status === 'hidden' ? 'draft' : 'published', "\">").concat(m.status === 'hidden' ? 'Yashirilgan' : 'Ko‘rinadi', "</span></div>\n      ").concat(badges(m), "\n      <div class=\"item-actions\"><button data-edit=\"").concat(escapeHtml(m.id), "\">Tahrirla\u015F</button><button class=\"delete\" data-delete=\"").concat(escapeHtml(m.id), "\">\u00D6\u00E7iri\u015F</button></div>\n    </article>");
    }).join('') : '<div class="news-item"><p>Xodim topilmadi.</p></div>';
    $('teamList').querySelectorAll('[data-edit]').forEach(function (b) { return b.onclick = function () { return editMember(b.dataset.edit); }; });
    $('teamList').querySelectorAll('[data-delete]').forEach(function (b) { return b.onclick = function () { return deleteMember(b.dataset.delete); }; });
}
function resetForm(scroll) {
    if (scroll === void 0) { scroll = true; }
    $('teamForm').reset();
    $('editingId').value = '';
    $('formTitle').textContent = 'Yangi xodim';
    $('order').value = (members.length + 1) * 10;
    $('status').value = 'active';
    imageData = '';
    imageName = '';
    removeImage = false;
    $('imagePreviewWrap').classList.add('hidden');
    $('imagePreview').removeAttribute('src');
    $('compressionInfo').textContent = '';
    showMessage($('formMessage'), '');
    renderList();
    if (scroll)
        window.scrollTo({ top: 0, behavior: 'smooth' });
}
function editMember(id) {
    var m = members.find(function (x) { return x.id === id; });
    if (!m)
        return;
    $('editingId').value = m.id;
    $('formTitle').textContent = 'Xodimni tahrirlaş';
    $('order').value = m.order || 100;
    $('status').value = m.status || 'active';
    LANGS.forEach(function (l) { var t = tr(m, l); $("name_".concat(l)).value = t.name || ''; $("role_".concat(l)).value = t.role || ''; $("experienceText_".concat(l)).value = t.experienceText || ''; $("bio_".concat(l)).value = t.bio || ''; });
    imageData = '';
    imageName = '';
    removeImage = false;
    $('compressionInfo').textContent = '';
    if (m.image) {
        $('imagePreview').src = m.image;
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
        var bitmap, _a, size, ratio, sw, sh, sx, sy, canvas, ctx, quality, blob;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (file.size > 10000000)
                        throw new Error('Rasm hajmi 10 MB dan oshmasligi kerak');
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
                    size = 900;
                    ratio = Math.max(size / bitmap.width, size / bitmap.height);
                    sw = Math.round(size / ratio), sh = Math.round(size / ratio);
                    sx = Math.max(0, Math.round((bitmap.width - sw) / 2)), sy = Math.max(0, Math.round((bitmap.height - sh) / 2));
                    canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    ctx = canvas.getContext('2d', { alpha: false });
                    ctx.fillStyle = '#f3f7fb';
                    ctx.fillRect(0, 0, size, size);
                    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, size, size);
                    if (bitmap.close)
                        bitmap.close();
                    quality = .86;
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve, 'image/webp', quality); })];
                case 5:
                    blob = _c.sent();
                    _c.label = 6;
                case 6:
                    if (!(blob && blob.size > 1500000 && quality > .55)) return [3 /*break*/, 8];
                    quality -= .08;
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve, 'image/webp', quality); })];
                case 7:
                    blob = _c.sent();
                    return [3 /*break*/, 6];
                case 8:
                    if (!blob)
                        throw new Error('Rasmni siqib bo‘lmadi');
                    _b = {};
                    return [4 /*yield*/, readBlobAsDataURL(blob)];
                case 9: return [2 /*return*/, (_b.data = _c.sent(), _b.name = (file.name.replace(/\.[^.]+$/, '') || 'team') + '.webp', _b.size = blob.size, _b.width = size, _b.height = size, _b)];
            }
        });
    });
}
$('imageFile').addEventListener('change', function () { return __awaiter(void 0, void 0, void 0, function () {
    var f, c, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                f = $('imageFile').files[0];
                if (!f)
                    return [2 /*return*/];
                showMessage($('formMessage'), 'Rasm siqilmoqda...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, compressImageFile(f)];
            case 2:
                c = _a.sent();
                imageData = c.data;
                imageName = c.name;
                removeImage = false;
                $('imagePreview').src = imageData;
                $('imagePreviewWrap').classList.remove('hidden');
                $('compressionInfo').textContent = "".concat((f.size / 1024 / 1024).toFixed(2), " MB \u2192 ").concat((c.size / 1024 / 1024).toFixed(2), " MB \u00B7 ").concat(c.width, "\u00D7").concat(c.height);
                showMessage($('formMessage'), 'Rasm avtomatik siqildi.', true);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                showMessage($('formMessage'), err_2.message);
                $('imageFile').value = '';
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
$('removeImageBtn').addEventListener('click', function () { imageData = ''; imageName = ''; removeImage = true; $('imageFile').value = ''; $('imagePreviewWrap').classList.add('hidden'); $('compressionInfo').textContent = ''; });
$('teamForm').addEventListener('submit', function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var id, translations, payload, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                id = $('editingId').value;
                translations = {};
                LANGS.forEach(function (l) { return translations[l] = { name: $("name_".concat(l)).value, role: $("role_".concat(l)).value, experienceText: $("experienceText_".concat(l)).value, bio: $("bio_".concat(l)).value }; });
                payload = { order: $('order').value, status: $('status').value, translations: translations, imageData: imageData, imageName: imageName, removeImage: removeImage };
                showMessage($('formMessage'), 'Saqlanmoqda...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api(id ? "/api/admin/team/".concat(encodeURIComponent(id)) : '/api/admin/team', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })];
            case 2:
                _a.sent();
                showMessage($('formMessage'), 'Xodim maʼlumotlari saqlandi.', true);
                return [4 /*yield*/, loadTeam()];
            case 3:
                _a.sent();
                if (!id)
                    resetForm(false);
                else
                    editMember(id);
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                showMessage($('formMessage'), err_3.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function deleteMember(id) {
    return __awaiter(this, void 0, void 0, function () { var m, title, err_4; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                m = members.find(function (x) { return x.id === id; });
                title = tr(m).name || id;
                if (!m || !confirm("\u201C".concat(title, "\u201D xodimini o\u2018chirasizmi?")))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, api("/api/admin/team/".concat(encodeURIComponent(id)), { method: 'DELETE' })];
            case 2:
                _a.sent();
                if ($('editingId').value === id)
                    resetForm(false);
                return [4 /*yield*/, loadTeam()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                alert(err_4.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    }); });
}
checkSession();
