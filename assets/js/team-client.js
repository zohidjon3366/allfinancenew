
(function(){
  function esc(value){ return String(value || '').replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]; }); }
  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-team-grid]'));
  if (!grids.length) return;
  var lang = (document.body && document.body.getAttribute('data-lang')) || 'uz';
  var depthPrefix = location.pathname.split('/').filter(Boolean).length > 1 ? '../' : '';
  var fallbackMessage = { uz:'Jamoa maʼlumotlari vaqtincha yuklanmadi. Sahifadagi saqlangan maʼlumotlar ko‘rsatilmoqda.', ru:'Данные команды временно не загрузились. Показаны сохранённые данные страницы.', en:'Team data could not be loaded now. Saved page data is displayed.', zh:'团队数据暂时无法加载，页面显示已保存的信息。' };
  function normalizeImage(src){ src = String(src || '').trim(); if (!src) return depthPrefix + 'assets/img/favicon-64.png'; if (/^(https?:)?\/\//i.test(src) || src.indexOf('/') === 0) return src; return depthPrefix + src.replace(/^\.\//, ''); }
  function expHtml(text){ var items = String(text || '').split(/\n+/).map(function(x){ return x.trim(); }).filter(Boolean); return items.length ? '<div class="experience-list">' + items.map(function(x){ return '<span class="experience-item">' + esc(x) + '</span>'; }).join('') + '</div>' : ''; }
  function card(member, index, isHome){ var img = normalizeImage(member.image); var load = index === 0 ? 'eager' : 'lazy'; if (isHome) { return '<article class="home-member-card"><div class="home-member-photo-wrap"><img alt="' + esc(member.name) + '" class="home-member-photo" loading="' + load + '" src="' + esc(img) + '"/></div><div class="home-member-content"><h3>' + esc(member.name) + '</h3><div class="member-role">' + esc(member.role) + '</div>' + expHtml(member.experienceText) + (member.bio ? '<p class="member-bio">' + esc(member.bio) + '</p>' : '') + '</div></article>'; }
    return '<article class="member-card member-card-photo"><div class="member-photo-wrap"><img alt="' + esc(member.name) + '" class="member-photo" loading="' + load + '" src="' + esc(img) + '"/></div><div class="member-content"><h3>' + esc(member.name) + '</h3><div class="member-role">' + esc(member.role) + '</div>' + expHtml(member.experienceText) + (member.bio ? '<p class="member-bio">' + esc(member.bio) + '</p>' : '') + '</div></article>'; }
  function loadGrid(grid){
    var currentHtml = grid.innerHTML;
    var isHome = grid.hasAttribute('data-team-home') || grid.classList.contains('home-team-grid');
    var limit = Number(grid.getAttribute('data-team-limit') || 0);
    fetch('/api/team?lang=' + encodeURIComponent(lang) + '&v=23', {cache:'no-store'}).then(function(res){ if (!res.ok) throw new Error('TEAM_API_ERROR'); return res.json(); }).then(function(data){ if (!Array.isArray(data) || !data.length) throw new Error('TEAM_EMPTY'); if (limit > 0) data = data.slice(0, limit); grid.innerHTML = data.map(function(member, index){ return card(member, index, isHome); }).join(''); }).catch(function(){ if (currentHtml && currentHtml.indexOf('team-loading') === -1) return; grid.innerHTML = '<div class="team-empty">' + esc(fallbackMessage[lang] || fallbackMessage.uz) + '</div>'; });
  }
  grids.forEach(loadGrid);
})();
