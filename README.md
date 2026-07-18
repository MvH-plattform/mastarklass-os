# Mästarklass OS 10.0 — Stable Foundation

En ren, sammanhängande local-first grund för långsiktigt sparande, kvalitetsbolag, hållbara utdelningar och återinvestering.

## Aktiv produktstruktur
- en `index.html`
- en `app.js`
- en `styles.css`
- en `manifest.json`
- en `sw.js`
- en `README.md`

## Säkerhetsprinciper
- ingen bankinloggning
- ingen handel
- inga API-nycklar i GitHub
- portföljdata lagras lokalt
- externa marknadsdata är read-only
- antal, GAV och transaktioner ändras aldrig av live-lagret

## Uppgradering
Ladda upp samtliga filer i detta paket till repositoryts rot och ersätt filer med samma namn. Version 10.0 refererar inte till äldre patch-, loader- eller recoveryfiler. Den nya Service Workern rensar äldre cacheversioner automatiskt.
