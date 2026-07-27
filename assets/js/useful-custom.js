(function(){
  const LANG = document.documentElement.lang || 'uz';
  const lang = ['uz','ru','en','zh'].includes(LANG) ? LANG : 'uz';
  const root = document.querySelector('[data-useful-custom-page]');
  const hub = document.querySelector('[data-useful-hub]');
  const infoBoxes = Array.from(document.querySelectorAll('[data-useful-info]'));

  const LANGS = ['uz','ru','en','zh'];
  const MONTH_NAMES = {
    uz:['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    ru:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December'],
    zh:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
  };
  const WEEKDAYS = {
    uz:['Du','Se','Cho','Pa','Ju','Sha','Ya'],
    ru:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    en:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    zh:['一','二','三','四','五','六','日']
  };
  const DEFAULT_MONTHS = Array.from({length:12},(_,i)=>({month:i+1,name:{uz:MONTH_NAMES.uz[i],ru:MONTH_NAMES.ru[i],en:MONTH_NAMES.en[i],zh:MONTH_NAMES.zh[i]}}));

  const t = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const direct = v[lang] || v.uz || v.ru || v.en || v.zh;
      if (direct !== undefined && direct !== null && String(direct).trim() !== '') return direct;
      const first = Object.values(v).find(x => x !== undefined && x !== null && String(x).trim() !== '');
      return first == null ? '' : String(first);
    }
    return v == null ? '' : String(v);
  };
  const langObj = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) return {...v};
    const s = v == null ? '' : String(v);
    return { uz:s, ru:s, en:s, zh:s };
  };
  const esc = v => String(v ?? '').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  const fmt = v => (v === '' || v == null) ? '—' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  const arr = v => Array.isArray(v) ? v : [];
  const firstArray = (obj, keys) => keys.map(k=>obj && obj[k]).find(Array.isArray) || [];
  const firstVal = (obj, keys, fallback='') => {
    if (!obj || typeof obj !== 'object') return fallback;
    for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
    return fallback;
  };

  async function get(slug){
    const res = await fetch(`/api/useful-custom/${slug}?lang=${lang}&v=27`, {cache:'no-store'});
    if(!res.ok) throw new Error('Maʼlumot yuklanmadi');
    return await res.json();
  }
  async function getAll(){
    const res = await fetch(`/api/useful-custom?lang=${lang}&v=27`, {cache:'no-store'});
    if(!res.ok) throw new Error('Maʼlumot yuklanmadi');
    return await res.json();
  }

  function normalizeSectionBase(data, slug, kind){
    const d = data || {};
    const titleCandidate = d.sarlavha || d.name || d.nomi || d.heading || d.caption || '';
    const subtitleCandidate = d.izoh || d.description || d.tavsif || d.note || d.tuzilma_izohi || '';
    const titleObj = d.title && t(d.title) ? d.title : langObj(titleCandidate);
    const subtitleObj = d.subtitle && t(d.subtitle) ? d.subtitle : langObj(subtitleCandidate);
    return {
      ...d,
      slug: d.slug || slug,
      kind: d.kind || kind || slug,
      title: titleObj,
      subtitle: subtitleObj,
      sourceName: d.sourceName || d.manba_nomi || d.manba_nomi || d.source || d.source_name || 'ALL FINANCE',
      sourceUrl: d.sourceUrl || d.manba || d.url || d.source_url || ''
    };
  }

  function sectionHeader(d){
    return `<div class="bp-toolbar custom-bp-title"><div><span class="bp-pill">${esc(d.sourceName||'ALL FINANCE')}</span><h2>${esc(t(d.title))}</h2><p>${esc(t(d.subtitle))}</p></div><a class="bp-back" href="foydali.html">← ${lang==='ru'?'Полезная база':lang==='en'?'Useful resources':lang==='zh'?'实用资料库':'Foydali baza'}</a></div>`;
  }

  function normalizeInfoData(data){
    const d = normalizeSectionBase(data, 'info', 'info');
    let metrics = arr(d.metrics || d.korsatkichlar || d.indicators || d.info).map(m=>({
      label: langObj(firstVal(m,['label','nomi','name','title','koʻrsatkich','korsatkich'])),
      value: firstVal(m,['value','qiymat','amount','summa'])
    })).filter(m=>t(m.label) || m.value);

    if (!metrics.length) {
      const pairs = [
        ['BHM', d.bhm || d.BHM || d.brv || d.БРВ],
        ['MHEKM', d.mhekm || d.MHEKM || d.mrot || d.МРОТ],
        [lang==='ru'?'Основная ставка':lang==='en'?'Key rate':lang==='zh'?'基准利率':'Asosiy stavka', d.asosiy_stavka || d.key_rate || d.stavka || d.rate]
      ].filter(x=>x[1] !== undefined && x[1] !== null && x[1] !== '');
      metrics = pairs.map(([label,value])=>({label:langObj(label),value}));
    }

    let links = firstArray(d, ['links','linklar','foydali_linklar','quickLinks','tezkor_otish','tezkor']).map(l=>({
      title: langObj(firstVal(l,['title','nomi','name','label'])),
      url: firstVal(l,['url','href','link'],'#'),
      note: langObj(firstVal(l,['note','izoh','description','tavsif']))
    }));
    return {...d, metrics, links};
  }

  function renderInfo(data, target){
    const d = normalizeInfoData(data);
    const metrics = (d.metrics||[]).map(m=>`<div><span>${esc(t(m.label))}</span><strong>${esc(fmt(m.value))}</strong></div>`).join('');
    const links = (d.links||[]).slice(0,8).map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(t(l.title))}</a>`).join('');
    target.innerHTML = `<div class="bp-info-head"><span class="eyebrow">${lang==='ru'?'Редактируется в Render':lang==='en'?'Managed in Render':lang==='zh'?'在 Render 中维护':'Render orqali boshqariladi'}</span><h3>${esc(t(d.title))}</h3><p>${esc(t(d.subtitle))}</p></div><div class="bp-info-list">${metrics || `<div><span>${lang==='ru'?'Нет данных':lang==='en'?'No data':lang==='zh'?'无数据':'Maʼlumot yo‘q'}</span><strong>—</strong></div>`}</div><div class="quick-links-box"><h4>${lang==='ru'?'Быстрый переход':lang==='en'?'Quick access':lang==='zh'?'快捷入口':'Tezkor o‘tish'}</h4><div>${links}</div></div>`;
  }

  function dateParts(value){
    if (!value) return {day:'', month:''};
    const s = String(value).trim();
    const m1 = s.match(/^(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{2,4}))?/);
    if (m1) return {day:Number(m1[1]), month:Number(m1[2])};
    const d = new Date(s.includes('T') ? s : s+'T00:00:00');
    if (!Number.isNaN(d.getTime())) return {day:d.getDate(), month:d.getMonth()+1};
    return {day:'', month:''};
  }
  function monthFromName(name){
    const s = String(name||'').toLowerCase();
    const all = [MONTH_NAMES.uz, MONTH_NAMES.ru, MONTH_NAMES.en].flat();
    const idx = all.findIndex(x=>s.includes(String(x).toLowerCase()));
    return idx >= 0 ? (idx % 12) + 1 : '';
  }
  function inferType(item){
    const raw = String(firstVal(item,['type','turi','category','kategoriya','tur'],'')).toLowerCase();
    const text = [raw, t(firstVal(item,['title','nomi','name','mavzu','description','izoh','matn'],''))].join(' ').toLowerCase();
    const hasReport = /hisobot|отчет|report|申报/.test(text);
    const hasPayment = /tolov|to.?lov|т[оө]лов|плат|payment|付款/.test(text);
    if (raw && (raw.includes('hisobot') || raw.includes('tolov') || raw.includes('reestr') || raw.includes('ariza') || raw.includes('tuzatish') || raw.includes('malumotnoma'))) return raw;
    if (hasReport && hasPayment) return 'hisobot_tolov';
    if (hasReport) return 'hisobot';
    if (hasPayment) return 'tolov';
    return raw || 'boshqa';
  }


  function makeCalendarWeeks(year, month, highlightDays = []){
    year = Number(year || 2026); month = Number(month || 1);
    const first = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    const start = (first.getDay() + 6) % 7;
    const weeks = []; let week = Array(start).fill('');
    for(let day=1; day<=lastDay; day++){
      week.push(day);
      if(week.length === 7){ weeks.push(week); week = []; }
    }
    if(week.length) { while(week.length < 7) week.push(''); weeks.push(week); }
    return weeks;
  }
  function categoryLabel(value){
    const raw = String(value || '').toLowerCase();
    const map = {
      hisobot:{uz:'Hisobot',ru:'Отчёт',en:'Report',zh:'报表'},
      tolov:{uz:'To‘lov',ru:'Платёж',en:'Payment',zh:'付款'},
      hisobot_va_tolov:{uz:'Hisobot / to‘lov',ru:'Отчёт / платёж',en:'Report / payment',zh:'报表/付款'},
      reestr_va_tolov:{uz:'Reyestr / to‘lov',ru:'Реестр / платёж',en:'Register / payment',zh:'登记/付款'},
      ariza:{uz:'Ariza',ru:'Заявление',en:'Application',zh:'申请'},
      tuzatish:{uz:'Tuzatish',ru:'Исправление',en:'Correction',zh:'更正'},
      malumotnoma:{uz:'Maʼlumotnoma',ru:'Справка',en:'Reference',zh:'证明'}
    };
    return map[raw] || (raw ? langObj(raw.replaceAll('_',' ')) : langObj('Boshqa'));
  }
  function normalizeCalendarData(data){
    const d = normalizeSectionBase(data, 'calendar', 'calendar');
    const year = Number(d.yil || d.year || 2026);

    let months = arr(d.months || d.oylar || d.kalendar_oylar || d.calendarMonths);
    if (!months.length && (d.oy || d.oy_nomi)) {
      const mNum = Number(d.oy || monthFromName(d.oy_nomi) || 1);
      months = [{ month:mNum, name:langObj(d.oy_nomi || MONTH_NAMES.uz[mNum-1]), weekdays:WEEKDAYS, weeks:makeCalendarWeeks(year, mNum) }];
    }
    if (!months.length) months = DEFAULT_MONTHS;
    months = months.map((m,i)=>{
      const mNum = Number(firstVal(m,['month','oy','number','id'], i+1));
      return {
        month: mNum,
        name: m.name || m.nomi || langObj(MONTH_NAMES.uz[(mNum-1)||i] || ''),
        weekdays: m.weekdays || m.hafta_kunlari || WEEKDAYS,
        weeks: m.weeks || m.haftalar || makeCalendarWeeks(year, mNum)
      };
    });

    let events = firstArray(d,['events','deadlines','calendar','taqvim','kalendar','items','rows','data']);
    // BuxgalterPRO calendar JSON: sanalar[] -> muddatlar[]
    if (!events.length && Array.isArray(d.sanalar)) {
      events = d.sanalar.flatMap(dayItem => {
        const date = firstVal(dayItem, ['date','sana','deadline','muddat'], '');
        const dp = dateParts(date);
        const weekday = firstVal(dayItem, ['weekday','hafta_kuni','kun_nomi','weekDay','dayName'], '');
        const count = firstVal(dayItem, ['count','muddat_soni','muddatlar_soni','soni'], arr(dayItem.muddatlar).length || 1);
        const originalDeadline = firstVal(dayItem, ['asl_muddat','originalDeadline','original_deadline'], '');
        const moveReason = firstVal(dayItem, ['kochirish_sababi','moveReason','reason'], '');
        const list = arr(dayItem.muddatlar);
        if (!list.length) return [{ ...dayItem, date, day:dp.day, month:dp.month, weekday, count }];
        return list.map((m, i) => ({
          ...m,
          date,
          day: dp.day,
          month: dp.month,
          weekday,
          count: `${i + 1}/${count}`,
          originalDeadline,
          moveReason,
          type: firstVal(m, ['type','turi','category','kategoriya','tur'], ''),
          title: firstVal(m, ['title','nomi','name','mavzu','subject'], ''),
          description: firstVal(m, ['description','izoh','matn','content','text','note','tavsif'], ''),
          reportPeriod: firstVal(m, ['hisobot_davri','period','reportPeriod'], ''),
          note: firstVal(m, ['eslatma','note','izoh'], '')
        }));
      });
    }
    // Another common format: muddatlar[] at top-level.
    if (!events.length && Array.isArray(d.muddatlar)) events = d.muddatlar;
    // BuxgalterPRO JSON may also use oylar[] -> sanalar[] -> muddatlar[].
    if (!events.length && Array.isArray(d.oylar)) {
      events = d.oylar.flatMap(m => {
        const mNum = Number(firstVal(m,['month','oy','number','id'], monthFromName(firstVal(m,['name','nomi','oy_nomi'],'')) || 1));
        const direct = firstArray(m, ['events','deadlines','items','rows','muddatlar']);
        const nestedDates = firstArray(m, ['sanalar','dates','days']);
        if (nestedDates.length) return nestedDates.flatMap(dayItem => arr(dayItem.muddatlar).map((x,i)=>({...x, date:dayItem.sana || dayItem.date, month:mNum, weekday:dayItem.hafta_kuni || dayItem.weekday, count:`${i+1}/${dayItem.muddatlar_soni || arr(dayItem.muddatlar).length}`})));
        return direct.map(x=>({...x, month:mNum}));
      });
    }

    events = arr(events).map((e,idx)=>{
      const dp = dateParts(firstVal(e,['date','sana','deadline','muddat','kun_sana'],''));
      const month = Number(firstVal(e,['month','oy'], dp.month || monthFromName(firstVal(e,['monthName','oy_nomi','oyNomi'],'')) || d.oy || 1));
      const day = Number(firstVal(e,['day','kun','sana_kuni'], dp.day || '')) || '';
      const reportPeriod = firstVal(e,['reportPeriod','hisobot_davri','period','davr'], '');
      const note = firstVal(e,['note','eslatma','izoh'], '');
      const originalDeadline = firstVal(e,['originalDeadline','asl_muddat','original_deadline'], '');
      const moveReason = firstVal(e,['moveReason','kochirish_sababi','reason'], '');
      const typ = inferType(e);
      return {
        id: e.id || `event-${idx}`,
        date: firstVal(e,['date','sana','deadline','muddat'],'') || (day && month ? `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}` : ''),
        day,
        month,
        weekday: langObj(firstVal(e,['weekday','hafta_kuni','kun_nomi','weekDay','dayName'],'')),
        count: firstVal(e,['count','muddat_soni','muddatlar_soni','soni'],'1'),
        type: typ,
        typeLabel: categoryLabel(typ),
        title: langObj(firstVal(e,['title','nomi','name','mavzu','subject','tur'],'Muddat')),
        description: langObj(firstVal(e,['description','izoh','matn','content','text','tavsif'], '') || firstVal(e,['title','nomi','name','mavzu'],'')),
        reportPeriod,
        note,
        originalDeadline,
        moveReason
      };
    }).filter(e=>e.day || t(e.title) || t(e.description));

    if (!months.length && events.length) {
      const mNums = [...new Set(events.map(e => Number(e.month || dateParts(e.date).month)).filter(Boolean))];
      months = mNums.map(mNum => ({ month:mNum, name:langObj(MONTH_NAMES.uz[mNum-1] || String(mNum)), weekdays:WEEKDAYS, weeks:makeCalendarWeeks(year, mNum) }));
    }
    return {...d, year, months, events, stats:d.statistika || d.statistics || {}};
  }

  function renderCalendar(data){
    const d = normalizeCalendarData(data);
    const months = d.months || [];
    const events = d.events || [];
    const monthsWithEvents = [...new Set(events.map(e=>Number(e.month || dateParts(e.date).month)).filter(Boolean))];
    const monthButtons = months.filter(m=>!monthsWithEvents.length || monthsWithEvents.includes(Number(m.month))).map(m=>`<button class="bp-filter month-filter" data-month="${esc(m.month)}">${esc(t(m.name))}</button>`).join('');
    root.innerHTML = sectionHeader(d) + `<div class="bp-controls"><input class="bp-search" data-search placeholder="${lang==='ru'?'Поиск по срокам':lang==='en'?'Search deadlines':lang==='zh'?'搜索期限':'Muddatlar bo‘yicha qidirish'}"><div class="bp-filters"><button class="bp-filter active" data-type="all">${lang==='ru'?'Все':lang==='en'?'All':lang==='zh'?'全部':'Hammasi'}</button><button class="bp-filter" data-type="hisobot">${lang==='ru'?'Отчет':lang==='en'?'Report':lang==='zh'?'报表':'Hisobot'}</button><button class="bp-filter" data-type="tolov">${lang==='ru'?'Платеж':lang==='en'?'Payment':lang==='zh'?'付款':'To‘lov'}</button><button class="bp-filter" data-type="boshqa">${lang==='ru'?'Другое':lang==='en'?'Other':lang==='zh'?'其他':'Boshqa'}</button></div></div><div class="bp-month-strip">${monthButtons}</div><div class="bp-calendar-list" data-calendar-list></div><p class="bp-source-note">${lang==='ru'?'Данные можно обновлять из админ-панели Render.':lang==='en'?'You can update the data from the Render admin panel.':lang==='zh'?'可在 Render 管理面板中更新数据。':'Maʼlumotlarni Render admin panelidan yangilashingiz mumkin.'}</p>`;
    const list = root.querySelector('[data-calendar-list]');
    let type='all', month=monthsWithEvents[0] || 'all';
    const render = () => {
      const q = (root.querySelector('[data-search]').value||'').toLowerCase();
      const rows = events.filter(e=>{
        const m=Number(e.month || dateParts(e.date).month);
        const hay = [t(e.title), t(e.description), t(e.weekday), e.type, e.count].join(' ').toLowerCase();
        return (!month || month==='all' || Number(month)===m) && (type==='all' || String(e.type||'').includes(type)) && (!q || hay.includes(q));
      });
      list.innerHTML = rows.length ? rows.map(e=>{
        const meta = [
          e.reportPeriod ? `${lang==='ru'?'Период':lang==='en'?'Period':lang==='zh'?'期间':'Davr'}: ${e.reportPeriod}` : '',
          e.originalDeadline ? `${lang==='ru'?'Первоначальный срок':lang==='en'?'Original deadline':lang==='zh'?'原期限':'Asl muddat'}: ${e.originalDeadline}` : '',
          e.moveReason || '',
          e.note || ''
        ].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
        return `<article class="bp-deadline-card" data-type="${esc(e.type)}"><div class="bp-deadline-date"><strong>${esc(e.day || dateParts(e.date).day)}</strong><span>${esc(t(e.weekday))}</span></div><div class="bp-deadline-body"><div class="bp-deadline-top"><span class="bp-tag">${esc(t(e.count)||'1')}</span><span class="bp-soft">${esc(t(e.typeLabel)||e.type||'')}</span></div><h3>${esc(t(e.title))}</h3>${t(e.description)&&t(e.description)!==t(e.title)?`<p>${esc(t(e.description))}</p>`:''}${meta?`<div class="bp-deadline-meta">${meta}</div>`:''}</div></article>`;
      }).join('') : `<div class="bp-empty-note">${lang==='ru'?'Ничего не найдено':lang==='en'?'Nothing found':lang==='zh'?'未找到':'Maʼlumot topilmadi'}</div>`;
    };
    root.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-type]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); type=b.dataset.type; render();}));
    root.querySelectorAll('[data-month]').forEach((b,i)=>{ if(i===0) b.classList.add('active'); b.addEventListener('click',()=>{root.querySelectorAll('[data-month]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); month=b.dataset.month; render();});});
    root.querySelector('[data-search]').addEventListener('input',render);
    render();
  }

  function renderMonthCard(m){
    const wds = m.weekdays?.[lang] || m.weekdays?.uz || WEEKDAYS[lang] || WEEKDAYS.uz;
    return `<article class="bp-calendar-month"><h3>${esc(t(m.name))}</h3><div class="bp-mini-week">${wds.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${(m.weeks||[]).map(week=>`<div class="bp-mini-week days">${week.map(d=>`<span class="${!d?'empty':(d===1||d===8||d===21?'holiday':'')}">${d||''}</span>`).join('')}</div>`).join('')}</article>`;
  }
  function normalizeWorkdaysData(data){
    const d = normalizeSectionBase(data, 'workdays', 'workdays');
    let months = arr(d.months || d.oylar || d.calendar || d.kalendar);
    if (!months.length) months = DEFAULT_MONTHS;
    months = months.map((m,i)=>({
      month:Number(firstVal(m,['month','oy','number','id'],i+1)),
      name:m.name || m.nomi || langObj(MONTH_NAMES.uz[i]),
      weekdays:m.weekdays || m.hafta_kunlari || WEEKDAYS,
      weeks:m.weeks || m.haftalar || []
    }));
    let balance = arr(d.balance || d.balans || d.worktime || d.ish_vaqti || d.rows).map((r,i)=>({
      name: r.name || r.nomi || r.oy || langObj(MONTH_NAMES.uz[i] || ''),
      days5: firstVal(r,['days5','ish_kuni_5','kun_5','workdays5','ish_kuni'],''),
      hours5: firstVal(r,['hours5','ish_soati_5','soat_5','workhours5','ish_soati'],''),
      days6: firstVal(r,['days6','ish_kuni_6','kun_6','workdays6'],''),
      hours6: firstVal(r,['hours6','ish_soati_6','soat_6','workhours6'],'')
    }));
    let holidays = arr(d.holidays || d.bayramlar || d.dam_olish_kunlari || d.nonWorkingDays).map(h=>({date:firstVal(h,['date','sana','kun'],''), name:langObj(firstVal(h,['name','nomi','title','izoh'],''))}));
    return {...d, months, balance, holidays};
  }
  function renderWorkdays(data){
    const d = normalizeWorkdaysData(data);
    root.innerHTML = sectionHeader(d) + `<div class="bp-switch"><button class="active" data-work-mode="5">5 ${lang==='ru'?'дней':lang==='en'?'days':lang==='zh'?'天':'kunlik'}</button><button data-work-mode="6">6 ${lang==='ru'?'дней':lang==='en'?'days':lang==='zh'?'天':'kunlik'}</button></div><div class="bp-workday-months">${(d.months||[]).map(renderMonthCard).join('')}</div><div class="bp-subblock"><h3>${lang==='ru'?'Баланс рабочего времени':lang==='en'?'Working time balance':lang==='zh'?'工作时间平衡':'Ish vaqti balansi'}</h3><div class="bp-table-card"><table class="bp-table"><thead><tr><th>${lang==='ru'?'Месяц':lang==='en'?'Month':lang==='zh'?'月份':'Oy'}</th><th>${lang==='ru'?'Рабочие дни':lang==='en'?'Workdays':lang==='zh'?'工作日':'Ish kuni'}</th><th>${lang==='ru'?'Рабочие часы':lang==='en'?'Work hours':lang==='zh'?'工时':'Ish soati'}</th></tr></thead><tbody data-balance></tbody></table></div></div><div class="bp-subblock"><h3>${lang==='ru'?'Нерабочие праздничные дни':lang==='en'?'Non-working holidays':lang==='zh'?'非工作节假日':'Ishlanmaydigan bayram kunlari'}</h3><ul class="bp-clean-list">${(d.holidays||[]).map(h=>`<li><strong>${esc(h.date)}</strong> — ${esc(t(h.name))}</li>`).join('')}</ul></div>`;
    const body=root.querySelector('[data-balance]');
    let mode='5';
    const render=()=>{body.innerHTML=(d.balance||[]).map(r=>`<tr><td>${esc(t(r.name))}</td><td>${esc(mode==='5'?r.days5:(r.days6||r.days5))}</td><td>${esc(mode==='5'?r.hours5:(r.hours6||r.hours5))}</td></tr>`).join('') || `<tr><td colspan="3">${lang==='ru'?'Данные не внесены':lang==='en'?'No data entered':lang==='zh'?'未录入数据':'Maʼlumot kiritilmagan'}</td></tr>`};
    root.querySelectorAll('[data-work-mode]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-work-mode]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); mode=b.dataset.workMode; render();}));
    render();
  }

  function normalizeRentData(data){
    const src = normalizeSectionBase(data, 'rent', 'rent');
    const makeRow = (region, name, residential, nonResidential, extra={}) => ({ region, name: langObj(name), residential, nonResidential, zone: extra.zone || '', isZone: !!extra.isZone, type: extra.type || '' });
    if (Array.isArray(src.regions) && Array.isArray(src.rates) && src.rates.length) {
      return { ...src, regions: src.regions, rows: src.rates, source: 'allfinance', stats: src.statistics || src.statistika || {}, unit: src.unit || src.olchov_birligi || "so‘m/m²/oy" };
    }
    if (Array.isArray(src.hududlar)) {
      const regions = [];
      const rows = [];
      for (const h of src.hududlar) {
        const region = h.hudud || h.region || h.name || '';
        if (!region) continue;
        regions.push(region);
        const places = arr(h.joylar);
        for (const p of places) rows.push(makeRow(region, p.nomi || p.name || '', p.turar_joy ?? p.residential ?? '', p.noturar_joy ?? p.nonResidential ?? '', { type: p.turi || p.type || '' }));
        const zones = arr(h.zonalar);
        for (const z of zones) {
          const zoneName = `${z.zona || z.zone || ''} - zona`;
          rows.push(makeRow(region, zoneName, '', '', { zone: zoneName, isZone: true }));
          if (z.turar_joy || z.residential) rows.push(makeRow(region, 'Turar joy', z.turar_joy ?? z.residential ?? '', '', { zone: zoneName, type: 'turar_joy' }));
          const nr = z.noturar_joy || z.nonResidential || {};
          for (const [key, val] of Object.entries(nr)) {
            const labels = { omborxona:{uz:'Omborxona',ru:'Склад',en:'Warehouse',zh:'仓库'}, ishlab_chiqarish:{uz:'Ishlab chiqarish',ru:'Производство',en:'Production',zh:'生产'}, hunarmandchilik:{uz:'Hunarmandchilik',ru:'Ремесленничество',en:'Handicraft',zh:'手工业'}, xizmat:{uz:'Xizmat ko‘rsatish',ru:'Услуги',en:'Services',zh:'服务'}, umumiy_ovqatlanish:{uz:'Umumiy ovqatlanish',ru:'Общественное питание',en:'Catering',zh:'餐饮'}, boshqalar:{uz:'Boshqalar',ru:'Прочие',en:'Other',zh:'其他'}, savdo:{uz:'Savdo',ru:'Торговля',en:'Trade',zh:'贸易'}, ofis:{uz:'Ofis',ru:'Офис',en:'Office',zh:'办公室'} };
            rows.push(makeRow(region, labels[key] || key.replaceAll('_',' '), '', val, { zone: zoneName, type: key }));
          }
        }
        if (!places.length && !zones.length) rows.push(makeRow(region, h.holat === 'elon_qilinmagan' ? {uz:'Maʼlumot hali eʼlon qilinmagan',ru:'Данные еще не опубликованы',en:'Data has not been published yet',zh:'数据尚未公布'} : {uz:'Maʼlumot kiritilmagan',ru:'Данные не внесены',en:'No data entered',zh:'未录入数据'}, '', '', { type:h.holat || '' }));
      }
      return { ...src, regions, rows, source: 'buxgalterpro-json', stats: src.statistika || src.statistics || {}, unit: src.olchov_birligi || src.unit || "so‘m/m²/oy", headline: src.sarlavha || '' };
    }
    return { ...src, regions: [], rows: [], source: 'empty', stats: src.statistika || src.statistics || {}, unit: src.olchov_birligi || src.unit || "so‘m/m²/oy" };
  }
  function renderRent(data){
    const d = normalizeRentData(data);
    const regions = d.regions || [];
    const rowsAll = d.rows || [];
    const allLabel = lang==='ru'?'Все':lang==='en'?'All':lang==='zh'?'全部':'Hammasi';
    const noData = lang==='ru'?'По этому региону данные пока не внесены':lang==='en'?'No data entered for this region yet':lang==='zh'?'该地区尚无数据':'Bu hudud bo‘yicha maʼlumot hali kiritilmagan';
    const regionButtons = [`<button class="active" data-region="__all">${allLabel}</button>`].concat(regions.map(r=>`<button data-region="${esc(r)}">${esc(r)}</button>`)).join('');
    const stat = d.stats || {};
    const statBadges = [stat.hududlar_soni ? `${stat.hududlar_soni} ${lang==='ru'?'регионов':lang==='en'?'regions':lang==='zh'?'个地区':'ta hudud'}` : '', stat.oddiy_shahar_tuman_qatorlari ? `${stat.oddiy_shahar_tuman_qatorlari} ${lang==='ru'?'строк':lang==='en'?'rows':lang==='zh'?'行':'ta qator'}` : '', d.unit || ''].filter(Boolean).map(x=>`<span class="bp-rent-stat">${esc(x)}</span>`).join('');
    root.innerHTML = sectionHeader(d) + `<div class="bp-rent-layout"><aside class="bp-region-list">${regionButtons}</aside><div><div class="bp-rent-banner"><span>📋 ${esc(d.yil || 2026)} yil</span><h3>${esc(d.headline || t(d.title))}</h3><p>${esc(t(d.subtitle))}</p><div class="bp-rent-stats">${statBadges}</div></div><div class="bp-controls"><input class="bp-search" data-rent-search placeholder="${lang==='ru'?'Поиск по городу, району или виду деятельности':lang==='en'?'Search city, district or activity':lang==='zh'?'搜索城市、区或业务类型':'Shahar, tuman yoki faoliyat turini qidirish'}"></div><div class="bp-table-card"><table class="bp-table"><thead><tr><th>${lang==='ru'?'Регион / город / район':lang==='en'?'Region / city / district':lang==='zh'?'地区/城市/区域':'Hudud / shahar / tuman'}</th><th>${lang==='ru'?'Жилое':lang==='en'?'Residential':lang==='zh'?'住宅':'Turar joy'}</th><th>${lang==='ru'?'Нежилое':lang==='en'?'Non-residential':lang==='zh'?'非住宅':'Noturar joy'}</th></tr></thead><tbody data-rent-body></tbody></table></div></div></div>`;
    const body=root.querySelector('[data-rent-body]'); const search=root.querySelector('[data-rent-search]'); let activeRegion='__all';
    const render=()=>{ const q=(search.value||'').toLowerCase(); const rows=rowsAll.filter(r=>{ const hay=[r.region,t(r.name),r.type,r.zone,r.residential,r.nonResidential].join(' ').toLowerCase(); return (activeRegion==='__all' || r.region===activeRegion) && (!q || hay.includes(q)); }); if(!rows.length){body.innerHTML=`<tr><td colspan="3">${noData}</td></tr>`;return;} let lastRegion=''; body.innerHTML=rows.map(r=>{ const regionLine = activeRegion==='__all' && r.region!==lastRegion ? (lastRegion=r.region, `<tr class="bp-region-row"><td colspan="3">📍 ${esc(r.region)}</td></tr>`) : ''; if(r.isZone) return regionLine + `<tr class="bp-zone-row"><td colspan="3">${esc(t(r.name))}</td></tr>`; return regionLine + `<tr><td><strong>${esc(t(r.name))}</strong>${r.type?`<small>${esc(r.type)}</small>`:''}</td><td>${r.residential?`<span class="rent-pill green">${esc(fmt(r.residential))}</span>`:'—'}</td><td>${r.nonResidential?`<span class="rent-pill blue">${esc(fmt(r.nonResidential))}</span>`:'—'}</td></tr>`; }).join(''); };
    root.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-region]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); activeRegion=b.dataset.region; render();}));
    search.addEventListener('input', render);
    render();
  }

  function normalizeLawsData(data){
    const d = normalizeSectionBase(data, 'laws', 'laws');
    let items = firstArray(d,['items','hujjatlar','qonun_hujjatlar','laws','documents','lex','data','links']).map(x=>({
      category: langObj(firstVal(x,['category','kategoriya','bolim','section','group'],'')),
      title: langObj(firstVal(x,['title','nomi','name','hujjat','document'],'')),
      url: firstVal(x,['url','href','link'],'#'),
      note: langObj(firstVal(x,['note','izoh','description','tavsif','summary'],''))
    })).filter(x=>t(x.title));
    return {...d, items};
  }
  function renderLaws(data){
    const d = normalizeLawsData(data);
    root.innerHTML = sectionHeader(d) + `<div class="bp-controls"><input class="bp-search" data-law-search placeholder="${lang==='ru'?'Поиск документа':lang==='en'?'Search document':lang==='zh'?'搜索文件':'Hujjat qidirish'}"></div><div class="bp-law-grid" data-law-grid></div>`;
    const grid=root.querySelector('[data-law-grid]'), search=root.querySelector('[data-law-search]');
    const render=()=>{const q=(search.value||'').toLowerCase(); const rows=(d.items||[]).filter(x=>[t(x.category),t(x.title),t(x.note)].join(' ').toLowerCase().includes(q)); grid.innerHTML=rows.map(x=>`<a class="bp-law-item" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer"><span>${esc(t(x.category))}</span><strong>${esc(t(x.title))}</strong><em>${esc(t(x.note))}</em></a>`).join('') || `<div class="bp-empty-note">${lang==='ru'?'Ничего не найдено':lang==='en'?'Nothing found':lang==='zh'?'未找到':'Maʼlumot topilmadi'}</div>`};
    search.addEventListener('input',render); render();
  }

  function normalizeLinksData(data){
    const d = normalizeSectionBase(data, 'links', 'links');
    const mapLink = x => ({title:langObj(firstVal(x,['title','nomi','name','label'],'')), url:firstVal(x,['url','href','link'],'#'), note:langObj(firstVal(x,['note','izoh','description','tavsif','summary'],''))});
    let links = firstArray(d,['links','linklar','foydali_linklar','services','xizmatlar','quickLinks','tezkor']).map(mapLink).filter(x=>t(x.title));
    let posts = firstArray(d,['posts','maqolalar','materials','materiallar','articles','items','data']).map(mapLink).filter(x=>t(x.title));
    if (!links.length && posts.length) { links = posts; posts = []; }
    return {...d, links, posts};
  }
  function renderLinks(data){
    const d = normalizeLinksData(data);
    root.innerHTML = sectionHeader(d) + `<div class="bp-subblock"><h3>${lang==='ru'?'Быстрые сервисы':lang==='en'?'Quick services':lang==='zh'?'快捷服务':'Tezkor xizmatlar'}</h3><div class="bp-link-grid">${(d.links||[]).map(x=>`<a class="bp-link-item" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(t(x.title))}</strong><span>${esc(t(x.note))}</span></a>`).join('') || `<div class="bp-empty-note">${lang==='ru'?'Данные не внесены':lang==='en'?'No data entered':lang==='zh'?'未录入数据':'Maʼlumot kiritilmagan'}</div>`}</div></div><div class="bp-subblock"><h3>${lang==='ru'?'Полезные материалы':lang==='en'?'Useful materials':lang==='zh'?'实用资料':'Foydali materiallar'}</h3><div class="bp-link-grid">${(d.posts||[]).map(x=>`<a class="bp-link-item" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(t(x.title))}</strong><span>${esc(t(x.note))}</span></a>`).join('')}</div></div>`;
  }

  function normalizedForHub(slug, data){
    if (slug === 'calendar') return normalizeCalendarData(data);
    if (slug === 'workdays') return normalizeWorkdaysData(data);
    if (slug === 'rent') return normalizeRentData(data);
    if (slug === 'laws') return normalizeLawsData(data);
    if (slug === 'links') return normalizeLinksData(data);
    if (slug === 'info') return normalizeInfoData(data);
    return normalizeSectionBase(data, slug, slug);
  }

  async function initPage(){
    if(root){
      const slug=root.dataset.usefulCustomPage;
      root.innerHTML='<div class="bp-empty-note">Yuklanmoqda...</div>';
      try{
        const data=await get(slug);
        const kind = String(data.kind || slug);
        if(kind==='calendar' || slug==='calendar') renderCalendar(data);
        else if(kind==='workdays' || slug==='workdays') renderWorkdays(data);
        else if(kind==='rent' || slug==='rent') renderRent(data);
        else if(kind==='laws' || slug==='laws') renderLaws(data);
        else if(kind==='links' || slug==='links') renderLinks(data);
        else root.innerHTML=sectionHeader(normalizeSectionBase(data, slug, kind));
      } catch(e){root.innerHTML=`<div class="bp-empty-note">${esc(e.message)}</div>`;}
    }
    if(hub){
      try{
        const all=await getAll();
        const cards = ['calendar','workdays','rent','laws','links'];
        const labels={calendar:'📅',workdays:'🗓️',rent:'🏢',laws:'⚖️',links:'🔗'};
        const urls={calendar:'foydali-calendar.html',workdays:'foydali-workdays.html',rent:'foydali-rent.html',laws:'foydali-laws.html',links:'foydali-links.html'};
        hub.innerHTML = cards.map(slug=>{const d=normalizedForHub(slug, (all.sections||{})[slug]||{}); return `<a class="bp-tool-card" href="${urls[slug]}"><div class="bp-tool-icon"><span class="bp-card-emoji">${labels[slug]}</span></div><div class="bp-tool-body"><small>ALL FINANCE baza</small><strong>${esc(t(d.title))}</strong><em>${esc(t(d.subtitle))}</em></div><span class="bp-open">Ochish →</span></a>`}).join('');
      }catch(e){}
    }
    if(infoBoxes.length){ try{ const info=await get('info'); infoBoxes.forEach(box=>renderInfo(info,box)); }catch(e){} }
  }
  initPage();
})();
