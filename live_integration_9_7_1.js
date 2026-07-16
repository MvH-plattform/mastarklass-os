/* Mästarklass OS 9.7.1 – Live integration fix */
(function () {
  "use strict";

  const VERSION = "9.7.1";
  const MODULES = [
    { src: "./live_provider_registry_9_7_0.js?v=9.7.1", global: "MKLiveProviderRegistry" },
    { src: "./live_portfolio_pilot_9_7_0.js?v=9.7.1", global: "MKLivePortfolioPilot" },
    { src: "./live_connectors_9_7_0.js?v=9.7.1", global: "MKLiveConnectors970" },
    { src: "./live_foundation_ui_9_7_0.js?v=9.7.1", global: "renderLiveFoundation970" }
  ];

  function updateVersionMarks() {
    document.title = "Mästarklass OS 9.7.1 – Live Portfolio Pilot";

    const heading = [...document.querySelectorAll("h1")]
      .find(el => /Mästarklass OS/i.test(el.textContent || ""));
    if (heading) heading.textContent = "Mästarklass OS 9.7.1";

    [...document.querySelectorAll("body *")].forEach(el => {
      if (el.children.length) return;
      const text = (el.textContent || "").trim();
      if (text === "9.4.0" || text === "9.7.0") {
        el.textContent = "9.7.1";
      }
    });
  }

  function showDiagnostic(message, type) {
    const target =
      document.getElementById("live970FxStatus") ||
      document.getElementById("live970SystemStatus") ||
      document.getElementById("liveFoundation970");

    if (!target) return;

    const box = document.createElement("div");
    box.setAttribute("data-live971-diagnostic", "true");
    box.style.cssText =
      "margin:16px 0;padding:16px;border-radius:18px;border:1px solid " +
      (type === "ok" ? "#22c55e" : "#f59e0b") +
      ";background:rgba(15,23,42,.92);color:#f8fafc;font-weight:700;line-height:1.45";
    box.textContent = message;

    const old = document.querySelector('[data-live971-diagnostic="true"]');
    if (old) old.remove();
    target.prepend ? target.prepend(box) : target.appendChild(box);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => {
        try { return new URL(s.src, location.href).pathname.endsWith(src.split("?")[0].replace("./", "/")); }
        catch (_) { return false; }
      });

      if (existing && existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      const script = existing || document.createElement("script");
      script.src = src;
      script.defer = false;
      script.async = false;
      script.dataset.live971 = "true";
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error("Kunde inte ladda " + src.split("?")[0]));
      if (!existing) document.head.appendChild(script);
    });
  }

  async function boot() {
    updateVersionMarks();

    try {
      for (const module of MODULES) {
        if (!window[module.global]) {
          await loadScript(module.src);
        }
        if (!window[module.global]) {
          throw new Error(module.global + " saknas efter laddning");
        }
      }

      window.MKOS_LIVE_971 = {
        version: VERSION,
        ready: true,
        loadedAt: new Date().toISOString(),
        modules: MODULES.map(m => m.global)
      };

      window.addEventListener("mkos:live-pilot-updated", () => {
        if (typeof window.renderLiveFoundation970 === "function") {
          window.renderLiveFoundation970();
        }
      });

      if (typeof window.setupLiveFoundation970 === "function") {
        window.setupLiveFoundation970();
      }
      if (typeof window.renderLiveFoundation970 === "function") {
        window.renderLiveFoundation970();
      }

      showDiagnostic(
        "Live 9.7.1 är korrekt ansluten. ECB-valuta och Alpha Vantage-piloten är redo att testas.",
        "ok"
      );
      console.info("[Mästarklass OS] Live integration 9.7.1 ready", window.MKOS_LIVE_971);
    } catch (error) {
      window.MKOS_LIVE_971 = {
        version: VERSION,
        ready: false,
        error: String(error && error.message ? error.message : error)
      };
      showDiagnostic(
        "Live-integrationen kunde inte starta: " + window.MKOS_LIVE_971.error,
        "error"
      );
      console.error("[Mästarklass OS] Live integration 9.7.1 failed", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
