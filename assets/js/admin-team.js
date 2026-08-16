const $ = id => document.getElementById(id);
const LANGS = ['uz','ru','en','zh'];
const LANG_LABELS = {uz:'UZ', ru:'RU', en:'EN', zh:'ZH'};
let members = [];
let imageData = '';
let imageName = '';
let removeImage = false;
function escapeHtml(value){return String(value||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));}
function showMessage(el, text, ok=false){el.textContent=text||''; el.className='message '+(ok?'success':'');}
async function api(url, options={}){
  const res = await fetch(url,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  let data={}; try{data=await res.json();}catch{}
  if(res.status===401){showLogin(); throw new Error(data.message||'Sessiya tugadi');}
  if(!res.ok) throw new Error(data.message||'Xatolik yuz berdi');
  return data;
}
function showLogin(){ $('loginView').classList.remove('hidden'); $('panelView').classList.add('hidden'); }
function showPanel(){ $('loginView').classList.add('hidden'); $('panelView').classList.remove('hidden'); }
async function checkSession(){ try{await api('/api/admin/session'); showPanel(); await loadTeam(); resetForm(false);}catch{showLogin();} }
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); showMessage($('loginMessage'),'');
  try{await api('/api/admin/login',{method:'POST',body:JSON.stringify({password:$('password').value})}); $('password').value=''; showPanel(); await loadTeam(); resetForm(false);}catch(err){showMessage($('loginMessage'),err.message);}
});
$('logoutBtn').addEventListener('click',async()=>{try{await api('/api/admin/logout',{method:'POST',body:'{}'});}finally{showLogin();}});
$('newBtn').addEventListener('click',()=>resetForm(true));
$('searchInput').addEventListener('input',renderList);
$('statusFilter').addEventListener('change',renderList);
document.querySelectorAll('[data-lang-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-lang-tab]').forEach(x=>x.classList.toggle('active',x===btn));
  document.querySelectorAll('[data-lang-panel]').forEach(x=>x.classList.toggle('active',x.dataset.langPanel===btn.dataset.langTab));
}));
function tr(item, lang='uz'){return item.translations?.[lang]||{};}
function state(item, lang){const t=tr(item,lang); const vals=[t.name,t.role,t.experienceText].map(v=>String(v||'').trim()); if(vals.every(Boolean)) return 'complete'; if(vals.some(Boolean)) return 'partial'; return 'missing';}
function badges(item){return `<div class="lang-status-badges">${LANGS.map(l=>`<span class="lang-status ${state(item,l)} lang-${l}">${LANG_LABELS[l]}</span>`).join('')}</div>`;}
async function loadTeam(){members = await api('/api/admin/team'); renderList();}
function renderList(){
  const q=$('searchInput').value.trim().toLowerCase(); const status=$('statusFilter').value;
  const filtered=members.filter(m=>{
    const all=LANGS.map(l=>{const t=tr(m,l); return `${t.name||''} ${t.role||''} ${t.experienceText||''}`;}).join(' ').toLowerCase();
    return (status==='all'||(m.status||'active')===status)&&(!q||all.includes(q));
  }).sort((a,b)=>Number(a.order||100)-Number(b.order||100));
  $('teamCount').textContent=members.length;
  $('teamList').innerHTML=filtered.length?filtered.map(m=>{
    const u=tr(m); const title=u.name||m.id; const role=u.role||'';
    const img=m.image?`<img class="team-mini-photo" src="${escapeHtml(m.image)}" alt="${escapeHtml(title)}">`:'<span class="team-mini-photo placeholder">?</span>';
    return `<article class="news-item ${$('editingId').value===m.id?'active':''}">
      <div class="news-item-top team-admin-top"><div class="team-admin-mini">${img}<div><span class="eyebrow">#${escapeHtml(m.order||100)} · ${(m.status||'active')==='hidden'?'Yashirilgan':'Faol'}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(role)}</p></div></div><span class="status-chip ${m.status==='hidden'?'draft':'published'}">${m.status==='hidden'?'Yashirilgan':'Ko‘rinadi'}</span></div>
      ${badges(m)}
      <div class="item-actions"><button data-edit="${escapeHtml(m.id)}">Tahrirlaş</button><button class="delete" data-delete="${escapeHtml(m.id)}">Öçiriş</button></div>
    </article>`;
  }).join(''):'<div class="news-item"><p>Xodim topilmadi.</p></div>';
  $('teamList').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editMember(b.dataset.edit));
  $('teamList').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteMember(b.dataset.delete));
}
function resetForm(scroll=true){
  $('teamForm').reset(); $('editingId').value=''; $('formTitle').textContent='Yangi xodim'; $('order').value=(members.length+1)*10; $('status').value='active';
  imageData=''; imageName=''; removeImage=false; $('imagePreviewWrap').classList.add('hidden'); $('imagePreview').removeAttribute('src'); $('compressionInfo').textContent=''; showMessage($('formMessage'),''); renderList(); if(scroll) window.scrollTo({top:0,behavior:'smooth'});
}
function editMember(id){
  const m=members.find(x=>x.id===id); if(!m) return;
  $('editingId').value=m.id; $('formTitle').textContent='Xodimni tahrirlaş'; $('order').value=m.order||100; $('status').value=m.status||'active';
  LANGS.forEach(l=>{const t=tr(m,l); $(`name_${l}`).value=t.name||''; $(`role_${l}`).value=t.role||''; $(`experienceText_${l}`).value=t.experienceText||''; $(`bio_${l}`).value=t.bio||'';});
  imageData=''; imageName=''; removeImage=false; $('compressionInfo').textContent='';
  if(m.image){$('imagePreview').src=m.image; $('imagePreviewWrap').classList.remove('hidden');} else $('imagePreviewWrap').classList.add('hidden');
  showMessage($('formMessage'),''); renderList(); window.scrollTo({top:0,behavior:'smooth'});
}
function readBlobAsDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=reject; r.readAsDataURL(blob);});}
async function compressImageFile(file){
  if(file.size>10_000_000) throw new Error('Rasm hajmi 10 MB dan oshmasligi kerak');
  const bitmap='createImageBitmap' in window?await createImageBitmap(file):await new Promise((resolve,reject)=>{const img=new Image(); img.onload=()=>resolve(img); img.onerror=reject; img.src=URL.createObjectURL(file);});
  const size=900; const ratio=Math.max(size/bitmap.width,size/bitmap.height); const sw=Math.round(size/ratio), sh=Math.round(size/ratio); const sx=Math.max(0,Math.round((bitmap.width-sw)/2)), sy=Math.max(0,Math.round((bitmap.height-sh)/2));
  const canvas=document.createElement('canvas'); canvas.width=size; canvas.height=size; const ctx=canvas.getContext('2d',{alpha:false}); ctx.fillStyle='#f3f7fb'; ctx.fillRect(0,0,size,size); ctx.drawImage(bitmap,sx,sy,sw,sh,0,0,size,size); if(bitmap.close) bitmap.close();
  let quality=.86; let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
  while(blob&&blob.size>1_500_000&&quality>.55){quality-=.08; blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));}
  if(!blob) throw new Error('Rasmni siqib bo‘lmadi');
  return {data:await readBlobAsDataURL(blob), name:(file.name.replace(/\.[^.]+$/,'')||'team')+'.webp', size:blob.size, width:size, height:size};
}
$('imageFile').addEventListener('change',async()=>{
  const f=$('imageFile').files[0]; if(!f) return; showMessage($('formMessage'),'Rasm siqilmoqda...');
  try{const c=await compressImageFile(f); imageData=c.data; imageName=c.name; removeImage=false; $('imagePreview').src=imageData; $('imagePreviewWrap').classList.remove('hidden'); $('compressionInfo').textContent=`${(f.size/1024/1024).toFixed(2)} MB → ${(c.size/1024/1024).toFixed(2)} MB · ${c.width}×${c.height}`; showMessage($('formMessage'),'Rasm avtomatik siqildi.',true);}catch(err){showMessage($('formMessage'),err.message); $('imageFile').value='';}
});
$('removeImageBtn').addEventListener('click',()=>{imageData=''; imageName=''; removeImage=true; $('imageFile').value=''; $('imagePreviewWrap').classList.add('hidden'); $('compressionInfo').textContent='';});
$('teamForm').addEventListener('submit',async e=>{
  e.preventDefault(); const id=$('editingId').value; const translations={};
  LANGS.forEach(l=>translations[l]={name:$(`name_${l}`).value,role:$(`role_${l}`).value,experienceText:$(`experienceText_${l}`).value,bio:$(`bio_${l}`).value});
  const payload={order:$('order').value,status:$('status').value,translations,imageData,imageName,removeImage};
  showMessage($('formMessage'),'Saqlanmoqda...');
  try{await api(id?`/api/admin/team/${encodeURIComponent(id)}`:'/api/admin/team',{method:id?'PUT':'POST',body:JSON.stringify(payload)}); showMessage($('formMessage'),'Xodim maʼlumotlari saqlandi.',true); await loadTeam(); if(!id) resetForm(false); else editMember(id);}catch(err){showMessage($('formMessage'),err.message);}
});
async function deleteMember(id){const m=members.find(x=>x.id===id); const title=tr(m).name||id; if(!m||!confirm(`“${title}” xodimini o‘chirasizmi?`)) return; try{await api(`/api/admin/team/${encodeURIComponent(id)}`,{method:'DELETE'}); if($('editingId').value===id) resetForm(false); await loadTeam();}catch(err){alert(err.message);}}
checkSession();
