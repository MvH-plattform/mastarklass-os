# Mästarklass OS 9.9.0 – Stabiliseringsrapport

- Projektfiler i releasen: **156**
- JavaScript-filer: **112**
- CSS-filer: **36**
- Skärmar i index: **68**
- Aktiva skärmar vid start: **1**

## Bekräftade grundorsaker

1. `live_loader_9_8_0.js` tvingade `#home` att visas med `display:block!important`, även när Hem inte var aktiv.
2. Loadern skrev 9.8.0 samtidigt som 9.8.1-stabilisatorn uppdaterade versionsnumret återkommande, vilket gav flimrande version.
3. 9.8.1-stabilisatorn körde en återkommande renderloop och lade nya lager ovanpå befintliga skärmar.
4. Repositoryt innehöll flera README-, patch- och recoveryfiler från olika releaseförsök.

## Åtgärder i 9.9.0

- 9.8.0-loadern och 9.8.1-overlayn laddas inte längre.
- En stabil shell-modul äger produktversion och huvudnavigation.
- CSS garanterar exakt en synlig `.screen` åt gången.
- Service Worker har ett nytt cache-ID och rensar gamla kodcacher.
- Endast `README.md` ligger kvar som huvuddokumentation.
- Snabbnavigation för Portfölj byggs utan att ersätta skärmens innehåll.

## Bevarat

- Private Vault, IndexedDB, LocalStorage, innehav, antal, GAV, transaktioner och kreditdata ändras inte av releasen.
