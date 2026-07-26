(function(){
  const LANG = document.documentElement.lang || 'uz';
  const lang = ['uz','ru','en','zh'].includes(LANG) ? LANG : 'uz';
  const root = document.querySelector('[data-useful-custom-page]');
  const hub = document.querySelector('[data-useful-hub]');
  const infoBoxes = Array.from(document.querySelectorAll('[data-useful-info]'));
  const t = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) return v[lang] || v.uz || v.ru || v.en || v.zh || '';
    return v == null ? '' : String(v);
  };
  const esc = v => String(v ?? '').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  const fmt = v => (v === '' || v == null) ? '—' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  async function get(slug){
    const res = await fetch(`/api/useful-custom/${slug}?lang=${lang}`, {cache:'no-store'});
    if(!res.ok) throw new Error('Maʼlumot yuklanmadi');
    return await res.json();
  }
  async function getAll(){
    const res = await fetch(`/api/useful-custom?lang=${lang}`, {cache:'no-store'});
    if(!res.ok) throw new Error('Maʼlumot yuklanmadi');
    return await res.json();
  }
  function sectionHeader(d){
    return `<div class="bp-toolbar custom-bp-title"><div><span class="bp-pill">${esc(d.sourceName||'ALL FINANCE')}</span><h2>${esc(t(d.title))}</h2><p>${esc(t(d.subtitle))}</p></div><a class="bp-back" href="foydali.html">← ${lang==='ru'?'Полезная база':lang==='en'?'Useful resources':lang==='zh'?'实用资料库':'Foydali baza'}</a></div>`;
  }
  function renderInfo(data, target){
    const metrics = (data.metrics||[]).map(m=>`<div><span>${esc(t(m.label))}</span><strong>${esc(m.value)}</strong></div>`).join('');
    const links = (data.links||[]).slice(0,6).map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(t(l.title))}</a>`).join('');
    target.innerHTML = `<div class="bp-info-head"><span class="eyebrow">${lang==='ru'?'Редактируется в Render':lang==='en'?'Managed in Render':lang==='zh'?'在 Render 中维护':'Render orqali boshqariladi'}</span><h3>${esc(t(data.title))}</h3><p>${esc(t(data.subtitle))}</p></div><div class="bp-info-list">${metrics}</div><div class="quick-links-box"><h4>${lang==='ru'?'Быстрый переход':lang==='en'?'Quick access':lang==='zh'?'快捷入口':'Tezkor o‘tish'}</h4><div>${links}</div></div>`;
  }
  function dateParts(date){
    const d = new Date(date+'T00:00:00');
    return {day: d.getDate(), month: d.getMonth()+1};
  }
  function renderCalendar(data){
    const months = data.months || [];
    const events = data.events || [];
    const monthsWithEvents = [...new Set(events.map(e=>Number(e.month || dateParts(e.date).month)))];
    const monthButtons = months.filter(m=>monthsWithEvents.includes(Number(m.month))).map(m=>`<button class="bp-filter month-filter" data-month="${esc(m.month)}">${esc(t(m.name))}</button>`).join('');
    root.innerHTML = sectionHeader(data) + `<div class="bp-controls"><input class="bp-search" data-search placeholder="${lang==='ru'?'Поиск по срокам':lang==='en'?'Search deadlines':lang==='zh'?'搜索期限':'Muddatlar bo‘yicha qidirish'}"><div class="bp-filters"><button class="bp-filter active" data-type="all">${lang==='ru'?'Все':lang==='en'?'All':lang==='zh'?'全部':'Hammasi'}</button><button class="bp-filter" data-type="hisobot">${lang==='ru'?'Отчет':lang==='en'?'Report':lang==='zh'?'报表':'Hisobot'}</button><button class="bp-filter" data-type="tolov">${lang==='ru'?'Платеж':lang==='en'?'Payment':lang==='zh'?'付款':'To‘lov'}</button><button class="bp-filter" data-type="boshqa">${lang==='ru'?'Другое':lang==='en'?'Other':lang==='zh'?'其他':'Boshqa'}</button></div></div><div class="bp-month-strip">${monthButtons}</div><div class="bp-calendar-list" data-calendar-list></div><p class="bp-source-note">${lang==='ru'?'Данные можно обновлять из админ-панели Render.':lang==='en'?'You can update the data from the Render admin panel.':lang==='zh'?'可在 Render 管理面板中更新数据。':'Maʼlumotlarni Render admin panelidan yangilashingiz mumkin.'}</p>`;
    const list = root.querySelector('[data-calendar-list]');
    let type='all', month=monthsWithEvents[0] || 'all';
    const render = () => {
      const q = (root.querySelector('[data-search]').value||'').toLowerCase();
      const rows = events.filter(e=>{
        const m=Number(e.month || dateParts(e.date).month);
        const hay = [t(e.title), t(e.description), t(e.weekday), e.type, e.count].join(' ').toLowerCase();
        return (!month || month==='all' || Number(month)===m) && (type==='all' || String(e.type||'').includes(type)) && (!q || hay.includes(q));
      });
      list.innerHTML = rows.length ? rows.map(e=>`<article class="bp-deadline-card" data-type="${esc(e.type)}"><div class="bp-deadline-date"><strong>${esc(e.day || dateParts(e.date).day)}</strong><span>${esc(t(e.weekday))}</span></div><div class="bp-deadline-body"><div class="bp-deadline-top"><span class="bp-tag">${esc(t(e.count)||'1')}</span><span class="bp-soft">${esc(e.type||'')}</span></div><h3>${esc(t(e.title))}</h3><p>${esc(t(e.description))}</p></div></article>`).join('') : `<div class="bp-empty-note">${lang==='ru'?'Ничего не найдено':lang==='en'?'Nothing found':lang==='zh'?'未找到':'Maʼlumot topilmadi'}</div>`;
    };
    root.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-type]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); type=b.dataset.type; render();}));
    root.querySelectorAll('[data-month]').forEach((b,i)=>{ if(i===0) b.classList.add('active'); b.addEventListener('click',()=>{root.querySelectorAll('[data-month]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); month=b.dataset.month; render();});});
    root.querySelector('[data-search]').addEventListener('input',render);
    render();
  }
  function renderMonthCard(m){
    const wds = m.weekdays?.[lang] || m.weekdays?.uz || ['Du','Se','Cho','Pa','Ju','Sha','Ya'];
    return `<article class="bp-calendar-month"><h3>${esc(t(m.name))}</h3><div class="bp-mini-week">${wds.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${(m.weeks||[]).map(week=>`<div class="bp-mini-week days">${week.map(d=>`<span class="${!d?'empty':(d===1||d===8||d===21?'holiday':'')}">${d||''}</span>`).join('')}</div>`).join('')}</article>`;
  }
  function renderWorkdays(data){
    root.innerHTML = sectionHeader(data) + `<div class="bp-switch"><button class="active" data-work-mode="5">5 ${lang==='ru'?'дней':lang==='en'?'days':lang==='zh'?'天':'kunlik'}</button><button data-work-mode="6">6 ${lang==='ru'?'дней':lang==='en'?'days':lang==='zh'?'天':'kunlik'}</button></div><div class="bp-workday-months">${(data.months||[]).map(renderMonthCard).join('')}</div><div class="bp-subblock"><h3>${lang==='ru'?'Баланс рабочего времени':lang==='en'?'Working time balance':lang==='zh'?'工作时间平衡':'Ish vaqti balansi'}</h3><div class="bp-table-card"><table class="bp-table"><thead><tr><th>${lang==='ru'?'Месяц':lang==='en'?'Month':lang==='zh'?'月份':'Oy'}</th><th>${lang==='ru'?'Рабочие дни':lang==='en'?'Workdays':lang==='zh'?'工作日':'Ish kuni'}</th><th>${lang==='ru'?'Рабочие часы':lang==='en'?'Work hours':lang==='zh'?'工时':'Ish soati'}</th></tr></thead><tbody data-balance></tbody></table></div></div><div class="bp-subblock"><h3>${lang==='ru'?'Нерабочие праздничные дни':lang==='en'?'Non-working holidays':lang==='zh'?'非工作节假日':'Ishlanmaydigan bayram kunlari'}</h3><ul class="bp-clean-list">${(data.holidays||[]).map(h=>`<li><strong>${esc(h.date)}</strong> — ${esc(t(h.name))}</li>`).join('')}</ul></div>`;
    const body=root.querySelector('[data-balance]');
    let mode='5';
    const render=()=>{body.innerHTML=(data.balance||[]).map(r=>`<tr><td>${esc(t(r.name))}</td><td>${esc(mode==='5'?r.days5:(r.days6||r.days5))}</td><td>${esc(mode==='5'?r.hours5:(r.hours6||r.hours5))}</td></tr>`).join('')};
    root.querySelectorAll('[data-work-mode]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-work-mode]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); mode=b.dataset.workMode; render();}));
    render();
  }
  function renderRent(data){
    const regions=data.regions||[]; const rates=data.rates||[]; let region=regions[0]||'';
    root.innerHTML = sectionHeader(data) + `<div class="bp-rent-layout"><aside class="bp-region-list">${regions.map((r,i)=>`<button class="${i===0?'active':''}" data-region="${esc(r)}">${esc(r)}</button>`).join('')}</aside><div><div class="bp-rent-banner"><span>📋 2026 yil</span><h3>${esc(t(data.title))}</h3><p>${esc(t(data.subtitle))}</p></div><div class="bp-table-card"><table class="bp-table"><thead><tr><th>${lang==='ru'?'Город / район':lang==='en'?'City / district':lang==='zh'?'城市/区域':'Shahar / tuman'}</th><th>${lang==='ru'?'Жилое':lang==='en'?'Residential':lang==='zh'?'住宅':'Turar joy'}</th><th>${lang==='ru'?'Нежилое':lang==='en'?'Non-residential':lang==='zh'?'非住宅':'Noturar joy'}</th></tr></thead><tbody data-rent-body></tbody></table></div></div></div>`;
    const body=root.querySelector('[data-rent-body]');
    const render=()=>{const rows=rates.filter(r=>r.region===region); body.innerHTML=rows.length?rows.map(r=>r.isZone?`<tr class="bp-zone-row"><td colspan="3">${esc(t(r.name))}</td></tr>`:`<tr><td>${esc(t(r.name))}</td><td>${r.residential?`<span class="rent-pill green">${esc(fmt(r.residential))}</span>`:'—'}</td><td>${r.nonResidential?`<span class="rent-pill blue">${esc(fmt(r.nonResidential))}</span>`:'—'}</td></tr>`).join(''):`<tr><td colspan="3">${lang==='ru'?'Данные по региону пока не внесены':lang==='en'?'No data entered for this region yet':lang==='zh'?'该地区尚无数据':'Bu hudud bo‘yicha maʼlumot hali kiritilmagan'}</td></tr>`;};
    root.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('[data-region]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); region=b.dataset.region; render();})); render();
  }
  function renderLaws(data){
    root.innerHTML = sectionHeader(data) + `<div class="bp-controls"><input class="bp-search" data-law-search placeholder="${lang==='ru'?'Поиск документа':lang==='en'?'Search document':lang==='zh'?'搜索文件':'Hujjat qidirish'}"></div><div class="bp-law-grid" data-law-grid></div>`;
    const grid=root.querySelector('[data-law-grid]'), search=root.querySelector('[data-law-search]');
    const render=()=>{const q=(search.value||'').toLowerCase(); const rows=(data.items||[]).filter(x=>[t(x.category),t(x.title),t(x.note)].join(' ').toLowerCase().includes(q)); grid.innerHTML=rows.map(x=>`<a class="bp-law-item" href="${esc(x.url||'#')}" target="_blank" rel="noopener noreferrer"><span>${esc(t(x.category))}</span><strong>${esc(t(x.title))}</strong><em>${esc(t(x.note))}</em></a>`).join('') || `<div class="bp-empty-note">${lang==='ru'?'Ничего не найдено':lang==='en'?'Nothing found':lang==='zh'?'未找到':'Maʼlumot topilmadi'}</div>`}; search.addEventListener('input',render); render();
  }
  function renderLinks(data){
    root.innerHTML = sectionHeader(data) + `<div class="bp-subblock"><h3>${lang==='ru'?'Быстрые сервисы':lang==='en'?'Quick services':lang==='zh'?'快捷服务':'Tezkor xizmatlar'}</h3><div class="bp-link-grid">${(data.links||[]).map(x=>`<a class="bp-link-item" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(t(x.title))}</strong><span>${esc(t(x.note))}</span></a>`).join('')}</div></div><div class="bp-subblock"><h3>${lang==='ru'?'Полезные материалы':lang==='en'?'Useful materials':lang==='zh'?'实用资料':'Foydali materiallar'}</h3><div class="bp-link-grid">${(data.posts||[]).map(x=>`<a class="bp-link-item" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(t(x.title))}</strong><span>${esc(t(x.note))}</span></a>`).join('')}</div></div>`;
  }
  async function initPage(){
    if(root){
      const slug=root.dataset.usefulCustomPage;
      root.innerHTML='<div class="bp-empty-note">Yuklanmoqda...</div>';
      try{ const data=await get(slug); if(data.kind==='calendar') renderCalendar(data); else if(data.kind==='workdays') renderWorkdays(data); else if(data.kind==='rent') renderRent(data); else if(data.kind==='laws') renderLaws(data); else if(data.kind==='links') renderLinks(data); else root.innerHTML=sectionHeader(data); }
      catch(e){root.innerHTML=`<div class="bp-empty-note">${esc(e.message)}</div>`;}
    }
    if(hub){
      try{
        const all=await getAll();
        const cards = ['calendar','workdays','rent','laws','links'];
        const labels={calendar:'📅',workdays:'🗓️',rent:'🏢',laws:'⚖️',links:'🔗'};
        const urls={calendar:'foydali-calendar.html',workdays:'foydali-workdays.html',rent:'foydali-rent.html',laws:'foydali-laws.html',links:'foydali-links.html'};
        hub.innerHTML = cards.map(slug=>{const d=all.sections[slug]||{}; return `<a class="bp-tool-card" href="${urls[slug]}"><div class="bp-tool-icon"><span class="bp-card-emoji">${labels[slug]}</span></div><div class="bp-tool-body"><small>ALL FINANCE baza</small><strong>${esc(t(d.title))}</strong><em>${esc(t(d.subtitle))}</em></div><span class="bp-open">Ochish →</span></a>`}).join('');
      }catch(e){}
    }
    if(infoBoxes.length){ try{ const info=await get('info'); infoBoxes.forEach(box=>renderInfo(info,box)); }catch(e){} }
  }
  initPage();
})();
