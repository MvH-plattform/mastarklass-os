# Mästarklass OS 9.9.0 – Stable Foundation

Mästarklass OS är en local-first investeringsplattform för långsiktigt sparande, kvalitetsbolag, hållbara utdelningar och återinvestering. Plattformen är beslutsstöd – inte trading och inte bankkoppling.

## Syftet med 9.9.0

Denna release stabiliserar hela produkten efter att flera äldre patchlager börjat konkurrera med varandra.

- en enda produktversion: 9.9.0
- en enda aktiv skärm åt gången
- en enda huvudnavigation
- startsidan visas bara under Hem
- inga 9.8.0/9.8.1-overlays som skriver om startsidan eller versionsnumret
- en enda README.md i produktroten
- ny och isolerad Service Worker-cache
- lokal portföljdata, Private Vault, antal, GAV och transaktioner lämnas orörda

## Säkerhetsprinciper

- ingen bankinloggning
- ingen handel
- inga API-nycklar i GitHub
- live-data hålls separat och read-only
- användaren äger sin lokala data
- officiella och juridiskt tillåtna datakällor prioriteras

## Uppladdning

Detta är en full release. Ersätt repositoryts innehåll med samtliga filer i paketet. Radera inte webbläsarens lokala lagring eller Private Vault.

Efter publicering: stäng alla gamla appflikar, öppna GitHub Pages igen och kontrollera att 9.9.0 visas stabilt.
