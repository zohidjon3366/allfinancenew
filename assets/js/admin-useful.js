const $ = id => document.getElementById(id);
let store = null;
let currentSlug = 'info';
const LANGS = ['uz','ru','en','zh'];
const SLUG_LABELS = {
  info: 'Amaldagi info',
  calendar: 'Buxgalter taqvimi',
  workdays: '2026 ish kunlari',
  rent: 'Ijara stavkalari',
  laws: 'Qonun hujjatlar',
  links: 'Foydali linklar'
};
const META_KEYS = new Set(['slug','kind','title','subtitle','sourceName','sourceUrl','langData']);
function escapeHtml(value){return String(value||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));}
function showMessage(el, text, ok=false){el.textContent=text||''; el.className='message '+(ok?'success':'');}
function safeStringify(value){return JSON.stringify(value && typeof value === 'object' ? value : {}, null, 2);}
function parseJsonField(id, label){
  const text = ($(id)?.value || '').trim();
  if(!text) return {};
  try{
    const parsed = JSON.parse(text);
    if(!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('JSON obyekt bo‘lishi kerak');
    return parsed;
  }catch(e){
    throw new Error(label + ' JSON bloki noto‘g‘ri: ' + e.message);
  }
}
function basePayload(section){
  const copy = JSON.parse(JSON.stringify(section || {}));
  for(const key of META_KEYS) delete copy[key];
  return copy;
}
function isNonEmptyObject(value){return value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;}
async function api(url, options={}){
  const res = await fetch(url,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  let data={}; try{data=await res.json();}catch{}
  if(res.status===401){showLogin(); throw new Error(data.message||'Sessiya tugadi');}
  if(!res.ok) throw new Error(data.message||'Xatolik yuz berdi');
  return data;
}
function showLogin(){ $('loginView').classList.remove('hidden'); $('panelView').classList.add('hidden'); }
function showPanel(){ $('loginView').classList.add('hidden'); $('panelView').classList.remove('hidden'); }
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); showMessage($('loginMessage'),'');
  try{await api('/api/admin/login',{method:'POST',body:JSON.stringify({password:$('password').value})}); $('password').value=''; showPanel(); await loadStore();}
  catch(err){showMessage($('loginMessage'),err.message);}
});
$('logoutBtn').addEventListener('click',async()=>{try{await api('/api/admin/logout',{method:'POST',body:'{}'});}finally{showLogin();}});
async function checkSession(){ try{await api('/api/admin/session'); showPanel(); await loadStore();}catch{showLogin();} }
async function loadStore(){
  store = await api('/api/admin/useful-custom');
  renderSectionList();
  selectSection(currentSlug);
}
function renderSectionList(){
  const sections = store.sections || {};
  $('sectionList').innerHTML = Object.keys(sections).map(slug=>`<button class="useful-admin-item ${slug===currentSlug?'active':''}" data-slug="${escapeHtml(slug)}"><strong>${escapeHtml(SLUG_LABELS[slug]||slug)}</strong><span>${escapeHtml(slug)} · ${escapeHtml(sections[slug].kind||'section')}</span></button>`).join('');
  $('sectionList').querySelectorAll('[data-slug]').forEach(b=>b.onclick=()=>selectSection(b.dataset.slug));
}
function selectSection(slug){
  currentSlug = slug;
  const d = store.sections[slug];
  if(!d) return;
  renderSectionList();
  $('editorTitle').textContent = SLUG_LABELS[slug] || slug;
  $('slug').value = d.slug || slug;
  $('kind').value = d.kind || '';
  $('sourceName').value = d.sourceName || '';
  $('sourceUrl').value = d.sourceUrl || '';
  LANGS.forEach(l=>{
    $(`title_${l}`).value = d.title?.[l] || '';
    $(`subtitle_${l}`).value = d.subtitle?.[l] || '';
  });
  const base = basePayload(d);
  const langData = d.langData && typeof d.langData === 'object' ? d.langData : null;
  LANGS.forEach(l=>{
    const value = langData && isNonEmptyObject(langData[l]) ? langData[l] : (l === 'uz' ? base : {});
    $(`json_${l}`).value = safeStringify(value);
  });
  showMessage($('formMessage'),'');
}
function collect(){
  const langData = {};
  LANGS.forEach(l=>{ langData[l] = parseJsonField(`json_${l}`, l.toUpperCase()); });
  const uzData = langData.uz || {};
  const data = {
    ...uzData,
    slug: $('slug').value.trim() || currentSlug,
    kind: $('kind').value.trim(),
    sourceName: $('sourceName').value.trim(),
    sourceUrl: $('sourceUrl').value.trim(),
    title:{},
    subtitle:{},
    langData
  };
  LANGS.forEach(l=>{ data.title[l]=$(`title_${l}`).value.trim(); data.subtitle[l]=$(`subtitle_${l}`).value.trim(); });
  return data;
}
$('sectionForm').addEventListener('submit',async e=>{
  e.preventDefault();
  showMessage($('formMessage'),'Saqlanmoqda...');
  try{
    const payload = collect();
    await api(`/api/admin/useful-custom/${encodeURIComponent(currentSlug)}`, {method:'PUT', body:JSON.stringify(payload)});
    showMessage($('formMessage'),'Maʼlumotlar saqlandi. Saytda darhol ko‘rinadi.',true);
    await loadStore(); selectSection(payload.slug || currentSlug);
  }catch(err){showMessage($('formMessage'),err.message);}
});
$('downloadBtn').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(store,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'allfinance-foydali-malumotlar.json'; a.click(); URL.revokeObjectURL(a.href);
});
$('resetBtn').addEventListener('click',async()=>{
  if(!confirm('Foydali maʼlumotlarni boshlang‘ich paketdagi holatga qaytarasizmi?')) return;
  try{await api('/api/admin/useful-custom/reset',{method:'POST',body:'{}'}); await loadStore(); alert('Boshlang‘ich maʼlumotlar qayta tiklandi.');}catch(err){alert(err.message);}
});
document.querySelectorAll('[data-lang-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-lang-tab]').forEach(x=>x.classList.toggle('active',x===btn));
  document.querySelectorAll('[data-lang-panel]').forEach(x=>x.classList.toggle('active',x.dataset.langPanel===btn.dataset.langTab));
}));
checkSession();
