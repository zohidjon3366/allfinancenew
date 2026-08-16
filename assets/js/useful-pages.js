
(function(){
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const table=qs('[data-bp-table]');
  const list=qs('[data-bp-list]');
  const search=qs('[data-bp-search]');
  let currentFilter='all';
  function norm(v){return (v||'').toString().toLowerCase().replace(/ё/g,'е');}
  function apply(){
    const term=norm(search&&search.value);
    if(table){
      qsa('tbody tr',table).forEach(row=>{
        const s=norm(row.getAttribute('data-search')||row.textContent);
        const t=norm(row.getAttribute('data-type')||'');
        const filterOk=currentFilter==='all'||t.includes(currentFilter)||s.includes(currentFilter);
        row.style.display=(filterOk && (!term || s.includes(term)))?'':'none';
      });
    }
    if(list){
      qsa('[data-search]',list).forEach(item=>{
        const s=norm(item.getAttribute('data-search')||item.textContent);
        item.style.display=(!term || s.includes(term))?'':'none';
      });
    }
  }
  if(search){ search.addEventListener('input',apply); }
  qsa('[data-bp-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('[data-bp-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); currentFilter=norm(btn.dataset.bpFilter||'all'); apply();
  }));
  qsa('[data-bp-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('[data-bp-tab]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    qsa('.bp-tab-panel').forEach(p=>p.classList.toggle('active',p.id===btn.dataset.bpTab));
  }));
  apply();
})();
