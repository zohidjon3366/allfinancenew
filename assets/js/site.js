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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* ALL FINANCE iPhone/Safari compatibility helpers */
(function () {
    if (!Array.from)
        Array.from = function (v) { return Array.prototype.slice.call(v); };
    if (!Array.prototype.includes)
        Array.prototype.includes = function (x) { return this.indexOf(x) !== -1; };
    if (!String.prototype.startsWith)
        String.prototype.startsWith = function (s, p) { p = p || 0; return this.substr(p, s.length) === s; };
    if (!Object.values)
        Object.values = function (o) { return Object.keys(o).map(function (k) { return o[k]; }); };
    if (!Object.entries)
        Object.entries = function (o) { return Object.keys(o).map(function (k) { return [k, o[k]]; }); };
    if (!Object.fromEntries)
        Object.fromEntries = function (it) { var o = {}; Array.from(it).forEach(function (e) { o[e[0]] = e[1]; }); return o; };
})();
document.querySelectorAll('[data-year]').forEach(function (el) { return el.textContent = new Date().getFullYear(); });
var menuBtn = document.getElementById('menuBtn');
var mainNav = document.getElementById('mainNav');
if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', function () { return mainNav.classList.toggle('open'); });
}
var dropdowns = __spreadArray([], __read(document.querySelectorAll('.nav-dropdown')), false);
function closeDropdowns(except) {
    if (except === void 0) { except = null; }
    dropdowns.forEach(function (drop) {
        if (drop !== except) {
            drop.classList.remove('open');
            var trigger = drop.querySelector('.services-main-link');
            if (trigger)
                trigger.setAttribute('aria-expanded', 'false');
        }
    });
}
dropdowns.forEach(function (drop) {
    var trigger = drop.querySelector('.services-main-link');
    var panel = drop.querySelector('.dropdown-panel');
    if (!trigger || !panel)
        return;
    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var willOpen = !drop.classList.contains('open');
        closeDropdowns(drop);
        drop.classList.toggle('open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
    });
    panel.addEventListener('click', function (event) { return event.stopPropagation(); });
});
document.addEventListener('click', function () { return closeDropdowns(); });
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape')
        closeDropdowns();
});
var currentLang = document.body.dataset.lang || document.documentElement.lang || 'uz';
var uiMessages = { uz: { sent: "Sörovingiz yuborildi. Tez orada siz bilan boğlanamiz.", error: "Yuborişda muammo yuz berdi. Iltimos, telefon orqali boğlaning.", currency: "söm / oy" }, ru: { sent: "Заявка отправлена. Мы скоро свяжемся с вами.", error: "Не удалось отправить заявку. Пожалуйста, свяжитесь с нами по телефону.", currency: "сум / месяц" }, en: { sent: "Your request has been sent. We will contact you shortly.", error: "The request could not be sent. Please contact us by phone.", currency: "UZS / month" }, zh: { sent: "您的申请已提交，我们将尽快与您联系。", error: "申请提交失败，请通过电话联系我们。", currency: "乌兹别克斯坦苏姆/月" } };
var consultForm = document.getElementById('consultForm');
if (consultForm) {
    consultForm.addEventListener('submit', function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var data, message, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    data = Object.fromEntries(new FormData(consultForm).entries());
                    message = document.getElementById('formMessage');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/consult', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (!response.ok)
                        throw new Error(result.message || 'Yuborilmadi');
                    if (message)
                        message.textContent = (uiMessages[currentLang] || uiMessages.uz).sent;
                    consultForm.reset();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    if (message)
                        message.textContent = (uiMessages[currentLang] || uiMessages.uz).error;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
}
// Section and card animations. Content stays visible when JavaScript is disabled.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors = [
        '.hero-copy', '.hero-visual', '.page-hero .shell', '.section-head',
        '.metric', '.service-card', '.process-step', '.solution-points', '.image-frame',
        '.price-card', '.home-member-card', '.team-card', '.news-card',
        '.map-card', '.contact-form', '.service-text-panel', '.service-visual-small',
        '.service-process-grid article', '.deliver-card', '.legal-card', '.service-cta'
    ];
    var elements = __spreadArray([], __read(document.querySelectorAll(selectors.join(','))), false);
    if (!elements.length)
        return;
    elements.forEach(function (element, index) {
        var _a;
        element.classList.add('reveal');
        var localIndex = __spreadArray([], __read((((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.children) || [])), false).indexOf(element);
        element.style.setProperty('--reveal-delay', "".concat(Math.min(Math.max(localIndex, 0) * 75, 300), "ms"));
    });
    document.querySelectorAll('.hero-copy').forEach(function (el) { return el.classList.add('reveal-left'); });
    document.querySelectorAll('.hero-visual,.service-visual-small').forEach(function (el) { return el.classList.add('reveal-right'); });
    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach(function (element) { return element.classList.add('reveal-visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    requestAnimationFrame(function () { return elements.forEach(function (element) { return observer.observe(element); }); });
})();
var calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
    calcBtn.addEventListener('click', function () { var _a, _b, _c, _d, _e; var type = ((_a = document.getElementById('taxType')) === null || _a === void 0 ? void 0 : _a.value) || 'turnover'; var employees = Number(((_b = document.getElementById('employees')) === null || _b === void 0 ? void 0 : _b.value) || 0); var invoices = Number(((_c = document.getElementById('invoices')) === null || _c === void 0 ? void 0 : _c.value) || 0); var bankOps = Number(((_d = document.getElementById('bankOps')) === null || _d === void 0 ? void 0 : _d.value) || 0); var ie = (_e = document.getElementById('importExport')) === null || _e === void 0 ? void 0 : _e.checked; var price = type === 'vat' || type === 'profit' ? 3500000 : 1500000; price += Math.max(0, employees - 5) * 90000 + Math.max(0, invoices - 30) * 18000 + Math.max(0, bankOps - 50) * 9000; if (ie)
        price += 1200000; price = Math.ceil(price / 100000) * 100000; var locale = currentLang === 'ru' ? 'ru-RU' : currentLang === 'en' ? 'en-US' : currentLang === 'zh' ? 'zh-CN' : 'uz-UZ'; var label = currentLang === 'en' ? "UZS ".concat(price.toLocaleString(locale), " / month") : currentLang === 'zh' ? "".concat(price.toLocaleString(locale), " \u4E4C\u5179\u522B\u514B\u65AF\u5766\u82CF\u59C6/\u6708") : "".concat(price.toLocaleString(locale), " ").concat((uiMessages[currentLang] || uiMessages.uz).currency); var el = document.getElementById('calcPrice'); if (el)
        el.textContent = label; });
}
// Preserve article/query context while changing language.
document.querySelectorAll('[data-lang-link]').forEach(function (link) {
    var original = link.getAttribute('href');
    if (!original)
        return;
    if (location.pathname.endsWith('maqola.html') && location.search) {
        link.setAttribute('href', original + location.search);
    }
});
