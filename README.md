# Mästarklass OS 11.15.30 — Checkpoint, Cooldown & Resultatbalans

Stabilitetsrelease ovanpå 11.15.29. Versionen rättar de tre fel som isolerades i Resolver Chain Trace.

## Rättat

- En sparad körning från aktuell version 11.15.30 återställs från IndexedDB och får inte ersättas av `idle 0/0`.
- Körstatus från 11.15.24–11.15.30 kan migreras utan att checkpoint, mållista, cursor eller granskningsresultat tappas.
- Provider-cooldown är monoton: en äldre körsnapshot kan inte längre skriva över nyare felräknare eller aktiv cooldown.
- OpenFIGI går i 15 minuters cooldown efter tre återkommande nätverksfel.
- En sen lyckad callback kan inte förkorta en redan aktiv cooldown.
- Resultatrubriken räknar bara kategorier från aktuell körning och begränsas till faktiskt behandlade instrument.
- `Överhoppade` har döpts om till `Redan permanent` för att skilja redan lösta instrument från misslyckade sökningar.
- Permanent Registry, checkpoint, granskningsresultat och full logg ligger kvar i IndexedDB.

## Oförändrat skydd

Antal, GAV, marknadsvärde, kredit, transaktioner, konton, Portfolio Ledger och API-nycklar ändras aldrig.

## Test efter uppladdning

1. Ersätt samtliga åtta rotfiler i GitHub-repots root.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version 11.15.30 visas.
5. Fortsätt en batch och notera checkpoint, exempelvis `24/74`.
6. Stäng och öppna appen. Samma checkpoint ska återställas, inte `Redo 0/0`.
7. Efter tre OpenFIGI-nätverksfel ska loggen visa `OpenFIGI cooldown` och efterföljande instrument ska hoppa över OpenFIGI.
8. Öppna Granska resultat och kontrollera att kategoriserade resultat aldrig överstiger antalet behandlade.
