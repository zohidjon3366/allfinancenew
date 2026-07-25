const usefulLang = document.body.dataset.lang || 'uz';
const usefulUI = {
  uz:{loading:'Yuklanmoqda...',empty:'Maʼlumot topilmadi',updated:'Yangilangan',source:'Manba',cache:'saqlangan nusxa',refresh:'Yangilash'},
  ru:{loading:'Загрузка...',empty:'Данные не найдены',updated:'Обновлено',source:'Источник',cache:'кэш',refresh:'Обновить'},
  en:{loading:'Loading...',empty:'No data found',updated:'Updated',source:'Source',cache:'cached',refresh:'Refresh'},
  zh:{loading:'正在加载...',empty:'未找到数据',updated:'更新',source:'来源',cache:'缓存',refresh:'刷新'}
};
const UT = usefulUI[usefulLang] || usefulUI.uz;
const usefulPanel = document.getElementById('usefulLivePanel');
const usefulTitle = document.getElementById('usefulLiveTitle');
const usefulContent = document.getElementById('usefulLiveContent');
const usefulSource = document.getElementById('usefulLiveSource');
const usefulMeta = document.getElementById('usefulLiveMeta');
const infoMetrics = document.getElementById('usefulInfoMetrics');
const infoLinks = document.getElementById('usefulInfoLinks');
let currentUsefulSlug = 'calendar';
function uEsc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function uDate(v){try{return new Date(v).toLocaleString(usefulLang==='ru'?'ru-RU':usefulLang==='en'?'en-US':usefulLang==='zh'?'zh-CN':'uz-UZ',{dateStyle:'medium',timeStyle:'short'});}catch{return v||''}}
function safeHost(href){try{return new URL(href, location.origin).hostname.replace(/^www\./,'')}catch{return ''}}
function renderTable(group){
  const cols = group.columns || [];
  const rows = group.rows || [];
  return `<div class="useful-table-wrap"><table class="useful-table"><thead><tr>${cols.map(c=>`<th>${uEsc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${uEsc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function renderTimeline(group){
  const rows = group.rows || [];
  return `<div class="useful-timeline">${rows.map(x=>`<article class="useful-timeline-item"><div class="useful-date"><strong>${uEsc(x.date)}</strong><span>${uEsc(x.weekday)}</span></div><div class="useful-deadline"><div><span class="useful-badge">${uEsc(x.badge)}</span><span class="useful-cat">${uEsc(x.category)}</span></div><p>${uEsc(x.text)}</p></div></article>`).join('')}</div>`;
}
function renderCards(group){
  const cards = group.cards || [];
  return `<div class="useful-mini-cards">${cards.map(x=>`<article><h4>${uEsc(x.title)}</h4><p>${uEsc(x.text)}</p></article>`).join('')}</div>`;
}
function renderLinks(group){
  const links = (group.links||[]).filter(x=>x && x.text && x.href);
  return `<div class="useful-link-grid">${links.map(x=>`<a href="${uEsc(x.href)}" target="_blank" rel="noopener noreferrer"><span>${uEsc(x.text)}</span><small>${uEsc(safeHost(x.href))}</small></a>`).join('')}</div>`;
}
function renderItems(group){
  const items = (group.items||[]).filter(Boolean);
  return `<div class="useful-data-list">${items.map(x=>`<div class="useful-data-row"><span>${uEsc(x)}</span></div>`).join('')}</div>`;
}
function renderGroup(group){
  let inner = '';
  if(group.type==='table') inner = renderTable(group);
  else if(group.type==='timeline') inner = renderTimeline(group);
  else if(group.type==='cards') inner = renderCards(group);
  else if(group.type==='links') inner = renderLinks(group);
  else inner = renderItems(group);
  return `<section class="useful-data-group"><h3>${uEsc(group.title)}</h3>${inner}</section>`;
}
function renderUseful(data){
  if(!usefulPanel || !usefulContent) return;
  usefulPanel.classList.remove('hidden');
  usefulTitle.textContent = data.title || UT.empty;
  if(usefulSource){
    usefulSource.href = data.sourceUrl || '#';
    usefulSource.textContent = `${UT.source}: ${data.sourceName || safeHost(data.sourceUrl || '')}`;
  }
  if(usefulMeta) usefulMeta.textContent = `${UT.updated}: ${uDate(data.updatedAt)}${data.fromCache ? ' · ' + UT.cache : ''}`;
  const metrics = (data.metrics||[]).map(x=>`<div class="useful-metric"><span>${uEsc(x.label)}</span><strong>${uEsc(x.value)}</strong></div>`).join('');
  usefulContent.innerHTML = `${data.warning?`<div class="useful-warning">${uEsc(data.warning)}</div>`:''}<p class="useful-summary">${uEsc(data.summary||'')}</p>${metrics?`<div class="useful-metrics-grid">${metrics}</div>`:''}${(data.groups||[]).map(renderGroup).join('') || `<div class="news-loading">${UT.empty}</div>`}`;
  usefulPanel.scrollIntoView({behavior:'smooth', block:'start'});
}
async function loadUseful(slug=currentUsefulSlug, refresh=false){
  currentUsefulSlug = slug;
  document.querySelectorAll('[data-useful]').forEach(btn=>btn.classList.toggle('active', btn.dataset.useful===slug));
  if(usefulContent){
    usefulPanel?.classList.remove('hidden');
    usefulTitle.textContent = document.querySelector(`[data-useful="${slug}"] strong`)?.textContent || '';
    usefulContent.innerHTML = `<div class="news-loading">${UT.loading}</div>`;
    if(usefulMeta) usefulMeta.textContent='';
  }
  try{
    const res = await fetch(`/api/useful/${encodeURIComponent(slug)}?lang=${encodeURIComponent(usefulLang)}${refresh?'&refresh=1':''}`);
    const data = await res.json();
    if(!res.ok) throw new Error(data.message || 'Load error');
    renderUseful(data);
  }catch(err){
    if(usefulContent) usefulContent.innerHTML = `<div class="useful-warning">${uEsc(err.message||UT.empty)}</div>`;
  }
}
async function loadUsefulInfo(){
  try{
    const res = await fetch(`/api/useful/info?lang=${encodeURIComponent(usefulLang)}`);
    const data = await res.json();
    if(!res.ok) throw new Error('info');
    if(infoMetrics && data.metrics){
      infoMetrics.innerHTML = data.metrics.map(x=>`<div><span>${uEsc(x.label)}</span><strong>${uEsc(x.value)}</strong></div>`).join('');
    }
    const links = (data.groups||[]).flatMap(g=>g.links||[]).slice(0,8);
    if(infoLinks && links.length){
      infoLinks.innerHTML = links.map(x=>`<a href="${uEsc(x.href)}" target="_blank" rel="noopener noreferrer">${uEsc(x.text)}</a>`).join('');
    }
  }catch{}
}
document.querySelectorAll('[data-useful]').forEach(btn=>btn.addEventListener('click',()=>loadUseful(btn.dataset.useful)));
document.getElementById('usefulRefreshBtn')?.addEventListener('click',()=>loadUseful(currentUsefulSlug,true));
if(document.body.dataset.page==='useful'){
  loadUseful('calendar');
  loadUsefulInfo();
}
