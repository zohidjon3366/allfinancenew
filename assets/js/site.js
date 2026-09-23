
(function(){
  function qsa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  qsa('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  var menuBtn = document.getElementById('menuBtn');
  var mainNav = document.getElementById('mainNav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', function(){
      if (mainNav.classList) { mainNav.classList.toggle('open'); }
    });
  }

  var dropdowns = qsa('.nav-dropdown');
  function closeDropdowns(except){
    dropdowns.forEach(function(drop){
      if (drop !== except) {
        drop.classList.remove('open');
        var trigger = drop.querySelector('.services-main-link');
        if (trigger) { trigger.setAttribute('aria-expanded', 'false'); }
      }
    });
  }

  dropdowns.forEach(function(drop){
    var trigger = drop.querySelector('.services-main-link');
    var panel = drop.querySelector('.dropdown-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      var willOpen = !drop.classList.contains('open');
      closeDropdowns(drop);
      if (willOpen) { drop.classList.add('open'); } else { drop.classList.remove('open'); }
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    panel.addEventListener('click', function(event){ event.stopPropagation(); });
  });
  document.addEventListener('click', function(){ closeDropdowns(null); });
  document.addEventListener('keydown', function(event){ if (event.key === 'Escape') closeDropdowns(null); });

  var currentLang = (document.body && document.body.getAttribute('data-lang')) || document.documentElement.lang || 'uz';
  var uiMessages = {
    uz:{sent:'So‘rovingiz yuborildi. Tez orada siz bilan bog‘lanamiz.',error:'Yuborishda muammo yuz berdi. Iltimos, telefon orqali bog‘laning.',currency:'so‘m / oy'},
    ru:{sent:'Заявка отправлена. Мы скоро свяжемся с вами.',error:'Не удалось отправить заявку. Пожалуйста, свяжитесь с нами по телефону.',currency:'сум / месяц'},
    en:{sent:'Your request has been sent. We will contact you shortly.',error:'The request could not be sent. Please contact us by phone.',currency:'UZS / month'},
    zh:{sent:'您的申请已提交，我们将尽快与您联系。',error:'申请提交失败，请通过电话联系我们。',currency:'乌兹别克斯坦苏姆/月'}
  };

  var consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', function(event){
      event.preventDefault();
      var message = document.getElementById('formMessage');
      var data = {};
      Array.prototype.slice.call(new FormData(consultForm).entries()).forEach(function(pair){ data[pair[0]] = pair[1]; });
      fetch('/api/consult', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      }).then(function(response){
        return response.json().then(function(result){ return { ok: response.ok, result: result }; });
      }).then(function(payload){
        if (!payload.ok) { throw new Error(payload.result && payload.result.message || 'Yuborilmadi'); }
        if (message) { message.textContent = (uiMessages[currentLang] || uiMessages.uz).sent; }
        consultForm.reset();
      }).catch(function(){
        if (message) { message.textContent = (uiMessages[currentLang] || uiMessages.uz).error; }
      });
    });
  }

  (function(){
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors = [
      '.hero-copy', '.hero-visual', '.page-hero .shell', '.section-head', '.metric', '.service-card', '.process-step',
      '.solution-points', '.image-frame', '.price-card', '.home-member-card', '.team-card', '.news-card', '.map-card',
      '.contact-form', '.service-text-panel', '.service-visual-small', '.service-process-grid article', '.deliver-card',
      '.legal-card', '.service-cta'
    ];
    var elements = qsa(selectors.join(','));
    if (!elements.length) return;
    elements.forEach(function(element){
      element.classList.add('reveal');
      var localIndex = 0;
      if (element.parentElement && element.parentElement.children) {
        localIndex = Array.prototype.indexOf.call(element.parentElement.children, element);
        if (localIndex < 0) localIndex = 0;
      }
      element.style.setProperty('--reveal-delay', Math.min(localIndex * 75, 300) + 'ms');
    });
    qsa('.hero-copy').forEach(function(el){ el.classList.add('reveal-left'); });
    qsa('.hero-visual,.service-visual-small').forEach(function(el){ el.classList.add('reveal-right'); });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function(element){ element.classList.add('reveal-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    requestAnimationFrame(function(){ elements.forEach(function(element){ observer.observe(element); }); });
  })();

  var calcBtn = document.getElementById('calcBtn');
  function byId(id){ return document.getElementById(id); }
  if (calcBtn) {
    calcBtn.addEventListener('click', function(){
      var typeEl = byId('taxType'), employeesEl = byId('employees'), invoicesEl = byId('invoices'), bankOpsEl = byId('bankOps'), ieEl = byId('importExport');
      var type = typeEl ? typeEl.value : 'turnover';
      var employees = Number(employeesEl ? employeesEl.value : 0);
      var invoices = Number(invoicesEl ? invoicesEl.value : 0);
      var bankOps = Number(bankOpsEl ? bankOpsEl.value : 0);
      var ie = ieEl ? ieEl.checked : false;
      var price = (type === 'vat' || type === 'profit') ? 3500000 : 1500000;
      price += Math.max(0, employees - 5) * 90000 + Math.max(0, invoices - 30) * 18000 + Math.max(0, bankOps - 50) * 9000;
      if (ie) price += 1200000;
      price = Math.ceil(price / 100000) * 100000;
      var locale = currentLang === 'ru' ? 'ru-RU' : currentLang === 'en' ? 'en-US' : currentLang === 'zh' ? 'zh-CN' : 'uz-UZ';
      var label;
      if (currentLang === 'en') label = 'UZS ' + price.toLocaleString(locale) + ' / month';
      else if (currentLang === 'zh') label = price.toLocaleString(locale) + ' 乌兹别克斯坦苏姆/月';
      else label = price.toLocaleString(locale) + ' ' + (uiMessages[currentLang] || uiMessages.uz).currency;
      var el = byId('calcPrice');
      if (el) el.textContent = label;
    });
  }

  qsa('[data-lang-link]').forEach(function(link){
    var original = link.getAttribute('href');
    if (!original) return;
    if (/maqola\.html$/.test(location.pathname) && location.search) {
      link.setAttribute('href', original + location.search);
    }
  });
})();
