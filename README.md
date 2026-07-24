# Mästarklass OS 11.15.27 — IndexedDB Unified State Recovery

Beständig återställningsrelease för hela Global Identity Resolver. Permanent Registry, batchcheckpoint, mållista, granskningsresultat och Resolver Chain Trace använder nu samma IndexedDB-lager.

## Rättat

- Permanent Identity Registry fortsätter att lagras i IndexedDB.
- Aktiv körstatus och checkpoint speglas beständigt i IndexedDB efter varje förändring.
- Mållistan och alla behandlade granskningsresultat återställs efter appbyte, omstart eller Android-minnesrensning.
- Resolver Chain Trace med högst 400 rader återställs från IndexedDB.
- En avbruten `running`-körning återställs säkert som `paused` och kan fortsätta från senaste checkpoint.
- När appen går till bakgrunden görs en omedelbar samlad skrivning av körstatus, logg och diagnostikmetadata.
- `sessionStorage` används endast som snabb reservspegel; det är inte längre den beständiga sanningskällan.
- Full `localStorage` kan inte blockera Permanent Registry eller resolverns arbetsstatus.
- Befintliga nio permanenta identiteter i IndexedDB bevaras.
- Batchstorlek, stoppfunktion och högst åtta instrument per batch är oförändrade.

## Skyddad data

Antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger, konton och API-nycklar ändras aldrig av migreringen.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.27** visas.
5. Kontrollera att de tidigare permanenta identiteterna fortfarande visas.
6. Kör två batcher och öppna **Granska resultat**.
7. Lämna appen, öppna webbläsaren och återvänd sedan till PWA:n.
8. Kontrollera att checkpoint, granskningslista och logg finns kvar.
9. Godkänn ett instrument och kontrollera att det försvinner från granskningen och ökar **Permanent sparade**.
10. Starta om appen och kontrollera att både den permanenta posten och batchläget finns kvar.

## Tekniska kontroller

- `app.js` har validerats med `node --check`.
- Alla versionsreferenser och service worker-cache är satta till 11.15.27.
- IndexedDB-databasen och befintlig Permanent Registry behåller samma namn, vilket skyddar redan sparade poster.
