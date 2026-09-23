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
(function () {
    var _a, _b;
    var grids = Array.from(document.querySelectorAll('[data-team-grid]'));
    if (!grids.length)
        return;
    var lang = ((_b = (_a = document.body) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.lang) || 'uz';
    var depthPrefix = location.pathname.split('/').filter(Boolean).length > 1 ? '../' : '';
    var fallbackMessage = {
        uz: 'Jamoa maʼlumotlari vaqtincha yuklanmadi. Sahifadagi saqlangan maʼlumotlar ko‘rsatilmoqda.',
        ru: 'Данные команды временно не загрузились. Показаны сохранённые данные страницы.',
        en: 'Team data could not be loaded now. Saved page data is displayed.',
        zh: '团队数据暂时无法加载，页面显示已保存的信息。'
    };
    var esc = function (value) { return String(value || '').replace(/[&<>'"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]); }); };
    function normalizeImage(src) {
        src = String(src || '').trim();
        if (!src)
            return depthPrefix + 'assets/img/favicon-64.png';
        if (/^(https?:)?\/\//i.test(src) || src.startsWith('/'))
            return src;
        return depthPrefix + src.replace(/^\.\//, '');
    }
    function expHtml(text) {
        var items = String(text || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
        return items.length ? "<div class=\"experience-list\">".concat(items.map(function (x) { return "<span class=\"experience-item\">".concat(esc(x), "</span>"); }).join(''), "</div>") : '';
    }
    function card(member, index, isHome) {
        var img = normalizeImage(member.image);
        var load = index === 0 ? 'eager' : 'lazy';
        if (isHome) {
            return "<article class=\"home-member-card\">\n        <div class=\"home-member-photo-wrap\"><img alt=\"".concat(esc(member.name), "\" class=\"home-member-photo\" loading=\"").concat(load, "\" src=\"").concat(esc(img), "\"/></div>\n        <div class=\"home-member-content\">\n          <h3>").concat(esc(member.name), "</h3>\n          <div class=\"member-role\">").concat(esc(member.role), "</div>\n          ").concat(expHtml(member.experienceText), "\n          ").concat(member.bio ? "<p class=\"member-bio\">".concat(esc(member.bio), "</p>") : '', "\n        </div>\n      </article>");
        }
        return "<article class=\"member-card member-card-photo\">\n      <div class=\"member-photo-wrap\"><img alt=\"".concat(esc(member.name), "\" class=\"member-photo\" loading=\"").concat(load, "\" src=\"").concat(esc(img), "\"/></div>\n      <div class=\"member-content\">\n        <h3>").concat(esc(member.name), "</h3>\n        <div class=\"member-role\">").concat(esc(member.role), "</div>\n        ").concat(expHtml(member.experienceText), "\n        ").concat(member.bio ? "<p class=\"member-bio\">".concat(esc(member.bio), "</p>") : '', "\n      </div>\n    </article>");
    }
    function loadGrid(grid) {
        return __awaiter(this, void 0, void 0, function () {
            var currentHtml, isHome, limit, res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentHtml = grid.innerHTML;
                        isHome = grid.hasAttribute('data-team-home') || grid.classList.contains('home-team-grid');
                        limit = Number(grid.dataset.teamLimit || 0);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/api/team?lang=".concat(encodeURIComponent(lang), "&v=23"), { cache: 'no-store' })];
                    case 2:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('TEAM_API_ERROR');
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (!Array.isArray(data) || !data.length)
                            throw new Error('TEAM_EMPTY');
                        if (limit > 0)
                            data = data.slice(0, limit);
                        grid.innerHTML = data.map(function (member, index) { return card(member, index, isHome); }).join('');
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (currentHtml && !currentHtml.includes('team-loading'))
                            return [2 /*return*/];
                        grid.innerHTML = "<div class=\"team-empty\">".concat(esc(fallbackMessage[lang] || fallbackMessage.uz), "</div>");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    grids.forEach(loadGrid);
})();
