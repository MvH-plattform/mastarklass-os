# Mästarklass OS 10.6.1 — Decision Center Navigation Fix

En stabiliseringsrelease ovanpå 10.6.0. Samma sammanhängande produkt och samma lokala portföljdata.

## Korrigerat i 10.6.1

- Analys öppnas nu korrekt från bottenmenyn.
- Decision Center renderas utan JavaScript-fel.
- Prioriterad kandidat och arbetslistor använder nu rätt innehavsreferenser.
- Analysikonen kan inte längre bli aktiv medan föregående Portfölj-vy ligger kvar.
- Innehavsdetaljer, redigering, köp/sälj, ledger, kredit och backup är oförändrade.
- Version, manifest, cache, service worker och versionsfil är synkroniserade till 10.6.1.
- Ingen lokal portföljdata, GAV, antal, kredit, transaktion eller ledger skrivs över.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta tills GitHub Pages visar en ny deployment. Stäng därefter den installerade appen helt och öppna den igen.

## Kontroll

1. Öppna Portfölj → Alla innehav.
2. Tryck på Analys i bottenmenyn.
3. Kontrollera att Decision Center visas direkt.
4. Öppna en kandidat från arbetslistan och kontrollera att detaljkortet öppnas.
