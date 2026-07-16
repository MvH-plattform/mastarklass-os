# Mästarklass OS 9.7.2 – Live Connector Hotfix

Denna hotfix rättar felet:

`MKLiveConnectors970 is not defined`

## Filer

- `live_connectors_9_7_2.js` – korrigerad ECB- och Alpha Vantage-connector.
- `live_loader_9_7_2.js` – laddar connectorn i rätt ordning och visar ett tydligt fel om filen saknas.
- `index_patch_9_7_2.txt` – den enda rad som behöver läggas in i `index.html`.

## Uppladdning

1. Ladda upp `live_connectors_9_7_2.js` och `live_loader_9_7_2.js` i repositoryts rot.
2. Öppna `index.html` på GitHub och välj redigera.
3. Sök längst ned efter `</body>`.
4. Lägg in raden från `index_patch_9_7_2.txt` direkt ovanför `</body>`.
5. Commit.
6. Vänta tills GitHub Pages-deploymenten är färdig.
7. Stäng appfliken helt och öppna appen igen.
8. Tryck `Uppdatera valutakurser`.

Hotfixen raderar inte LocalStorage, IndexedDB, Private Vault, innehav, GAV eller transaktioner.
