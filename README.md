# Mästarklass OS 11.15.26 — IndexedDB Storage Migration

Lagringsrelease för **Permanent Identity Registry**. Versionen flyttar permanent identitetsdata från full `localStorage` till **IndexedDB** och behåller den stabila batchmotorn från 11.15.25.

## Rättat

- Permanent Registry lagras i IndexedDB i stället för localStorage.
- Befintliga permanent sparade identiteter migreras automatiskt vid appstart.
- Den gamla registerposten tas bort från localStorage först efter verifierad IndexedDB-migrering, vilket frigör utrymme.
- Varje godkännande skrivs och läses tillbaka direkt från IndexedDB innan instrumentet tas bort från granskningen.
- Permanent räknare och resolverns mållista använder ett synkroniserat minnescache från IndexedDB.
- Full localStorage kan inte längre blockera nya permanenta identiteter.
- Batchar om högst åtta instrument, checkpoint, paus/fortsätt och säker stopp behålls.
- Resolver Chain Trace visar IndexedDB-start, migrering, skrivning och återläsning.
- Vid lagringsfel ligger instrumentet kvar i granskningen och portföljdata ändras inte.

## Skyddad data

Antal, GAV, marknadsvärde, kredit, transaktioner, Portfolio Ledger, konton och API-nycklar ändras aldrig av migreringen.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta tills GitHub Pages visar grön deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version **11.15.26** visas.
5. Öppna Marknad. De tre tidigare sparade identiteterna ska fortfarande räknas som permanent sparade.
6. Kör en eller två batchar och öppna **Granska resultat**.
7. Godkänn exempelvis Broadcom eller PepsiCo.
8. Bekräfta att instrumentet försvinner från granskningen och att **Permanent sparade** ökar direkt.
9. Starta om appen och kontrollera att posten fortfarande finns kvar.
10. Vid fel: kopiera Resolver Chain Trace. Loggen ska nu ange `IndexedDB` i Permanent write-stegen.
