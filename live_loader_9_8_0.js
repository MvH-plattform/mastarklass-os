(function (global) {
  'use strict';

  const VERSION = '9.8.0';
  const HOME_ID = 'home';
  const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });
  const pct = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 });

  function n(value) {
    const parsed = Number(String(value ?? '').replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function text(value, fallback = '—') {
    const v = String(value ?? '').trim();
    return v || fallback;
  }

  function money(value) {
    return `${fmt.format(Math.round(n(value)))} kr`;
  }

  function getData() {
    return global.DATA && typeof global.DATA === 'object'
      ? global.DATA
      : { holdings: [], accounts: [] };
  }

  function getHoldings() {
    const holdings = Array.isArray(getData().holdings) ? getData().holdings : [];
    return holdings.filter(Boolean);
  }

  function getAccounts() {
    return Array.isArray(getData().accounts) ? getData().accounts : [];
  }

  function localJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function holdingValue(h) {
    const direct = n(h.marketValueSEK || h.marketValueSek || h.marketValue || h.valueSEK || h.valueSek || h.value);
    if (direct > 0) return direct;
    const quantity = n(h.quantity || h.qty || h.shares || h.units);
    const price = n(h.latestPrice || h.price || h.currentPrice || h.lastPrice);
    const fx = n(h.fxToSEK || h.fxRate || h.exchangeRate || 1) || 1;
    return quantity * price * fx;
  }

  function hasUsefulData(h) {
    return Boolean(
      text(h.name, '') &&
      (holdingValue(h) > 0 || (n(h.quantity || h.qty) > 0 && n(h.averageCost || h.gav || h.costBasis) > 0))
    );
  }

  function liveState() {
    const mappings = localJson('mkos.live.mappings.v1', []);
    const fx = localJson('mkos.live.fx.v1', {});
    let quotes = [];
    try {
      if (global.MKLivePortfolioPilot && typeof global.MKLivePortfolioPilot.list === 'function') {
        quotes = global.MKLivePortfolioPilot.list() || [];
      }
    } catch (_) {}
    if (!quotes.length) quotes = localJson('mkos.live.quotes.v1', []);
    const fxRates = fx && typeof fx === 'object' ? (fx.rates || fx) : {};
    const fxCount = Object.keys(fxRates || {}).filter(k => n(fxRates[k]?.toSEK ?? fxRates[k]) > 0).length;
    return {
      mappings: Array.isArray(mappings) ? mappings : [],
      quotes: Array.isArray(quotes) ? quotes : [],
      fxCount,
      fxDate: fx.date || fx.updatedAt || ''
    };
  }

  function calculate() {
    const holdings = getHoldings();
    const accounts = getAccounts();
    const values = holdings.map(h => ({ h, value: holdingValue(h) }));
    const total = values.reduce((sum, x) => sum + x.value, 0);
    const known = values.filter(x => x.value > 0);
    const covered = holdings.filter(hasUsefulData).length;
    const coverage = holdings.length ? (covered / holdings.length) * 100 : 0;
    const largest = [...known].sort((a, b) => b.value - a.value)[0];
    const largestWeight = total > 0 && largest ? (largest.value / total) * 100 : 0;
    const live = liveState();
    const mappedIds = new Set(live.mappings.map(m => String(m.holdingId || m.id || '')));
    const mapped = holdings.filter(h => mappedIds.has(String(h.id))).length;
    const liveQuotes = live.quotes.filter(q => n(q.fxToSek || q.fxToSEK || q.priceSEK || q.price) > 0).length;
    const health = Math.max(0, Math.min(100, Math.round(
      coverage * 0.55 +
      Math.min(100, accounts.length * 14) * 0.10 +
      (largestWeight > 0 ? Math.max(0, 100 - Math.max(0, largestWeight - 12) * 3) : 55) * 0.20 +
      Math.min(100, (mapped / Math.max(1, holdings.length)) * 100) * 0.15
    )));

    const top = [...known].sort((a, b) => b.value - a.value).slice(0, 5);
    const missing = holdings.filter(h => !hasUsefulData(h)).slice(0, 5);
    return { holdings, accounts, total, coverage, covered, largest, largestWeight, live, mapped, liveQuotes, health, top, missing };
  }

  function injectStyle() {
    if (document.getElementById('mk980Style')) return;
    const style = document.createElement('style');
    style.id = 'mk980Style';
    style.textContent = `
      #home.mk980Host{display:block!important}
      #home.mk980Host>:not(.mk980Shell){display:none!important}
      .mk980Shell{padding:18px 16px 116px}
      .mk980Hero{padding:25px;border-radius:34px;background:radial-gradient(circle at 5% 0%,rgba(59,130,246,.36),transparent 38%),radial-gradient(circle at 100% 12%,rgba(16,185,129,.28),transparent 40%),linear-gradient(145deg,#061427,#0c2447 58%,#073a35);border:1px solid rgba(255,255,255,.15);box-shadow:0 24px 64px rgba(0,0,0,.30)}
      .mk980Eyebrow{font-size:12px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd}
      .mk980Hero h2{font-size:34px;line-height:1.04;margin:10px 0 8px;letter-spacing:-1.2px}.mk980Hero p{font-size:13px;line-height:1.55;color:#cbd5e1;margin:0}
      .mk980Value{font-size:43px;font-weight:950;letter-spacing:-1.7px;margin:19px 0 3px}.mk980LiveLine{display:flex;align-items:center;gap:8px;color:#cbd5e1;font-size:11px;margin-top:8px}.mk980Dot{width:9px;height:9px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.12)}.mk980Dot.warn{background:#f59e0b;box-shadow:0 0 0 5px rgba(245,158,11,.12)}
      .mk980Grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:16px}.mk980Kpi{padding:14px;border-radius:21px;background:rgba(11,18,32,.74);border:1px solid rgba(148,163,184,.14)}.mk980Kpi span{display:block;color:#94a3b8;font-size:10px}.mk980Kpi b{display:block;font-size:22px;margin-top:6px}.mk980Kpi small{display:block;color:#94a3b8;font-size:9px;margin-top:4px;line-height:1.35}
      .mk980Section{margin-top:22px}.mk980Head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:10px}.mk980Head h3{margin:0;font-size:20px}.mk980Head span{font-size:10px;color:#94a3b8}
      .mk980Card{padding:16px;border-radius:24px;background:#0b1220;border:1px solid rgba(148,163,184,.15);margin-top:10px}.mk980Row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(148,163,184,.09)}.mk980Row:last-child{border-bottom:0}.mk980Name{font-size:12px;font-weight:950}.mk980Meta{font-size:10px;color:#94a3b8;line-height:1.45;margin-top:4px}.mk980Right{text-align:right;font-weight:950;font-size:12px}
      .mk980Bar{height:8px;background:#172033;border-radius:999px;overflow:hidden;margin-top:8px}.mk980Bar span{display:block;height:100%;background:linear-gradient(90deg,#3b82f6,#10b981);border-radius:999px}
      .mk980Actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mk980Btn{padding:15px 12px;border-radius:19px;border:1px solid rgba(148,163,184,.16);background:#111827;color:white;text-align:left}.mk980Btn b{display:block;font-size:13px}.mk980Btn small{display:block;color:#94a3b8;font-size:9px;line-height:1.35;margin-top:4px}.mk980Btn.primary{background:linear-gradient(135deg,#2563eb,#059669);border-color:transparent}
      .mk980Alert{padding:15px;border-radius:21px;background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(15,23,42,.94));border:1px solid rgba(245,158,11,.22);margin-top:10px}.mk980Good{padding:15px;border-radius:21px;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(15,23,42,.94));border:1px solid rgba(34,197,94,.22);margin-top:10px}
      @media(max-width:390px){.mk980Hero h2{font-size:30px}.mk980Value{font-size:38px}.mk980Kpi b{font-size:19px}}
    `;
    document.head.appendChild(style);
  }

  function action(label, description, handler, primary) {
    return `<button class="mk980Btn${primary ? ' primary' : ''}" data-mk980-action="${handler}"><b>${label}</b><small>${description}</small></button>`;
  }

  function render() {
    const home = document.getElementById(HOME_ID);
    if (!home) return;
    injectStyle();
    home.classList.add('mk980Host');
    const m = calculate();
    const liveReady = m.live.fxCount > 0;
    const topRows = m.top.length ? m.top.map((x, i) => `
      <div class="mk980Row"><div><div class="mk980Name">${i + 1}. ${text(x.h.name, 'Namnlöst innehav')}</div><div class="mk980Meta">${text(x.h.platform || x.h.account || x.h.sector, 'Lokalt innehav')} · ${pct.format(m.total ? x.value / m.total * 100 : 0)} %</div><div class="mk980Bar"><span style="width:${Math.min(100, m.total ? x.value / m.total * 100 * 4 : 0)}%"></span></div></div><div class="mk980Right">${money(x.value)}</div></div>`).join('') : '<div class="mk980Meta">Inga innehav med känt marknadsvärde ännu.</div>';

    const focus = [];
    if (!liveReady) focus.push('Uppdatera ECB-valutor så att utländska innehav kan räknas om till SEK.');
    if (m.mapped < Math.min(5, m.holdings.length)) focus.push(`Mappa pilotinnehav till marknadsdata. ${m.mapped} av ${m.holdings.length} är mappade.`);
    if (m.coverage < 95) focus.push(`Komplettera antal, GAV eller värde för ${Math.max(0, m.holdings.length - m.covered)} innehav.`);
    if (m.largestWeight > 15 && m.largest) focus.push(`${text(m.largest.h.name)} väger ${pct.format(m.largestWeight)} %. Kontrollera att koncentrationen är avsiktlig.`);
    if (!focus.length) focus.push('Datagrunden är stark. Nästa steg är att kvalitetssäkra livekurser och jämföra analysresultaten.');

    home.innerHTML = `<div class="mk980Shell">
      <div class="mk980Hero">
        <div class="mk980Eyebrow">MÄSTARKLASS OS 9.8.0 · PORTFOLIO COMMAND CENTER</div>
        <h2>Hela portföljen. Ett tydligt nästa steg.</h2>
        <p>Startsidan sammanför lokal portföljdata, livepilot, datakvalitet och prioriteringar utan att ändra Private Vault.</p>
        <div class="mk980Value">${money(m.total)}</div>
        <div class="mk980LiveLine"><span class="mk980Dot ${liveReady ? '' : 'warn'}"></span>${liveReady ? `ECB aktiv · ${m.live.fxCount} valutakurser` : 'Livevaluta väntar på uppdatering'}</div>
        <div class="mk980Grid">
          <div class="mk980Kpi"><span>Portfolio Health</span><b>${m.health}/100</b><small>lokal helhetsbedömning</small></div>
          <div class="mk980Kpi"><span>Datatäckning</span><b>${pct.format(m.coverage)} %</b><small>${m.covered}/${m.holdings.length} användbara poster</small></div>
          <div class="mk980Kpi"><span>Livepilot</span><b>${m.mapped}/${m.holdings.length}</b><small>mappade innehav</small></div>
          <div class="mk980Kpi"><span>Största vikt</span><b>${pct.format(m.largestWeight)} %</b><small>${m.largest ? text(m.largest.h.name) : 'saknar värde'}</small></div>
        </div>
      </div>

      <div class="mk980Section"><div class="mk980Head"><h3>Dagens fokus</h3><span>prioriterat av 9.8</span></div>
        ${focus.slice(0,4).map((x,i)=>`<div class="${i===0?'mk980Alert':'mk980Card'}"><div class="mk980Name">${i+1}. ${x}</div></div>`).join('')}
      </div>

      <div class="mk980Section"><div class="mk980Head"><h3>Snabbkommandon</h3><span>testa plattformen</span></div><div class="mk980Actions">
        ${action('📡 Live Portfolio', 'Valutor, mappning och kurser', 'live', true)}
        ${action('📊 Portfölj', 'Innehav, konton och vikter', 'portfolio', false)}
        ${action('🧠 Analys', 'Investment Intelligence', 'analysis', false)}
        ${action('🎯 Mål', 'Kapital- och utdelningsmål', 'goals', false)}
      </div></div>

      <div class="mk980Section"><div class="mk980Head"><h3>Största innehav</h3><span>kända lokala värden</span></div><div class="mk980Card">${topRows}</div></div>

      <div class="mk980Section"><div class="mk980Head"><h3>Systemstatus</h3><span>read-only live-lager</span></div>
        <div class="${liveReady ? 'mk980Good' : 'mk980Alert'}"><div class="mk980Name">${liveReady ? 'Livegrunden är aktiv' : 'Livegrunden behöver ett steg till'}</div><div class="mk980Meta">${liveReady ? `${m.live.fxCount} valutakurser finns lokalt. ${m.liveQuotes} användbara instrumentkurser är registrerade.` : 'Öppna Live Portfolio och tryck Uppdatera valutakurser. Därefter kan pilotinnehav mappas och testas.'}</div></div>
      </div>
    </div>`;

    bindActions(home);
    updateChrome();
  }

  function bindActions(root) {
    root.querySelectorAll('[data-mk980-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.mk980Action;
        if (type === 'live') {
          if (typeof global.openLiveFoundation970 === 'function') global.openLiveFoundation970();
          else if (typeof global.showScreen === 'function') global.showScreen('liveFoundation970');
        } else if (type === 'portfolio') {
          if (typeof global.showScreen === 'function') global.showScreen('portfolio');
        } else if (type === 'analysis') {
          if (typeof global.openInvestmentIntelligence950 === 'function') global.openInvestmentIntelligence950();
          else if (typeof global.showScreen === 'function') global.showScreen('analysisScreen');
        } else if (type === 'goals') {
          if (typeof global.showScreen === 'function') global.showScreen('goals');
        }
      });
    });
  }

  function updateChrome() {
    document.body.dataset.build = VERSION;
    const badge = document.getElementById('mkVersionBuildBadge');
    if (badge) badge.textContent = VERSION;
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) headerTitle.textContent = `Mästarklass OS ${VERSION}`;
    const subtitle = document.getElementById('subtitle');
    if (subtitle) subtitle.textContent = `${getHoldings().length} innehav · Portfolio Command Center · ${new Date().toISOString().slice(0,10)}`;
    document.title = `Mästarklass OS ${VERSION} – Portfolio Command Center`;
  }

  function boot() {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (document.getElementById(HOME_ID) && (global.DATA || attempts > 30)) {
        clearInterval(timer);
        render();
        setTimeout(render, 1200);
      }
    }, 200);
  }

  global.MKOS980 = { version: VERSION, render, calculate };
  global.addEventListener('storage', () => setTimeout(render, 50));
  global.addEventListener('mkos:data-updated', () => setTimeout(render, 50));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(render, 100); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})(window);
