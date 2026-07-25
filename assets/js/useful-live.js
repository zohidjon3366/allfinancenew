(function(){
  const frames = Array.from(document.querySelectorAll('[data-useful-live-frame]'));
  if (!frames.length) return;
  const minHeight = 820;
  const maxHeight = 9000;
  function setHeight(frame, height){
    const value = Math.min(Math.max(Number(height) || minHeight, minHeight), maxHeight);
    frame.style.height = value + 'px';
  }
  window.addEventListener('message', event => {
    const data = event.data || {};
    if (data.type !== 'af-buxpro-height') return;
    const frame = frames.find(x => x.dataset.source === data.source) || frames[0];
    if (frame) setHeight(frame, data.height + 35);
  });
  frames.forEach(frame => {
    setHeight(frame, minHeight);
    frame.addEventListener('load', () => {
      frame.classList.add('loaded');
      setTimeout(() => {
        try {
          const doc = frame.contentDocument;
          if (!doc) return;
          const h = Math.max(doc.documentElement.scrollHeight, doc.body ? doc.body.scrollHeight : 0);
          setHeight(frame, h + 35);
        } catch {}
      }, 700);
    });
  });
})();
