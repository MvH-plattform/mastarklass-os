(function (global) {
  'use strict';

  const VERSION = '9.7.2';
  const ALPHA_KEY = 'mkos.live.alpha.key.v1';
  const MAP_KEY = 'mkos.live.mappings.v1';
  const FX_KEY = 'mkos.live.fx.v1';

  const now = () => new Date().toISOString();
  const num = (value) => Number(String(value ?? '').replace(/\s/g, '').replace(',', '.')) || 0;

  function getAlphaKey() {
    return localStorage.getItem(ALPHA_KEY) || '';
  }

  function setAlphaKey(key) {
    key = String(key || '').trim();
    if (!key) throw new Error('API-nyckeln får inte vara tom.');
    localStorage.setItem(ALPHA_KEY, key);
    global.MKLiveProviderRegistry?.update?.('alphavantage', {
      enabled: true,
      health: 'ready'
    });
  }

  function clearAlphaKey() {
    localStorage.removeItem(ALPHA_KEY);
    global.MKLiveProviderRegistry?.update?.('alphavantage', {
      enabled: false,
      health: 'needs-key'
    });
  }

  function mappings() {
    try {
      const value = JSON.parse(localStorage.getItem(MAP_KEY));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveMapping(mapping) {
    const list = mappings();
    const id = String(mapping?.holdingId || '').trim();
    const symbol = String(mapping?.symbol || '').trim();

    if (!id) throw new Error('Lokalt innehav saknas.');
    if (!symbol) throw new Error('Providersymbol saknas.');

    const row = {
      holdingId: id,
      holdingName: mapping.holdingName || id,
      provider: mapping.provider || 'alphavantage',
      symbol,
      currency: String(mapping.currency || 'USD').toUpperCase(),
      assetType: mapping.assetType || 'equity',
      updatedAt: now()
    };

    const index = list.findIndex((item) => item.holdingId === id);
    if (index >= 0) list[index] = row;
    else list.push(row);

    localStorage.setItem(MAP_KEY, JSON.stringify(list));
    return row;
  }

  function removeMapping(id) {
    const next = mappings().filter((item) => item.holdingId !== id);
    localStorage.setItem(MAP_KEY, JSON.stringify(next));
  }

  async function fetchAlphaQuote(symbol) {
    const key = getAlphaKey();
    if (!key) throw new Error('Alpha Vantage API-nyckel saknas.');

    const cleanSymbol = String(symbol || '').trim();
    if (!cleanSymbol) throw new Error('Providersymbol saknas.');

    const url =
      'https://www.alphavantage.co/query?function=GLOBAL_QUOTE' +
      `&symbol=${encodeURIComponent(cleanSymbol)}` +
      `&apikey=${encodeURIComponent(key)}`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Alpha Vantage svarade ${response.status}.`);

    const data = await response.json();
    if (data.Note) throw new Error('API-gränsen är nådd. Försök senare.');
    if (data.Information) throw new Error(data.Information);

    const quote = data['Global Quote'] || {};
    const price = num(quote['05. price']);
    if (price <= 0) {
      throw new Error(`Ingen giltig kurs för ${cleanSymbol}. Kontrollera symbolen.`);
    }

    return {
      symbol: cleanSymbol,
      price,
      timestamp: quote['07. latest trading day']
        ? `${quote['07. latest trading day']}T21:00:00Z`
        : now(),
      source: 'Alpha Vantage',
      sourceUrl: 'https://www.alphavantage.co/',
      status: 'provider',
      verified: true
    };
  }

  function parseCsvLine(line) {
    const values = [];
    let current = '';
    let quoted = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = !quoted;
        }
      } else if (char === ',' && !quoted) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  }

  async function fetchEcbSeries(currency) {
    currency = String(currency || '').toUpperCase();

    if (currency === 'EUR') {
      return { currency: 'EUR', perEur: 1, date: now().slice(0, 10) };
    }

    const key = `D.${currency}.EUR.SP00.A`;
    const url =
      `https://data-api.ecb.europa.eu/service/data/EXR/${key}` +
      '?format=csvdata&lastNObservations=1';

    const response = await fetch(url, {
      headers: { Accept: 'text/csv' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`ECB svarade ${response.status} för ${currency}.`);
    }

    const text = await response.text();
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) throw new Error(`ECB saknar kurs för ${currency}.`);

    const headers = parseCsvLine(lines[0]);
    const values = parseCsvLine(lines[lines.length - 1]);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));

    const value = num(row.OBS_VALUE);
    if (value <= 0) throw new Error(`Ogiltig ECB-kurs för ${currency}.`);

    return {
      currency,
      perEur: value,
      date: row.TIME_PERIOD || now().slice(0, 10)
    };
  }

  async function refreshFx(currencies) {
    const requested = (currencies || [])
      .map((currency) => String(currency || '').toUpperCase())
      .filter(Boolean);

    const unique = [...new Set(['SEK', 'EUR', ...requested])];
    const fetched = {
      EUR: { currency: 'EUR', perEur: 1, date: now().slice(0, 10) }
    };

    for (const currency of unique) {
      if (currency !== 'EUR') {
        fetched[currency] = await fetchEcbSeries(currency);
      }
    }

    const sek = fetched.SEK;
    if (!sek) throw new Error('ECB SEK-kurs saknas.');

    const rates = {
      SEK: { toSEK: 1, date: sek.date, source: 'ECB' }
    };

    Object.values(fetched).forEach((entry) => {
      rates[entry.currency] = {
        toSEK: sek.perEur / entry.perEur,
        date: entry.date,
        source: 'ECB'
      };
    });

    const payload = {
      version: VERSION,
      updatedAt: now(),
      rates
    };

    localStorage.setItem(FX_KEY, JSON.stringify(payload));
    global.dispatchEvent(
      new CustomEvent('mkos:live-fx-updated', { detail: payload })
    );
    return payload;
  }

  function fxState() {
    try {
      const state = JSON.parse(localStorage.getItem(FX_KEY));
      return state && state.rates
        ? state
        : { version: VERSION, rates: { SEK: { toSEK: 1 } } };
    } catch {
      return { version: VERSION, rates: { SEK: { toSEK: 1 } } };
    }
  }

  function fxToSek(currency) {
    const code = String(currency || 'SEK').toUpperCase();
    return num(fxState().rates?.[code]?.toSEK);
  }

  async function refreshMapping(mapping) {
    if (mapping.provider !== 'alphavantage') {
      throw new Error('Endast Alpha Vantage är extern aktiepilot i 9.7.');
    }
    if (!global.MKLivePortfolioPilot?.upsert) {
      throw new Error('Live Portfolio Pilot är inte laddad.');
    }

    const quote = await fetchAlphaQuote(mapping.symbol);
    let fx = fxToSek(mapping.currency);

    if (!fx) {
      await refreshFx([mapping.currency]);
      fx = fxToSek(mapping.currency);
    }

    return global.MKLivePortfolioPilot.upsert({
      id: mapping.holdingId,
      ticker: mapping.symbol,
      name: mapping.holdingName,
      assetType: mapping.assetType,
      currency: mapping.currency,
      price: quote.price,
      fxToSek: fx,
      timestamp: quote.timestamp,
      source: quote.source,
      sourceUrl: quote.sourceUrl,
      status: 'delayed-or-eod',
      verified: true
    });
  }

  async function refreshAll() {
    const results = [];
    for (const mapping of mappings()) {
      try {
        results.push({
          mapping,
          ok: true,
          quote: await refreshMapping(mapping)
        });
      } catch (error) {
        results.push({
          mapping,
          ok: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    return results;
  }

  global.MKLiveConnectors970 = {
    VERSION,
    getAlphaKey,
    setAlphaKey,
    clearAlphaKey,
    mappings,
    saveMapping,
    removeMapping,
    fetchAlphaQuote,
    fetchEcbSeries,
    refreshFx,
    fxState,
    fxToSek,
    refreshMapping,
    refreshAll
  };

  // 9.7.2 statusmarkering utan att röra Private Vault/IndexedDB.
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.dataset.mkLiveFix = VERSION;
    global.dispatchEvent(
      new CustomEvent('mkos:live-connectors-ready', {
        detail: { version: VERSION }
      })
    );
  });
})(window);
