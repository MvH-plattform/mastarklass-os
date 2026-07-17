(function (global) {
  'use strict';

  const VERSION = '9.8.1';
  const GOAL_KEY = 'mkos.goals.981.v1';
  const DEFAULTS = {
    capitalGoal: 7500000,
    dividendGoal: 500000,
    monthlySaving: 9000,
    expectedReturn: 7,
    currentDividend: 0
  };

  const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });
  const pct = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 });

  const num = (v) => {
    const x = Number(String(v ?? '').replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(x) ? x : 0;
  };
  const money = (v) => `${fmt.format(Math.round(num(v)))} kr`;

  function getData() {
    return global.DATA && typeof global.DATA === 'object'
      ? global.DATA
      : { holdings: [], accounts: [] };
  }

  function holdings() {
    return Array.isArray(getData().holdings) ? getData().holdings.filter(Boolean) : [];
  }

  function holdingValue(h) {
    const direct = num(h.marketValueSEK || h.marketValueSek || h.marketValue || h.valueSEK || h.valueSek || h.value);
    if (direct > 0) return direct;
    const q = num(h.quantity || h.qty || h.shares || h.units);
    const p = num(h.latestPrice || h.price || h.currentPrice || h.lastPrice);
    const fx = num(h.fxToSEK || h.fxRate || h.exchangeRate || 1) || 1;
    return q * p * fx;
  }

  function totalValue() {
    return holdings().reduce((sum, h) => sum + holdingValue(h), 0);
  }

  function localJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function goals() {
    return { ...DEFAULTS, ...localJson(GOAL_KEY, {}) };
  }

  function yearsToGoal(start, monthly, annualPct, target) {
    start = Math.max(0, num(start));
    monthly = Math.max(0, num(monthly));
    target = Math.max(0, num(target));
    const r = Math.max(0, num(annualPct)) / 100 / 12;
    if (start >= target) return 0;
    if (monthly <= 0 && r <= 0) return null;
    let value = start;
    for (let m = 1; m <= 1200; m++) {
      value = value * (1 + r) + monthly;
      if (value >= target) return m / 12;
    }
    return null;
  }

  function installLegacyLiveShim() {
    if (global.MKLiveConnectors970) return;
    const candidate =
      global.MKLiveConnectors972 ||
      global.MKLiveConnectors980 ||
      global.MKLiveConnectors981;

    if (candidate) {
      global.MKLiveConnectors970 = candidate;
      return;
    }

    global.MKLiveConnectors970 = {
      getAlphaKey() {
        return localStorage.getItem('mkos.live.alpha.key.v1') || '';
      },
      setAlphaKey(key) {
        localStorage.setItem('mkos.live.alpha.key.v1', String(key || '').trim());
      },
      fxToSek(currency) {
        const fx = localJson('mkos.live.fx.v1', {});
        const rates = fx.rates || fx;
        const row = rates[String(currency || 'SEK').toUpperCase()];
        return num(row?.toSEK ?? row) || (String(currency).toUpperCase() === 'SEK' ? 1 : 0);
      },
      async refreshFx() {
        if (global.MKLiveConnectors972?.refreshFx) return global.MKLiveConnectors972.refreshFx();
        if (global.MKLiveConnectors980?.refreshFx) return global.MKLiveConnectors980.refreshFx();
        throw new Error('Live-connectorn är inte laddad. Kontrollera att live_loader_9_8_0.js ligger sist före </body>.');
      },
      async fetchAlphaQuote(symbol) {
        if (global.MKLiveConnectors972?.fetchAlphaQuote) return global.MKLiveConnectors972.fetchAlphaQuote(symbol);
        if (global.MKLiveConnectors980?.fetchAlphaQuote) return global.MKLiveConnectors980.fetchAlphaQuote(symbol);
        throw new Error('Alpha Vantage-connectorn är inte laddad.');
      }
    };
  }

  function style() {
    if (document.getElementById('mk981Style')) return;
    const link = document.createElement('link');
    link.id = 'mk981Style';
    link.rel = 'stylesheet';
    link.href = './ux_live_stabilizer_9_8_1.css?v=9.8.1';
    document.head.appendChild(link);
  }

  function findScreen(names) {
    for (const name of names) {
      const byId = document.getElementById(name);
      if (byId) return byId;
      const byData = document.querySelector(`[data-screen="${name}"]`);
      if (byData) return byData;
    }
    return null;
  }

  function goalScreen() {
    return findScreen(['goals', 'goal', 'goalScreen', 'goalsScreen']);
  }

  function portfolioScreen() {
    return findScreen(['portfolio', 'portfolioScreen']);
  }

  function marketScreen() {
    return findScreen(['market', 'marketScreen']);
  }

  function setChromeVersion() {
    document.body.dataset.build = VERSION;
    const badge = document.getElementById('mkVersionBuildBadge');
    if (badge) badge.textContent = VERSION;
    const title = document.querySelector('header h1');
    if (title) title.textContent = `Mästarklass OS ${VERSION}`;
    document.title = `Mästarklass OS ${VERSION}`;
  }

  function renderGoals() {
    const screen = goalScreen();
    if (!screen) return;

    const g = goals();
    const current = totalValue();
    const capProgress = g.capitalGoal > 0 ? Math.min(100, current / g.capitalGoal * 100) : 0;
    const divProgress = g.dividendGoal > 0 ? Math.min(100, g.currentDividend / g.dividendGoal * 100) : 0;
    const years = yearsToGoal(current, g.monthlySaving, g.expectedReturn, g.capitalGoal);
    const targetYear = years == null ? '—' : new Date().getFullYear() + Math.ceil(years);

    screen.classList.add('mk981-goals-host');
    screen.innerHTML = `
      <div class="mk981-shell">
        <section class="mk981-hero mk981-goal-hero">
          <div class="mk981-eyebrow">MÄSTARKLASS OS 9.8.1 · MÅLCENTRAL</div>
          <h2>Från dagens portfölj till ekonomisk frihet</h2>
          <p>Kapitalmål, utdelningsmål och sparplan räknas lokalt. Du kan ändra alla antaganden utan att påverka Private Vault.</p>
          <div class="mk981-kpi-grid">
            <div class="mk981-kpi"><span>Portfölj idag</span><b>${money(current)}</b></div>
            <div class="mk981-kpi"><span>Kapitalmål</span><b>${money(g.capitalGoal)}</b></div>
            <div class="mk981-kpi"><span>Beräknat målår</span><b>${targetYear}</b></div>
            <div class="mk981-kpi"><span>Månadssparande</span><b>${money(g.monthlySaving)}</b></div>
          </div>
        </section>

        <nav class="mk981-jumpbar" aria-label="Målnavigation">
          <button data-jump="mk981Capital">Kapital</button>
          <button data-jump="mk981Dividend">Utdelning</button>
          <button data-jump="mk981Plan">Sparplan</button>
          <button data-jump="mk981Edit">Redigera</button>
        </nav>

        <section id="mk981Capital" class="mk981-card">
          <div class="mk981-head"><h3>Kapitalmål</h3><span>${pct.format(capProgress)} %</span></div>
          <div class="mk981-progress"><span style="width:${capProgress}%"></span></div>
          <div class="mk981-milestones">
            ${[500000,1000000,7500000].map(x => `
              <div class="${current >= x ? 'done' : ''}">
                <b>${money(x)}</b><small>${current >= x ? 'Uppnått' : money(Math.max(0, x-current)) + ' kvar'}</small>
              </div>`).join('')}
          </div>
        </section>

        <section id="mk981Dividend" class="mk981-card">
          <div class="mk981-head"><h3>Utdelningsmål</h3><span>${pct.format(divProgress)} %</span></div>
          <div class="mk981-progress"><span style="width:${divProgress}%"></span></div>
          <div class="mk981-milestones">
            ${[50000,100000,500000].map(x => `
              <div class="${g.currentDividend >= x ? 'done' : ''}">
                <b>${money(x)}/år</b><small>${g.currentDividend >= x ? 'Uppnått' : money(Math.max(0, x-g.currentDividend)) + ' kvar'}</small>
              </div>`).join('')}
          </div>
        </section>

        <section id="mk981Plan" class="mk981-card">
          <div class="mk981-head"><h3>Sparplan</h3><span>lokal prognos</span></div>
          <div class="mk981-plan-row"><span>Månadssparande</span><b>${money(g.monthlySaving)}</b></div>
          <div class="mk981-plan-row"><span>Antagen årsavkastning</span><b>${pct.format(g.expectedReturn)} %</b></div>
          <div class="mk981-plan-row"><span>Beräknad tid till kapitalmål</span><b>${years == null ? '—' : pct.format(years) + ' år'}</b></div>
        </section>

        <section id="mk981Edit" class="mk981-card">
          <div class="mk981-head"><h3>Redigera mål</h3><span>sparas lokalt</span></div>
          <div class="mk981-form-grid">
            <label>Kapitalmål<input id="mk981CapitalGoal" inputmode="numeric" value="${g.capitalGoal}"></label>
            <label>Utdelningsmål/år<input id="mk981DividendGoal" inputmode="numeric" value="${g.dividendGoal}"></label>
            <label>Nuvarande utdelning/år<input id="mk981CurrentDividend" inputmode="numeric" value="${g.currentDividend}"></label>
            <label>Månadssparande<input id="mk981Monthly" inputmode="numeric" value="${g.monthlySaving}"></label>
            <label>Antagen årsavkastning %<input id="mk981Return" inputmode="decimal" value="${g.expectedReturn}"></label>
          </div>
          <button id="mk981SaveGoals" class="mk981-primary">Spara mål och räkna om</button>
          <div id="mk981GoalStatus" class="mk981-status"></div>
        </section>
      </div>`;

    screen.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => document.getElementById(btn.dataset.jump)?.scrollIntoView({behavior:'smooth', block:'start'}));
    });

    screen.querySelector('#mk981SaveGoals')?.addEventListener('click', () => {
      const next = {
        capitalGoal: num(screen.querySelector('#mk981CapitalGoal')?.value),
        dividendGoal: num(screen.querySelector('#mk981DividendGoal')?.value),
        currentDividend: num(screen.querySelector('#mk981CurrentDividend')?.value),
        monthlySaving: num(screen.querySelector('#mk981Monthly')?.value),
        expectedReturn: num(screen.querySelector('#mk981Return')?.value)
      };
      saveJson(GOAL_KEY, next);
      renderGoals();
      setTimeout(() => {
        const s = document.getElementById('mk981GoalStatus');
        if (s) s.textContent = 'Målen sparades lokalt.';
      }, 0);
    });
  }

  function sectionTitle(el) {
    return String(el.querySelector('h1,h2,h3')?.textContent || '').trim();
  }

  function enhancePortfolio() {
    const screen = portfolioScreen();
    if (!screen || screen.querySelector('.mk981-portfolio-nav')) return;

    const all = [...screen.querySelectorAll('section, .card, .panel, article')];
    const wanted = [
      ['Översikt', /cockpit|översikt|portföljvärde/i],
      ['Konton', /^konton$|konto/i],
      ['Tillgångsslag', /tillgångsslag|aktier.*etf|asset/i],
      ['Sektorer', /sektor/i],
      ['Länder', /land|geografi/i],
      ['Innehav', /största innehav|innehav/i],
      ['Risk', /risk|koncentration/i],
      ['Datakvalitet', /datakvalitet|datatäckning/i]
    ];

    const targets = [];
    wanted.forEach(([label, rx], index) => {
      const el = all.find(x => rx.test(sectionTitle(x)));
      if (el && !targets.some(t => t.el === el)) {
        el.id = el.id || `mk981PortfolioSection${index}`;
        targets.push({ label, el });
      }
    });

    if (!targets.length) return;

    const nav = document.createElement('nav');
    nav.className = 'mk981-jumpbar mk981-portfolio-nav';
    nav.setAttribute('aria-label', 'Snabbnavigation i portföljen');
    nav.innerHTML = targets.map(t => `<button data-target="${t.el.id}">${t.label}</button>`).join('');
    screen.insertBefore(nav, screen.firstElementChild);

    nav.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth', block:'start'}));
    });

    targets.forEach(t => {
      const top = document.createElement('button');
      top.className = 'mk981-to-top';
      top.textContent = '↑ Till toppen';
      top.addEventListener('click', () => nav.scrollIntoView({behavior:'smooth', block:'start'}));
      t.el.appendChild(top);
    });
  }

  function readLiveSummary() {
    const fx = localJson('mkos.live.fx.v1', {});
    const rates = fx.rates || fx;
    const fxCount = Object.keys(rates || {}).filter(k => num(rates[k]?.toSEK ?? rates[k]) > 0).length;
    const mappings = localJson('mkos.live.mappings.v1', []);
    const quotes = localJson('mkos.live.quotes.v1', []);
    return {
      fxCount,
      fxDate: fx.date || fx.updatedAt || '—',
      mappings: Array.isArray(mappings) ? mappings.length : 0,
      quotes: Array.isArray(quotes) ? quotes.length : Object.keys(quotes || {}).length
    };
  }

  function enhanceMarket() {
    const screen = marketScreen();
    if (!screen || screen.querySelector('.mk981-market-panel')) return;

    const live = readLiveSummary();
    const panel = document.createElement('section');
    panel.className = 'mk981-card mk981-market-panel';
    panel.innerHTML = `
      <div class="mk981-head"><h3>Live- och källstatus</h3><span>9.8.1</span></div>
      <div class="mk981-kpi-grid">
        <div class="mk981-kpi"><span>ECB-valutor</span><b>${live.fxCount}</b><small>${live.fxDate}</small></div>
        <div class="mk981-kpi"><span>Mappade innehav</span><b>${live.mappings}</b><small>read-only lager</small></div>
        <div class="mk981-kpi"><span>Registrerade kurser</span><b>${live.quotes}</b><small>lokalt sparade</small></div>
        <div class="mk981-kpi"><span>Live-status</span><b>${live.fxCount ? 'AKTIV' : 'VÄNTAR'}</b><small>${live.fxCount ? 'valutagrund klar' : 'uppdatera ECB först'}</small></div>
      </div>
      <div class="mk981-action-grid">
        <button data-action="live">Öppna Live Portfolio<small>Valutor, mappning och kurser</small></button>
        <button data-action="refresh">Uppdatera marknadsvy<small>Läs om lokal live-status</small></button>
      </div>
      <div class="mk981-note">Marknadssidan visar alltid källstatus. Index, rapporter och andra externa värden aktiveras först när respektive källa är verifierad.</div>
    `;
    screen.insertBefore(panel, screen.firstElementChild);

    panel.querySelector('[data-action="live"]')?.addEventListener('click', () => {
      if (typeof global.openLiveFoundation970 === 'function') global.openLiveFoundation970();
      else if (typeof global.showScreen === 'function') global.showScreen('liveFoundation970');
    });
    panel.querySelector('[data-action="refresh"]')?.addEventListener('click', () => {
      panel.remove();
      enhanceMarket();
    });
  }

  function reEnhance() {
    installLegacyLiveShim();
    setChromeVersion();
    renderGoals();
    enhancePortfolio();
    enhanceMarket();
  }

  function boot() {
    style();
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      reEnhance();
      if (attempts > 40) clearInterval(timer);
    }, 250);

    document.addEventListener('click', () => setTimeout(reEnhance, 80), true);
    global.addEventListener('mkos:data-updated', () => setTimeout(reEnhance, 50));
    global.addEventListener('mkos:live980-updated', () => setTimeout(reEnhance, 50));
    global.addEventListener('storage', () => setTimeout(reEnhance, 50));
  }

  global.MKOS981 = { version: VERSION, renderGoals, enhancePortfolio, enhanceMarket, installLegacyLiveShim };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})(window);
