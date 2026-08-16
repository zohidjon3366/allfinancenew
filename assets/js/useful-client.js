(() => {
  const cards = [...document.querySelectorAll('.useful-card[href^="#useful-"]')];
  const panels = [...document.querySelectorAll('.useful-static-panel')];
  function setActive() {
    const hash = location.hash || (panels[0] ? `#${panels[0].id}` : '');
    cards.forEach(card => card.classList.toggle('active', card.getAttribute('href') === hash));
  }
  cards.forEach(card => {
    card.addEventListener('click', () => {
      setTimeout(setActive, 30);
    });
  });
  window.addEventListener('hashchange', setActive);
  setActive();
})();
