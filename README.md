# Mästarklass OS 9.0.3 Beta – Credit Risk Intelligence Pro

Detta är en komplett Beta-release. `index.html`, `manifest.json`, `sw.js`, README och samtliga 9.0.3-moduler är synkroniserade till samma version.

## Innehåll

- dynamiskt Credit Risk Score 0–100
- riskklass: låg, normal, förhöjd eller hög
- Credit Risk Intelligence Pro
- stresstest vid portföljfall
- säkerhetsmarginal
- rekommenderad amortering
- teoretiskt kreditutrymme inom målzonen
- AI Credit Coach Pro
- Investment Credit Center
- Private Vault och krypterad backup
- inga andra lån, löner eller hushållsflöden
- ingen bankkoppling och ingen handel

## Versions- och cachefix

Beta-versionen innehåller en icke-destruktiv versionsvakt:

- uppdaterar Service Worker
- tar bort äldre Mästarklass-cacheversioner
- raderar **inte** IndexedDB
- raderar **inte** LocalStorage
- raderar **inte** dina 101 innehav

Appens synliga byggmärke visar `9.0.3 BETA`.

## Uppladdning

1. Packa upp ZIP-filen.
2. Markera samtliga filer.
3. Ladda upp dem samtidigt till GitHub.
4. Vänta tills GitHub Pages-deploymenten är färdig.
5. Stäng den gamla appfliken/PWA:n och öppna den igen.
6. Öppna gärna sidan första gången med `?v=903-beta`.

Radera inte webbplatsdata i Chrome. Det behövs inte för denna release och kan radera den lokala Private Vault-databasen.
