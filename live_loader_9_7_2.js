(function () {
  'use strict';

  const VERSION = '9.7.2';
  const SCRIPT_ID = 'mk-live-connectors-972';
  const SOURCE = `live_connectors_9_7_2.js?v=${VERSION}`;

  function showLoadError(message) {
    const box = document.getElementById('live970FxStatus');
    if (box) {
      box.innerHTML =
        '<div class="live970Alert warn"><strong>9.7.2 kunde inte laddas</strong>' +
        '<p>' + String(message) + '</p></div>';
    }
    console.error('[Mästarklass OS 9.7.2]', message);
  }

  function ready() {
    return Boolean(window.MKLiveConnectors970?.refreshFx);
  }

  function announce() {
    if (typeof window.renderLiveFoundation970 === 'function') {
      try {
        window.renderLiveFoundation970();
      } catch (error) {
        console.warn('[Mästarklass OS 9.7.2] Render väntar:', error);
      }
    }
  }

  function load() {
    if (ready()) {
      announce();
      return;
    }

    const old = document.getElementById(SCRIPT_ID);
    if (old) old.remove();

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SOURCE;
    script.async = false;
    script.onload = () => {
      if (!ready()) {
        showLoadError('Filen laddades men MKLiveConnectors970 skapades inte.');
        return;
      }
      announce();
    };
    script.onerror = () => {
      showLoadError(
        'Kontrollera att live_connectors_9_7_2.js ligger i repositoryts rot.'
      );
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, { once: true });
  } else {
    load();
  }
})();
