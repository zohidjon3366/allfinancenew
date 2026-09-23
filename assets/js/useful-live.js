(function () {
    var frames = Array.from(document.querySelectorAll('[data-useful-live-frame]'));
    if (!frames.length)
        return;
    var minHeight = 820;
    var maxHeight = 9000;
    function setHeight(frame, height) {
        var value = Math.min(Math.max(Number(height) || minHeight, minHeight), maxHeight);
        frame.style.height = value + 'px';
    }
    window.addEventListener('message', function (event) {
        var data = event.data || {};
        if (data.type !== 'af-buxpro-height')
            return;
        var frame = frames.find(function (x) { return x.dataset.source === data.source; }) || frames[0];
        if (frame)
            setHeight(frame, data.height + 35);
    });
    frames.forEach(function (frame) {
        setHeight(frame, minHeight);
        frame.addEventListener('load', function () {
            frame.classList.add('loaded');
            setTimeout(function () {
                try {
                    var doc = frame.contentDocument;
                    if (!doc)
                        return;
                    var h = Math.max(doc.documentElement.scrollHeight, doc.body ? doc.body.scrollHeight : 0);
                    setHeight(frame, h + 35);
                }
                catch (_a) { }
            }, 700);
        });
    });
})();
