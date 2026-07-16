/* Mästarklass OS 9.7.1 – non-destructive service worker */
const MKOS_VERSION = "9.7.1";
const CODE_CACHE = "mkos-code-9.7.1";
const INTEGRATION_SCRIPT = "./live_integration_9_7_1.js?v=9.7.1";

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CODE_CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./live_integration_9_7_1.js",
        "./live_provider_registry_9_7_0.js",
        "./live_portfolio_pilot_9_7_0.js",
        "./live_connectors_9_7_0.js",
        "./live_foundation_ui_9_7_0.js"
      ]).catch(() => undefined)
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key !== CODE_CACHE && /mkos|mastarklass/i.test(key))
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

function injectIntegration(html) {
  if (html.includes("live_integration_9_7_1.js")) return html;

  const tag =
    '<script src="' + INTEGRATION_SCRIPT +
    '" data-mkos-live-fix="9.7.1"></script>';

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, tag + "\n</body>");
  }
  return html + "\n" + tag;
}

async function navigationResponse(request) {
  try {
    const network = await fetch(request, { cache: "no-store" });
    const contentType = network.headers.get("content-type") || "";

    if (!network.ok || !contentType.includes("text/html")) {
      return network;
    }

    const html = injectIntegration(await network.text());
    const headers = new Headers(network.headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("cache-control", "no-store, max-age=0");
    headers.set("x-mkos-version", MKOS_VERSION);

    const response = new Response(html, {
      status: network.status,
      statusText: network.statusText,
      headers
    });

    const cache = await caches.open(CODE_CACHE);
    cache.put("./index.html", response.clone()).catch(() => undefined);
    return response;
  } catch (_) {
    const cached = await caches.match("./index.html");
    if (!cached) throw _;
    const html = injectIntegration(await cached.text());
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(navigationResponse(request));
    return;
  }

  if (url.origin !== self.location.origin || request.method !== "GET") return;

  event.respondWith((async () => {
    try {
      const network = await fetch(request, { cache: "no-store" });
      if (network.ok) {
        const cache = await caches.open(CODE_CACHE);
        cache.put(request, network.clone()).catch(() => undefined);
      }
      return network;
    } catch (_) {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
