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
(function () {
    var LANG = document.documentElement.lang || 'uz';
    var lang = ['uz', 'ru', 'en', 'zh'].includes(LANG) ? LANG : 'uz';
    var root = document.querySelector('[data-useful-custom-page]');
    var hub = document.querySelector('[data-useful-hub]');
    var infoBoxes = Array.from(document.querySelectorAll('[data-useful-info]'));
    var LANGS = ['uz', 'ru', 'en', 'zh'];
    var MONTH_NAMES = {
        uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    var WEEKDAYS = {
        uz: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'],
        ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        zh: ['一', '二', '三', '四', '五', '六', '日']
    };
    var DEFAULT_MONTHS = Array.from({ length: 12 }, function (_, i) { return ({ month: i + 1, name: { uz: MONTH_NAMES.uz[i], ru: MONTH_NAMES.ru[i], en: MONTH_NAMES.en[i], zh: MONTH_NAMES.zh[i] } }); });
    var USEFUL_LABEL = { uz: 'Foydali maʼlumotlar', ru: 'Полезная информация', en: 'Useful information', zh: '实用信息' };
    var t = function (v) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            var direct = v[lang] || v.uz || v.ru || v.en || v.zh;
            if (direct !== undefined && direct !== null && String(direct).trim() !== '')
                return direct;
            var first = Object.values(v).find(function (x) { return x !== undefined && x !== null && String(x).trim() !== ''; });
            return first == null ? '' : String(first);
        }
        return v == null ? '' : String(v);
    };
    var langObj = function (v) {
        if (v && typeof v === 'object' && !Array.isArray(v))
            return __assign({}, v);
        var s = v == null ? '' : String(v);
        return { uz: s, ru: s, en: s, zh: s };
    };
    var esc = function (v) { return String(v !== null && v !== void 0 ? v : '').replace(/[&<>'"]/g, function (ch) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]); }); };
    var fmt = function (v) { return (v === '' || v == null) ? '—' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
    var arr = function (v) { return Array.isArray(v) ? v : []; };
    var firstArray = function (obj, keys) { return keys.map(function (k) { return obj && obj[k]; }).find(Array.isArray) || []; };
    var firstVal = function (obj, keys, fallback) {
        var e_1, _a;
        if (fallback === void 0) { fallback = ''; }
        if (!obj || typeof obj !== 'object')
            return fallback;
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var k = keys_1_1.value;
                if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '')
                    return obj[k];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return fallback;
    };
    function get(slug) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/useful-custom/".concat(slug, "?lang=").concat(lang, "&v=28"), { cache: 'no-store' })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Maʼlumot yuklanmadi');
                        return [4 /*yield*/, res.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function getAll() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/useful-custom?lang=".concat(lang, "&v=28"), { cache: 'no-store' })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            throw new Error('Maʼlumot yuklanmadi');
                        return [4 /*yield*/, res.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function normalizeSectionBase(data, slug, kind) {
        var d = data || {};
        var titleCandidate = d.sarlavha || d.name || d.nomi || d.heading || d.caption || '';
        var subtitleCandidate = d.izoh || d.description || d.tavsif || d.note || d.tuzilma_izohi || '';
        var titleObj = d.title && t(d.title) ? d.title : langObj(titleCandidate);
        var subtitleObj = d.subtitle && t(d.subtitle) ? d.subtitle : langObj(subtitleCandidate);
        return __assign(__assign({}, d), { slug: d.slug || slug, kind: d.kind || kind || slug, title: titleObj, subtitle: subtitleObj, sourceName: d.sourceName || d.manba_nomi || d.manba_nomi || d.source || d.source_name || 'ALL FINANCE', sourceUrl: d.sourceUrl || d.manba || d.url || d.source_url || '' });
    }
    function sectionHeader(d) {
        return "<div class=\"bp-toolbar custom-bp-title\"><div><h2>".concat(esc(t(d.title)), "</h2><p>").concat(esc(t(d.subtitle)), "</p></div><a class=\"bp-back\" href=\"foydali.html\">\u2190 ").concat(esc(USEFUL_LABEL[lang]), "</a></div>");
    }
    function normalizeInfoData(data) {
        var d = normalizeSectionBase(data, 'info', 'info');
        var metrics = arr(d.metrics || d.korsatkichlar || d.indicators || d.info).map(function (m) { return ({
            label: langObj(firstVal(m, ['label', 'nomi', 'name', 'title', 'koʻrsatkich', 'korsatkich'])),
            value: firstVal(m, ['value', 'qiymat', 'amount', 'summa'])
        }); }).filter(function (m) { return t(m.label) || m.value; });
        if (!metrics.length) {
            var pairs = [
                ['BHM', d.bhm || d.BHM || d.brv || d.БРВ],
                ['MHEKM', d.mhekm || d.MHEKM || d.mrot || d.МРОТ],
                [lang === 'ru' ? 'Основная ставка' : lang === 'en' ? 'Key rate' : lang === 'zh' ? '基准利率' : 'Asosiy stavka', d.asosiy_stavka || d.key_rate || d.stavka || d.rate]
            ].filter(function (x) { return x[1] !== undefined && x[1] !== null && x[1] !== ''; });
            metrics = pairs.map(function (_a) {
                var _b = __read(_a, 2), label = _b[0], value = _b[1];
                return ({ label: langObj(label), value: value });
            });
        }
        var links = firstArray(d, ['links', 'linklar', 'foydali_linklar', 'quickLinks', 'tezkor_otish', 'tezkor']).map(function (l) { return ({
            title: langObj(firstVal(l, ['title', 'nomi', 'name', 'label'])),
            url: firstVal(l, ['url', 'href', 'link'], '#'),
            note: langObj(firstVal(l, ['note', 'izoh', 'description', 'tavsif']))
        }); });
        return __assign(__assign({}, d), { metrics: metrics, links: links });
    }
    function renderInfo(data, target) {
        var d = normalizeInfoData(data);
        var metrics = (d.metrics || []).map(function (m) { return "<div><span>".concat(esc(t(m.label)), "</span><strong>").concat(esc(fmt(m.value)), "</strong></div>"); }).join('');
        var links = (d.links || []).slice(0, 8).map(function (l) { return "<a href=\"".concat(esc(l.url), "\" target=\"_blank\" rel=\"noopener noreferrer\">").concat(esc(t(l.title)), "</a>"); }).join('');
        target.innerHTML = "<div class=\"bp-info-head\"><h3>".concat(esc(t(d.title)), "</h3><p>").concat(esc(t(d.subtitle)), "</p></div><div class=\"bp-info-list\">").concat(metrics || "<div><span>".concat(lang === 'ru' ? 'Нет данных' : lang === 'en' ? 'No data' : lang === 'zh' ? '无数据' : 'Maʼlumot yo‘q', "</span><strong>\u2014</strong></div>"), "</div><div class=\"quick-links-box\"><h4>").concat(lang === 'ru' ? 'Быстрый переход' : lang === 'en' ? 'Quick access' : lang === 'zh' ? '快捷入口' : 'Tezkor o‘tish', "</h4><div>").concat(links, "</div></div>");
    }
    function dateParts(value) {
        if (!value)
            return { day: '', month: '' };
        var s = String(value).trim();
        var m1 = s.match(/^(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{2,4}))?/);
        if (m1)
            return { day: Number(m1[1]), month: Number(m1[2]) };
        var d = new Date(s.includes('T') ? s : s + 'T00:00:00');
        if (!Number.isNaN(d.getTime()))
            return { day: d.getDate(), month: d.getMonth() + 1 };
        return { day: '', month: '' };
    }
    function monthFromName(name) {
        var s = String(name || '').toLowerCase();
        var all = [MONTH_NAMES.uz, MONTH_NAMES.ru, MONTH_NAMES.en].flat();
        var idx = all.findIndex(function (x) { return s.includes(String(x).toLowerCase()); });
        return idx >= 0 ? (idx % 12) + 1 : '';
    }
    function inferType(item) {
        var raw = String(firstVal(item, ['type', 'turi', 'category', 'kategoriya', 'tur'], '')).toLowerCase();
        var text = [raw, t(firstVal(item, ['title', 'nomi', 'name', 'mavzu', 'description', 'izoh', 'matn'], ''))].join(' ').toLowerCase();
        var hasReport = /hisobot|отчет|report|申报/.test(text);
        var hasPayment = /tolov|to.?lov|т[оө]лов|плат|payment|付款/.test(text);
        if (raw && (raw.includes('hisobot') || raw.includes('tolov') || raw.includes('reestr') || raw.includes('ariza') || raw.includes('tuzatish') || raw.includes('malumotnoma')))
            return raw;
        if (hasReport && hasPayment)
            return 'hisobot_tolov';
        if (hasReport)
            return 'hisobot';
        if (hasPayment)
            return 'tolov';
        return raw || 'boshqa';
    }
    function makeCalendarWeeks(year, month, highlightDays) {
        if (highlightDays === void 0) { highlightDays = []; }
        year = Number(year || 2026);
        month = Number(month || 1);
        var first = new Date(year, month - 1, 1);
        var lastDay = new Date(year, month, 0).getDate();
        var start = (first.getDay() + 6) % 7;
        var weeks = [];
        var week = Array(start).fill('');
        for (var day = 1; day <= lastDay; day++) {
            week.push(day);
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }
        if (week.length) {
            while (week.length < 7)
                week.push('');
            weeks.push(week);
        }
        return weeks;
    }
    function categoryLabel(value) {
        var raw = String(value || '').toLowerCase();
        var map = {
            hisobot: { uz: 'Hisobot', ru: 'Отчёт', en: 'Report', zh: '报表' },
            tolov: { uz: 'To‘lov', ru: 'Платёж', en: 'Payment', zh: '付款' },
            hisobot_va_tolov: { uz: 'Hisobot / to‘lov', ru: 'Отчёт / платёж', en: 'Report / payment', zh: '报表/付款' },
            reestr_va_tolov: { uz: 'Reyestr / to‘lov', ru: 'Реестр / платёж', en: 'Register / payment', zh: '登记/付款' },
            ariza: { uz: 'Ariza', ru: 'Заявление', en: 'Application', zh: '申请' },
            tuzatish: { uz: 'Tuzatish', ru: 'Исправление', en: 'Correction', zh: '更正' },
            malumotnoma: { uz: 'Maʼlumotnoma', ru: 'Справка', en: 'Reference', zh: '证明' }
        };
        return map[raw] || (raw ? langObj(raw.replaceAll('_', ' ')) : langObj('Boshqa'));
    }
    function normalizeCalendarData(data) {
        var d = normalizeSectionBase(data, 'calendar', 'calendar');
        var year = Number(d.yil || d.year || 2026);
        var months = arr(d.months || d.oylar || d.kalendar_oylar || d.calendarMonths);
        if (!months.length && (d.oy || d.oy_nomi)) {
            var mNum = Number(d.oy || monthFromName(d.oy_nomi) || 1);
            months = [{ month: mNum, name: langObj(d.oy_nomi || MONTH_NAMES.uz[mNum - 1]), weekdays: WEEKDAYS, weeks: makeCalendarWeeks(year, mNum) }];
        }
        if (!months.length)
            months = DEFAULT_MONTHS;
        months = months.map(function (m, i) {
            var mNum = Number(firstVal(m, ['month', 'oy', 'number', 'id'], i + 1));
            return {
                month: mNum,
                name: m.name || m.nomi || langObj(MONTH_NAMES.uz[(mNum - 1) || i] || ''),
                weekdays: m.weekdays || m.hafta_kunlari || WEEKDAYS,
                weeks: m.weeks || m.haftalar || makeCalendarWeeks(year, mNum)
            };
        });
        var events = firstArray(d, ['events', 'deadlines', 'calendar', 'taqvim', 'kalendar', 'items', 'rows', 'data']);
        // BuxgalterPRO calendar JSON: sanalar[] -> muddatlar[]
        if (!events.length && Array.isArray(d.sanalar)) {
            events = d.sanalar.flatMap(function (dayItem) {
                var date = firstVal(dayItem, ['date', 'sana', 'deadline', 'muddat'], '');
                var dp = dateParts(date);
                var weekday = firstVal(dayItem, ['weekday', 'hafta_kuni', 'kun_nomi', 'weekDay', 'dayName'], '');
                var count = firstVal(dayItem, ['count', 'muddat_soni', 'muddatlar_soni', 'soni'], arr(dayItem.muddatlar).length || 1);
                var originalDeadline = firstVal(dayItem, ['asl_muddat', 'originalDeadline', 'original_deadline'], '');
                var moveReason = firstVal(dayItem, ['kochirish_sababi', 'moveReason', 'reason'], '');
                var list = arr(dayItem.muddatlar);
                if (!list.length)
                    return [__assign(__assign({}, dayItem), { date: date, day: dp.day, month: dp.month, weekday: weekday, count: count })];
                return list.map(function (m, i) { return (__assign(__assign({}, m), { date: date, day: dp.day, month: dp.month, weekday: weekday, count: "".concat(i + 1, "/").concat(count), originalDeadline: originalDeadline, moveReason: moveReason, type: firstVal(m, ['type', 'turi', 'category', 'kategoriya', 'tur'], ''), title: firstVal(m, ['title', 'nomi', 'name', 'mavzu', 'subject'], ''), description: firstVal(m, ['description', 'izoh', 'matn', 'content', 'text', 'note', 'tavsif'], ''), reportPeriod: firstVal(m, ['hisobot_davri', 'period', 'reportPeriod'], ''), note: firstVal(m, ['eslatma', 'note', 'izoh'], '') })); });
            });
        }
        // Another common format: muddatlar[] at top-level.
        if (!events.length && Array.isArray(d.muddatlar))
            events = d.muddatlar;
        // BuxgalterPRO JSON may also use oylar[] -> sanalar[] -> muddatlar[].
        if (!events.length && Array.isArray(d.oylar)) {
            events = d.oylar.flatMap(function (m) {
                var mNum = Number(firstVal(m, ['month', 'oy', 'number', 'id'], monthFromName(firstVal(m, ['name', 'nomi', 'oy_nomi'], '')) || 1));
                var direct = firstArray(m, ['events', 'deadlines', 'items', 'rows', 'muddatlar']);
                var nestedDates = firstArray(m, ['sanalar', 'dates', 'days']);
                if (nestedDates.length)
                    return nestedDates.flatMap(function (dayItem) { return arr(dayItem.muddatlar).map(function (x, i) { return (__assign(__assign({}, x), { date: dayItem.sana || dayItem.date, month: mNum, weekday: dayItem.hafta_kuni || dayItem.weekday, count: "".concat(i + 1, "/").concat(dayItem.muddatlar_soni || arr(dayItem.muddatlar).length) })); }); });
                return direct.map(function (x) { return (__assign(__assign({}, x), { month: mNum })); });
            });
        }
        events = arr(events).map(function (e, idx) {
            var dp = dateParts(firstVal(e, ['date', 'sana', 'deadline', 'muddat', 'kun_sana'], ''));
            var month = Number(firstVal(e, ['month', 'oy'], dp.month || monthFromName(firstVal(e, ['monthName', 'oy_nomi', 'oyNomi'], '')) || d.oy || 1));
            var day = Number(firstVal(e, ['day', 'kun', 'sana_kuni'], dp.day || '')) || '';
            var reportPeriod = firstVal(e, ['reportPeriod', 'hisobot_davri', 'period', 'davr'], '');
            var note = firstVal(e, ['note', 'eslatma', 'izoh'], '');
            var originalDeadline = firstVal(e, ['originalDeadline', 'asl_muddat', 'original_deadline'], '');
            var moveReason = firstVal(e, ['moveReason', 'kochirish_sababi', 'reason'], '');
            var typ = inferType(e);
            return {
                id: e.id || "event-".concat(idx),
                date: firstVal(e, ['date', 'sana', 'deadline', 'muddat'], '') || (day && month ? "".concat(year, "-").concat(String(month).padStart(2, '0'), "-").concat(String(day).padStart(2, '0')) : ''),
                day: day,
                month: month,
                weekday: langObj(firstVal(e, ['weekday', 'hafta_kuni', 'kun_nomi', 'weekDay', 'dayName'], '')),
                count: firstVal(e, ['count', 'muddat_soni', 'muddatlar_soni', 'soni'], '1'),
                type: typ,
                typeLabel: categoryLabel(typ),
                title: langObj(firstVal(e, ['title', 'nomi', 'name', 'mavzu', 'subject', 'tur'], 'Muddat')),
                description: langObj(firstVal(e, ['description', 'izoh', 'matn', 'content', 'text', 'tavsif'], '') || firstVal(e, ['title', 'nomi', 'name', 'mavzu'], '')),
                reportPeriod: reportPeriod,
                note: note,
                originalDeadline: originalDeadline,
                moveReason: moveReason
            };
        }).filter(function (e) { return e.day || t(e.title) || t(e.description); });
        if (!months.length && events.length) {
            var mNums = __spreadArray([], __read(new Set(events.map(function (e) { return Number(e.month || dateParts(e.date).month); }).filter(Boolean))), false);
            months = mNums.map(function (mNum) { return ({ month: mNum, name: langObj(MONTH_NAMES.uz[mNum - 1] || String(mNum)), weekdays: WEEKDAYS, weeks: makeCalendarWeeks(year, mNum) }); });
        }
        return __assign(__assign({}, d), { year: year, months: months, events: events, stats: d.statistika || d.statistics || {} });
    }
    function renderCalendar(data) {
        var d = normalizeCalendarData(data);
        var months = d.months || [];
        var events = d.events || [];
        var monthsWithEvents = __spreadArray([], __read(new Set(events.map(function (e) { return Number(e.month || dateParts(e.date).month); }).filter(Boolean))), false);
        var monthButtons = months.filter(function (m) { return !monthsWithEvents.length || monthsWithEvents.includes(Number(m.month)); }).map(function (m) { return "<button class=\"bp-filter month-filter\" data-month=\"".concat(esc(m.month), "\">").concat(esc(t(m.name)), "</button>"); }).join('');
        root.innerHTML = sectionHeader(d) + "<div class=\"bp-controls\"><input class=\"bp-search\" data-search placeholder=\"".concat(lang === 'ru' ? 'Поиск по срокам' : lang === 'en' ? 'Search deadlines' : lang === 'zh' ? '搜索期限' : 'Muddatlar bo‘yicha qidirish', "\"><div class=\"bp-filters\"><button class=\"bp-filter active\" data-type=\"all\">").concat(lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : lang === 'zh' ? '全部' : 'Hammasi', "</button><button class=\"bp-filter\" data-type=\"hisobot\">").concat(lang === 'ru' ? 'Отчет' : lang === 'en' ? 'Report' : lang === 'zh' ? '报表' : 'Hisobot', "</button><button class=\"bp-filter\" data-type=\"tolov\">").concat(lang === 'ru' ? 'Платеж' : lang === 'en' ? 'Payment' : lang === 'zh' ? '付款' : 'To‘lov', "</button><button class=\"bp-filter\" data-type=\"boshqa\">").concat(lang === 'ru' ? 'Другое' : lang === 'en' ? 'Other' : lang === 'zh' ? '其他' : 'Boshqa', "</button></div></div><div class=\"bp-month-strip\">").concat(monthButtons, "</div><div class=\"bp-calendar-list\" data-calendar-list></div>");
        var list = root.querySelector('[data-calendar-list]');
        var type = 'all', month = monthsWithEvents[0] || 'all';
        var render = function () {
            var q = (root.querySelector('[data-search]').value || '').toLowerCase();
            var rows = events.filter(function (e) {
                var m = Number(e.month || dateParts(e.date).month);
                var hay = [t(e.title), t(e.description), t(e.weekday), e.type, e.count].join(' ').toLowerCase();
                return (!month || month === 'all' || Number(month) === m) && (type === 'all' || String(e.type || '').includes(type)) && (!q || hay.includes(q));
            });
            list.innerHTML = rows.length ? rows.map(function (e) {
                var meta = [
                    e.reportPeriod ? "".concat(lang === 'ru' ? 'Период' : lang === 'en' ? 'Period' : lang === 'zh' ? '期间' : 'Davr', ": ").concat(e.reportPeriod) : '',
                    e.originalDeadline ? "".concat(lang === 'ru' ? 'Первоначальный срок' : lang === 'en' ? 'Original deadline' : lang === 'zh' ? '原期限' : 'Asl muddat', ": ").concat(e.originalDeadline) : '',
                    e.moveReason || '',
                    e.note || ''
                ].filter(Boolean).map(function (x) { return "<span>".concat(esc(x), "</span>"); }).join('');
                return "<article class=\"bp-deadline-card\" data-type=\"".concat(esc(e.type), "\"><div class=\"bp-deadline-date\"><strong>").concat(esc(e.day || dateParts(e.date).day), "</strong><span>").concat(esc(t(e.weekday)), "</span></div><div class=\"bp-deadline-body\"><div class=\"bp-deadline-top\"><span class=\"bp-tag\">").concat(esc(t(e.count) || '1'), "</span><span class=\"bp-soft\">").concat(esc(t(e.typeLabel) || e.type || ''), "</span></div><h3>").concat(esc(t(e.title)), "</h3>").concat(t(e.description) && t(e.description) !== t(e.title) ? "<p>".concat(esc(t(e.description)), "</p>") : '').concat(meta ? "<div class=\"bp-deadline-meta\">".concat(meta, "</div>") : '', "</div></article>");
            }).join('') : "<div class=\"bp-empty-note\">".concat(lang === 'ru' ? 'Ничего не найдено' : lang === 'en' ? 'Nothing found' : lang === 'zh' ? '未找到' : 'Maʼlumot topilmadi', "</div>");
        };
        root.querySelectorAll('[data-type]').forEach(function (b) { return b.addEventListener('click', function () { root.querySelectorAll('[data-type]').forEach(function (x) { return x.classList.remove('active'); }); b.classList.add('active'); type = b.dataset.type; render(); }); });
        root.querySelectorAll('[data-month]').forEach(function (b, i) { if (i === 0)
            b.classList.add('active'); b.addEventListener('click', function () { root.querySelectorAll('[data-month]').forEach(function (x) { return x.classList.remove('active'); }); b.classList.add('active'); month = b.dataset.month; render(); }); });
        root.querySelector('[data-search]').addEventListener('input', render);
        render();
    }
    function renderMonthCard(m) {
        var _a, _b;
        var wds = ((_a = m.weekdays) === null || _a === void 0 ? void 0 : _a[lang]) || ((_b = m.weekdays) === null || _b === void 0 ? void 0 : _b.uz) || WEEKDAYS[lang] || WEEKDAYS.uz;
        return "<article class=\"bp-calendar-month\"><h3>".concat(esc(t(m.name)), "</h3><div class=\"bp-mini-week\">").concat(wds.map(function (x) { return "<span>".concat(esc(x), "</span>"); }).join(''), "</div>").concat((m.weeks || []).map(function (week) { return "<div class=\"bp-mini-week days\">".concat(week.map(function (d) { return "<span class=\"".concat(!d ? 'empty' : (d === 1 || d === 8 || d === 21 ? 'holiday' : ''), "\">").concat(d || '', "</span>"); }).join(''), "</div>"); }).join(''), "</article>");
    }
    function normalizeWorkdaysData(data) {
        var d = normalizeSectionBase(data, 'workdays', 'workdays');
        var months = arr(d.months || d.oylar || d.calendar || d.kalendar);
        if (!months.length)
            months = DEFAULT_MONTHS;
        months = months.map(function (m, i) { return ({
            month: Number(firstVal(m, ['month', 'oy', 'number', 'id'], i + 1)),
            name: m.name || m.nomi || langObj(MONTH_NAMES.uz[i]),
            weekdays: m.weekdays || m.hafta_kunlari || WEEKDAYS,
            weeks: m.weeks || m.haftalar || []
        }); });
        var balance = arr(d.balance || d.balans || d.worktime || d.ish_vaqti || d.rows).map(function (r, i) { return ({
            name: r.name || r.nomi || r.oy || langObj(MONTH_NAMES.uz[i] || ''),
            days5: firstVal(r, ['days5', 'ish_kuni_5', 'kun_5', 'workdays5', 'ish_kuni'], ''),
            hours5: firstVal(r, ['hours5', 'ish_soati_5', 'soat_5', 'workhours5', 'ish_soati'], ''),
            days6: firstVal(r, ['days6', 'ish_kuni_6', 'kun_6', 'workdays6'], ''),
            hours6: firstVal(r, ['hours6', 'ish_soati_6', 'soat_6', 'workhours6'], '')
        }); });
        var holidays = arr(d.holidays || d.bayramlar || d.dam_olish_kunlari || d.nonWorkingDays).map(function (h) { return ({ date: firstVal(h, ['date', 'sana', 'kun'], ''), name: langObj(firstVal(h, ['name', 'nomi', 'title', 'izoh'], '')) }); });
        return __assign(__assign({}, d), { months: months, balance: balance, holidays: holidays });
    }
    function renderWorkdays(data) {
        var d = normalizeWorkdaysData(data);
        root.innerHTML = sectionHeader(d) + "<div class=\"bp-switch\"><button class=\"active\" data-work-mode=\"5\">5 ".concat(lang === 'ru' ? 'дней' : lang === 'en' ? 'days' : lang === 'zh' ? '天' : 'kunlik', "</button><button data-work-mode=\"6\">6 ").concat(lang === 'ru' ? 'дней' : lang === 'en' ? 'days' : lang === 'zh' ? '天' : 'kunlik', "</button></div><div class=\"bp-workday-months\">").concat((d.months || []).map(renderMonthCard).join(''), "</div><div class=\"bp-subblock\"><h3>").concat(lang === 'ru' ? 'Баланс рабочего времени' : lang === 'en' ? 'Working time balance' : lang === 'zh' ? '工作时间平衡' : 'Ish vaqti balansi', "</h3><div class=\"bp-table-card\"><table class=\"bp-table\"><thead><tr><th>").concat(lang === 'ru' ? 'Месяц' : lang === 'en' ? 'Month' : lang === 'zh' ? '月份' : 'Oy', "</th><th>").concat(lang === 'ru' ? 'Рабочие дни' : lang === 'en' ? 'Workdays' : lang === 'zh' ? '工作日' : 'Ish kuni', "</th><th>").concat(lang === 'ru' ? 'Рабочие часы' : lang === 'en' ? 'Work hours' : lang === 'zh' ? '工时' : 'Ish soati', "</th></tr></thead><tbody data-balance></tbody></table></div></div><div class=\"bp-subblock\"><h3>").concat(lang === 'ru' ? 'Нерабочие праздничные дни' : lang === 'en' ? 'Non-working holidays' : lang === 'zh' ? '非工作节假日' : 'Ishlanmaydigan bayram kunlari', "</h3><ul class=\"bp-clean-list\">").concat((d.holidays || []).map(function (h) { return "<li><strong>".concat(esc(h.date), "</strong> \u2014 ").concat(esc(t(h.name)), "</li>"); }).join(''), "</ul></div>");
        var body = root.querySelector('[data-balance]');
        var mode = '5';
        var render = function () { body.innerHTML = (d.balance || []).map(function (r) { return "<tr><td>".concat(esc(t(r.name)), "</td><td>").concat(esc(mode === '5' ? r.days5 : (r.days6 || r.days5)), "</td><td>").concat(esc(mode === '5' ? r.hours5 : (r.hours6 || r.hours5)), "</td></tr>"); }).join('') || "<tr><td colspan=\"3\">".concat(lang === 'ru' ? 'Данные не внесены' : lang === 'en' ? 'No data entered' : lang === 'zh' ? '未录入数据' : 'Maʼlumot kiritilmagan', "</td></tr>"); };
        root.querySelectorAll('[data-work-mode]').forEach(function (b) { return b.addEventListener('click', function () { root.querySelectorAll('[data-work-mode]').forEach(function (x) { return x.classList.remove('active'); }); b.classList.add('active'); mode = b.dataset.workMode; render(); }); });
        render();
    }
    function normalizeRentData(data) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        var _e, _f, _g, _h, _j, _k;
        var src = normalizeSectionBase(data, 'rent', 'rent');
        var makeRow = function (region, name, residential, nonResidential, extra) {
            if (extra === void 0) { extra = {}; }
            return ({ region: region, name: langObj(name), residential: residential, nonResidential: nonResidential, zone: extra.zone || '', isZone: !!extra.isZone, type: extra.type || '' });
        };
        if (Array.isArray(src.regions) && Array.isArray(src.rates) && src.rates.length) {
            return __assign(__assign({}, src), { regions: src.regions, rows: src.rates, source: 'allfinance', stats: src.statistics || src.statistika || {}, unit: src.unit || src.olchov_birligi || "so‘m/m²/oy" });
        }
        if (Array.isArray(src.hududlar)) {
            var regions = [];
            var rows = [];
            try {
                for (var _l = __values(src.hududlar), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var h = _m.value;
                    var region = h.hudud || h.region || h.name || '';
                    if (!region)
                        continue;
                    regions.push(region);
                    var places = arr(h.joylar);
                    try {
                        for (var places_1 = (e_3 = void 0, __values(places)), places_1_1 = places_1.next(); !places_1_1.done; places_1_1 = places_1.next()) {
                            var p = places_1_1.value;
                            rows.push(makeRow(region, p.nomi || p.name || '', (_f = (_e = p.turar_joy) !== null && _e !== void 0 ? _e : p.residential) !== null && _f !== void 0 ? _f : '', (_h = (_g = p.noturar_joy) !== null && _g !== void 0 ? _g : p.nonResidential) !== null && _h !== void 0 ? _h : '', { type: p.turi || p.type || '' }));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (places_1_1 && !places_1_1.done && (_b = places_1.return)) _b.call(places_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    var zones = arr(h.zonalar);
                    try {
                        for (var zones_1 = (e_4 = void 0, __values(zones)), zones_1_1 = zones_1.next(); !zones_1_1.done; zones_1_1 = zones_1.next()) {
                            var z = zones_1_1.value;
                            var zoneName = "".concat(z.zona || z.zone || '', " - zona");
                            rows.push(makeRow(region, zoneName, '', '', { zone: zoneName, isZone: true }));
                            if (z.turar_joy || z.residential)
                                rows.push(makeRow(region, 'Turar joy', (_k = (_j = z.turar_joy) !== null && _j !== void 0 ? _j : z.residential) !== null && _k !== void 0 ? _k : '', '', { zone: zoneName, type: 'turar_joy' }));
                            var nr = z.noturar_joy || z.nonResidential || {};
                            try {
                                for (var _o = (e_5 = void 0, __values(Object.entries(nr))), _p = _o.next(); !_p.done; _p = _o.next()) {
                                    var _q = __read(_p.value, 2), key = _q[0], val = _q[1];
                                    var labels = { omborxona: { uz: 'Omborxona', ru: 'Склад', en: 'Warehouse', zh: '仓库' }, ishlab_chiqarish: { uz: 'Ishlab chiqarish', ru: 'Производство', en: 'Production', zh: '生产' }, hunarmandchilik: { uz: 'Hunarmandchilik', ru: 'Ремесленничество', en: 'Handicraft', zh: '手工业' }, xizmat: { uz: 'Xizmat ko‘rsatish', ru: 'Услуги', en: 'Services', zh: '服务' }, umumiy_ovqatlanish: { uz: 'Umumiy ovqatlanish', ru: 'Общественное питание', en: 'Catering', zh: '餐饮' }, boshqalar: { uz: 'Boshqalar', ru: 'Прочие', en: 'Other', zh: '其他' }, savdo: { uz: 'Savdo', ru: 'Торговля', en: 'Trade', zh: '贸易' }, ofis: { uz: 'Ofis', ru: 'Офис', en: 'Office', zh: '办公室' } };
                                    rows.push(makeRow(region, labels[key] || key.replaceAll('_', ' '), '', val, { zone: zoneName, type: key }));
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_p && !_p.done && (_d = _o.return)) _d.call(_o);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (zones_1_1 && !zones_1_1.done && (_c = zones_1.return)) _c.call(zones_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    if (!places.length && !zones.length)
                        rows.push(makeRow(region, h.holat === 'elon_qilinmagan' ? { uz: 'Maʼlumot hali eʼlon qilinmagan', ru: 'Данные еще не опубликованы', en: 'Data has not been published yet', zh: '数据尚未公布' } : { uz: 'Maʼlumot kiritilmagan', ru: 'Данные не внесены', en: 'No data entered', zh: '未录入数据' }, '', '', { type: h.holat || '' }));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_a = _l.return)) _a.call(_l);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return __assign(__assign({}, src), { regions: regions, rows: rows, source: 'buxgalterpro-json', stats: src.statistika || src.statistics || {}, unit: src.olchov_birligi || src.unit || "so‘m/m²/oy", headline: src.sarlavha || '' });
        }
        return __assign(__assign({}, src), { regions: [], rows: [], source: 'empty', stats: src.statistika || src.statistics || {}, unit: src.olchov_birligi || src.unit || "so‘m/m²/oy" });
    }
    function renderRent(data) {
        var d = normalizeRentData(data);
        var regions = d.regions || [];
        var rowsAll = d.rows || [];
        var allLabel = lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : lang === 'zh' ? '全部' : 'Hammasi';
        var noData = lang === 'ru' ? 'По этому региону данные пока не внесены' : lang === 'en' ? 'No data entered for this region yet' : lang === 'zh' ? '该地区尚无数据' : 'Bu hudud bo‘yicha maʼlumot hali kiritilmagan';
        var regionButtons = ["<button class=\"active\" data-region=\"__all\">".concat(allLabel, "</button>")].concat(regions.map(function (r) { return "<button data-region=\"".concat(esc(r), "\">").concat(esc(r), "</button>"); })).join('');
        var stat = d.stats || {};
        var statBadges = [stat.hududlar_soni ? "".concat(stat.hududlar_soni, " ").concat(lang === 'ru' ? 'регионов' : lang === 'en' ? 'regions' : lang === 'zh' ? '个地区' : 'ta hudud') : '', stat.oddiy_shahar_tuman_qatorlari ? "".concat(stat.oddiy_shahar_tuman_qatorlari, " ").concat(lang === 'ru' ? 'строк' : lang === 'en' ? 'rows' : lang === 'zh' ? '行' : 'ta qator') : '', d.unit || ''].filter(Boolean).map(function (x) { return "<span class=\"bp-rent-stat\">".concat(esc(x), "</span>"); }).join('');
        root.innerHTML = sectionHeader(d) + "<div class=\"bp-rent-layout\"><aside class=\"bp-region-list\">".concat(regionButtons, "</aside><div><div class=\"bp-rent-banner\"><span>\uD83D\uDCCB ").concat(esc(d.yil || 2026), " yil</span><h3>").concat(esc(d.headline || t(d.title)), "</h3><p>").concat(esc(t(d.subtitle)), "</p><div class=\"bp-rent-stats\">").concat(statBadges, "</div></div><div class=\"bp-controls\"><input class=\"bp-search\" data-rent-search placeholder=\"").concat(lang === 'ru' ? 'Поиск по городу, району или виду деятельности' : lang === 'en' ? 'Search city, district or activity' : lang === 'zh' ? '搜索城市、区或业务类型' : 'Shahar, tuman yoki faoliyat turini qidirish', "\"></div><div class=\"bp-table-card\"><table class=\"bp-table\"><thead><tr><th>").concat(lang === 'ru' ? 'Регион / город / район' : lang === 'en' ? 'Region / city / district' : lang === 'zh' ? '地区/城市/区域' : 'Hudud / shahar / tuman', "</th><th>").concat(lang === 'ru' ? 'Жилое' : lang === 'en' ? 'Residential' : lang === 'zh' ? '住宅' : 'Turar joy', "</th><th>").concat(lang === 'ru' ? 'Нежилое' : lang === 'en' ? 'Non-residential' : lang === 'zh' ? '非住宅' : 'Noturar joy', "</th></tr></thead><tbody data-rent-body></tbody></table></div></div></div>");
        var body = root.querySelector('[data-rent-body]');
        var search = root.querySelector('[data-rent-search]');
        var activeRegion = '__all';
        var render = function () { var q = (search.value || '').toLowerCase(); var rows = rowsAll.filter(function (r) { var hay = [r.region, t(r.name), r.type, r.zone, r.residential, r.nonResidential].join(' ').toLowerCase(); return (activeRegion === '__all' || r.region === activeRegion) && (!q || hay.includes(q)); }); if (!rows.length) {
            body.innerHTML = "<tr><td colspan=\"3\">".concat(noData, "</td></tr>");
            return;
        } var lastRegion = ''; body.innerHTML = rows.map(function (r) { var regionLine = activeRegion === '__all' && r.region !== lastRegion ? (lastRegion = r.region, "<tr class=\"bp-region-row\"><td colspan=\"3\">\uD83D\uDCCD ".concat(esc(r.region), "</td></tr>")) : ''; if (r.isZone)
            return regionLine + "<tr class=\"bp-zone-row\"><td colspan=\"3\">".concat(esc(t(r.name)), "</td></tr>"); return regionLine + "<tr><td><strong>".concat(esc(t(r.name)), "</strong>").concat(r.type ? "<small>".concat(esc(r.type), "</small>") : '', "</td><td>").concat(r.residential ? "<span class=\"rent-pill green\">".concat(esc(fmt(r.residential)), "</span>") : '—', "</td><td>").concat(r.nonResidential ? "<span class=\"rent-pill blue\">".concat(esc(fmt(r.nonResidential)), "</span>") : '—', "</td></tr>"); }).join(''); };
        root.querySelectorAll('[data-region]').forEach(function (b) { return b.addEventListener('click', function () { root.querySelectorAll('[data-region]').forEach(function (x) { return x.classList.remove('active'); }); b.classList.add('active'); activeRegion = b.dataset.region; render(); }); });
        search.addEventListener('input', render);
        render();
    }
    function normalizeLawsData(data) {
        var d = normalizeSectionBase(data, 'laws', 'laws');
        var items = firstArray(d, ['items', 'hujjatlar', 'qonun_hujjatlar', 'laws', 'documents', 'lex', 'data', 'links']).map(function (x) { return ({
            category: langObj(firstVal(x, ['category', 'kategoriya', 'bolim', 'section', 'group'], '')),
            title: langObj(firstVal(x, ['title', 'nomi', 'name', 'hujjat', 'document'], '')),
            url: firstVal(x, ['url', 'href', 'link'], '#'),
            note: langObj(firstVal(x, ['note', 'izoh', 'description', 'tavsif', 'summary'], ''))
        }); }).filter(function (x) { return t(x.title); });
        return __assign(__assign({}, d), { items: items });
    }
    function renderLaws(data) {
        var d = normalizeLawsData(data);
        root.innerHTML = sectionHeader(d) + "<div class=\"bp-controls\"><input class=\"bp-search\" data-law-search placeholder=\"".concat(lang === 'ru' ? 'Поиск документа' : lang === 'en' ? 'Search document' : lang === 'zh' ? '搜索文件' : 'Hujjat qidirish', "\"></div><div class=\"bp-law-grid\" data-law-grid></div>");
        var grid = root.querySelector('[data-law-grid]'), search = root.querySelector('[data-law-search]');
        var render = function () { var q = (search.value || '').toLowerCase(); var rows = (d.items || []).filter(function (x) { return [t(x.category), t(x.title), t(x.note)].join(' ').toLowerCase().includes(q); }); grid.innerHTML = rows.map(function (x) { return "<a class=\"bp-law-item\" href=\"".concat(esc(x.url || '#'), "\" target=\"_blank\" rel=\"noopener noreferrer\"><span>").concat(esc(t(x.category)), "</span><strong>").concat(esc(t(x.title)), "</strong><em>").concat(esc(t(x.note)), "</em></a>"); }).join('') || "<div class=\"bp-empty-note\">".concat(lang === 'ru' ? 'Ничего не найдено' : lang === 'en' ? 'Nothing found' : lang === 'zh' ? '未找到' : 'Maʼlumot topilmadi', "</div>"); };
        search.addEventListener('input', render);
        render();
    }
    function normalizeLinksData(data) {
        var d = normalizeSectionBase(data, 'links', 'links');
        var mapLink = function (x) { return ({ title: langObj(firstVal(x, ['title', 'nomi', 'name', 'label'], '')), url: firstVal(x, ['url', 'href', 'link'], '#'), note: langObj(firstVal(x, ['note', 'izoh', 'description', 'tavsif', 'summary'], '')) }); };
        var links = firstArray(d, ['links', 'linklar', 'foydali_linklar', 'services', 'xizmatlar', 'quickLinks', 'tezkor']).map(mapLink).filter(function (x) { return t(x.title); });
        var posts = firstArray(d, ['posts', 'maqolalar', 'materials', 'materiallar', 'articles', 'items', 'data']).map(mapLink).filter(function (x) { return t(x.title); });
        if (!links.length && posts.length) {
            links = posts;
            posts = [];
        }
        return __assign(__assign({}, d), { links: links, posts: posts });
    }
    function renderLinks(data) {
        var d = normalizeLinksData(data);
        root.innerHTML = sectionHeader(d) + "<div class=\"bp-subblock\"><h3>".concat(lang === 'ru' ? 'Быстрые сервисы' : lang === 'en' ? 'Quick services' : lang === 'zh' ? '快捷服务' : 'Tezkor xizmatlar', "</h3><div class=\"bp-link-grid\">").concat((d.links || []).map(function (x) { return "<a class=\"bp-link-item\" href=\"".concat(esc(x.url), "\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>").concat(esc(t(x.title)), "</strong><span>").concat(esc(t(x.note)), "</span></a>"); }).join('') || "<div class=\"bp-empty-note\">".concat(lang === 'ru' ? 'Данные не внесены' : lang === 'en' ? 'No data entered' : lang === 'zh' ? '未录入数据' : 'Maʼlumot kiritilmagan', "</div>"), "</div></div><div class=\"bp-subblock\"><h3>").concat(lang === 'ru' ? 'Полезные материалы' : lang === 'en' ? 'Useful materials' : lang === 'zh' ? '实用资料' : 'Foydali materiallar', "</h3><div class=\"bp-link-grid\">").concat((d.posts || []).map(function (x) { return "<a class=\"bp-link-item\" href=\"".concat(esc(x.url), "\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>").concat(esc(t(x.title)), "</strong><span>").concat(esc(t(x.note)), "</span></a>"); }).join(''), "</div></div>");
    }
    function normalizedForHub(slug, data) {
        if (slug === 'calendar')
            return normalizeCalendarData(data);
        if (slug === 'workdays')
            return normalizeWorkdaysData(data);
        if (slug === 'rent')
            return normalizeRentData(data);
        if (slug === 'laws')
            return normalizeLawsData(data);
        if (slug === 'links')
            return normalizeLinksData(data);
        if (slug === 'info')
            return normalizeInfoData(data);
        return normalizeSectionBase(data, slug, slug);
    }
    function initPage() {
        return __awaiter(this, void 0, void 0, function () {
            var slug, data, kind, e_6, all_1, cards, labels_1, urls_1, e_7, info_1, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!root) return [3 /*break*/, 4];
                        slug = root.dataset.usefulCustomPage;
                        root.innerHTML = "<div class=\"bp-empty-note\">".concat(lang === 'ru' ? 'Загрузка...' : lang === 'en' ? 'Loading...' : lang === 'zh' ? '正在加载...' : 'Yuklanmoqda...', "</div>");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, get(slug)];
                    case 2:
                        data = _a.sent();
                        kind = String(data.kind || slug);
                        if (kind === 'calendar' || slug === 'calendar')
                            renderCalendar(data);
                        else if (kind === 'workdays' || slug === 'workdays')
                            renderWorkdays(data);
                        else if (kind === 'rent' || slug === 'rent')
                            renderRent(data);
                        else if (kind === 'laws' || slug === 'laws')
                            renderLaws(data);
                        else if (kind === 'links' || slug === 'links')
                            renderLinks(data);
                        else
                            root.innerHTML = sectionHeader(normalizeSectionBase(data, slug, kind));
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        root.innerHTML = "<div class=\"bp-empty-note\">".concat(esc(e_6.message), "</div>");
                        return [3 /*break*/, 4];
                    case 4:
                        if (!hub) return [3 /*break*/, 8];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, getAll()];
                    case 6:
                        all_1 = _a.sent();
                        cards = ['calendar', 'workdays', 'rent', 'laws', 'links'];
                        labels_1 = { calendar: '📅', workdays: '🗓️', rent: '🏢', laws: '⚖️', links: '🔗' };
                        urls_1 = { calendar: 'foydali-calendar.html', workdays: 'foydali-workdays.html', rent: 'foydali-rent.html', laws: 'foydali-laws.html', links: 'foydali-links.html' };
                        hub.innerHTML = cards.map(function (slug) { var d = normalizedForHub(slug, (all_1.sections || {})[slug] || {}); return "<a class=\"bp-tool-card\" href=\"".concat(urls_1[slug], "\"><div class=\"bp-tool-icon\"><span class=\"bp-card-emoji\">").concat(labels_1[slug], "</span></div><div class=\"bp-tool-body\"><strong>").concat(esc(t(d.title)), "</strong><em>").concat(esc(t(d.subtitle)), "</em></div><span class=\"bp-open\">").concat(lang === 'ru' ? 'Открыть' : lang === 'en' ? 'Open' : lang === 'zh' ? '打开' : 'Ochish', " \u2192</span></a>"); }).join('');
                        return [3 /*break*/, 8];
                    case 7:
                        e_7 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        if (!infoBoxes.length) return [3 /*break*/, 12];
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, get('info')];
                    case 10:
                        info_1 = _a.sent();
                        infoBoxes.forEach(function (box) { return renderInfo(info_1, box); });
                        return [3 /*break*/, 12];
                    case 11:
                        e_8 = _a.sent();
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }
    initPage();
})();
