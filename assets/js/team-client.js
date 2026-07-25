(function(){
  const grid = document.querySelector('[data-team-grid]');
  if (!grid) return;
  const lang = document.body?.dataset?.lang || 'uz';
  const fallbackMessage = {
    uz: 'Jamoa maʼlumotlari vaqtincha yuklanmadi. Sahifadagi saqlangan maʼlumotlar ko‘rsatilmoqda.',
    ru: 'Данные команды временно не загрузились. Показаны сохранённые данные страницы.',
    en: 'Team data could not be loaded now. Saved page data is displayed.',
    zh: '团队数据暂时无法加载，页面显示已保存的信息。'
  };
  const esc = value => String(value || '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  function expHtml(text){
    const items = String(text || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
    return items.length ? `<div class="experience-list">${items.map(x => `<span class="experience-item">${esc(x)}</span>`).join('')}</div>` : '';
  }
  function card(member, index){
    const img = member.image || 'assets/img/favicon-64.png';
    const load = index === 0 ? 'eager' : 'lazy';
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
  async function load(){
    const currentHtml = grid.innerHTML;
    try {
      const res = await fetch(`/api/team?lang=${encodeURIComponent(lang)}`, {cache:'no-store'});
      if (!res.ok) throw new Error('TEAM_API_ERROR');
      const data = await res.json();
      if (!Array.isArray(data) || !data.length) throw new Error('TEAM_EMPTY');
      grid.innerHTML = data.map(card).join('');
    } catch (error) {
      if (currentHtml && !currentHtml.includes('team-loading')) return;
      grid.innerHTML = `<div class="team-empty">${esc(fallbackMessage[lang] || fallbackMessage.uz)}</div>`;
    }
  }
  load();
})();
