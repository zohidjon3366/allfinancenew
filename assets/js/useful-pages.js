(function () {
    var qs = function (s, r) {
        if (r === void 0) { r = document; }
        return r.querySelector(s);
    };
    var qsa = function (s, r) {
        if (r === void 0) { r = document; }
        return Array.from(r.querySelectorAll(s));
    };
    var table = qs('[data-bp-table]');
    var list = qs('[data-bp-list]');
    var search = qs('[data-bp-search]');
    var currentFilter = 'all';
    function norm(v) { return (v || '').toString().toLowerCase().replace(/ё/g, 'е'); }
    function apply() {
        var term = norm(search && search.value);
        if (table) {
            qsa('tbody tr', table).forEach(function (row) {
                var s = norm(row.getAttribute('data-search') || row.textContent);
                var t = norm(row.getAttribute('data-type') || '');
                var filterOk = currentFilter === 'all' || t.includes(currentFilter) || s.includes(currentFilter);
                row.style.display = (filterOk && (!term || s.includes(term))) ? '' : 'none';
            });
        }
        if (list) {
            qsa('[data-search]', list).forEach(function (item) {
                var s = norm(item.getAttribute('data-search') || item.textContent);
                item.style.display = (!term || s.includes(term)) ? '' : 'none';
            });
        }
    }
    if (search) {
        search.addEventListener('input', apply);
    }
    qsa('[data-bp-filter]').forEach(function (btn) { return btn.addEventListener('click', function () {
        qsa('[data-bp-filter]').forEach(function (b) { return b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = norm(btn.dataset.bpFilter || 'all');
        apply();
    }); });
    qsa('[data-bp-tab]').forEach(function (btn) { return btn.addEventListener('click', function () {
        qsa('[data-bp-tab]').forEach(function (b) { return b.classList.remove('active'); });
        btn.classList.add('active');
        qsa('.bp-tab-panel').forEach(function (p) { return p.classList.toggle('active', p.id === btn.dataset.bpTab); });
    }); });
    apply();
})();
