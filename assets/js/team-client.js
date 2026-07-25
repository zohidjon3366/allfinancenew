(function(){
  const grids = Array.from(document.querySelectorAll('[data-team-grid]'));
  if (!grids.length) return;
  const lang = document.body?.dataset?.lang || 'uz';
  const depthPrefix = location.pathname.split('/').filter(Boolean).length > 1 ? '../' : '';
  const fallbackMessage = {
    uz: 'Jamoa maʼlumotlari vaqtincha yuklanmadi. Sahifadagi saqlangan maʼlumotlar ko‘rsatilmoqda.',
    ru: 'Данные команды временно не загрузились. Показаны сохранённые данные страницы.',
    en: 'Team data could not be loaded now. Saved page data is displayed.',
    zh: '团队数据暂时无法加载，页面显示已保存的信息。'
  };
  const esc = value => String(value || '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  function normalizeImage(src){
    src = String(src || '').trim();
    if (!src) return depthPrefix + 'assets/img/favicon-64.png';
    if (/^(https?:)?\/\//i.test(src) || src.startsWith('/')) return src;
    return depthPrefix + src.replace(/^\.\//,'');
  }
  function expHtml(text){
    const items = String(text || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
    return items.length ? `<div class="experience-list">${items.map(x => `<span class="experience-item">${esc(x)}</span>`).join('')}</div>` : '';
  }
  function card(member, index, isHome){
    const img = normalizeImage(member.image);
    const load = index === 0 ? 'eager' : 'lazy';
    if (isHome) {
      return `<article class="home-member-card">
        <div class="home-member-photo-wrap"><img alt="${esc(member.name)}" class="home-member-photo" loading="${load}" src="${esc(img)}"/></div>
        <div class="home-member-content">
          <h3>${esc(member.name)}</h3>
          <div class="member-role">${esc(member.role)}</div>
          ${expHtml(member.experienceText)}
          ${member.bio ? `<p class="member-bio">${esc(member.bio)}</p>` : ''}
        </div>
      </article>`;
    }
    return `<article class="member-card member-card-photo">
      <div class="member-photo-wrap"><img alt="${esc(member.name)}" class="member-photo" loading="${load}" src="${esc(img)}"/></div>
      <div class="member-content">
        <h3>${esc(member.name)}</h3>
        <div class="member-role">${esc(member.role)}</div>
        ${expHtml(member.experienceText)}
        ${member.bio ? `<p class="member-bio">${esc(member.bio)}</p>` : ''}
      </div>
    </article>`;
  }
  async function loadGrid(grid){
    const currentHtml = grid.innerHTML;
    const isHome = grid.hasAttribute('data-team-home') || grid.classList.contains('home-team-grid');
    const limit = Number(grid.dataset.teamLimit || 0);
    try {
      const res = await fetch(`/api/team?lang=${encodeURIComponent(lang)}&v=23`, {cache:'no-store'});
      if (!res.ok) throw new Error('TEAM_API_ERROR');
      let data = await res.json();
      if (!Array.isArray(data) || !data.length) throw new Error('TEAM_EMPTY');
      if (limit > 0) data = data.slice(0, limit);
      grid.innerHTML = data.map((member, index) => card(member, index, isHome)).join('');
    } catch (error) {
      if (currentHtml && !currentHtml.includes('team-loading')) return;
      grid.innerHTML = `<div class="team-empty">${esc(fallbackMessage[lang] || fallbackMessage.uz)}</div>`;
    }
  }
  grids.forEach(loadGrid);
})();
