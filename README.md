# Mästarklass OS 8.8.4 – Unified Intelligence Engine

## Nytt

- Ett gemensamt lokalt analysobjekt används av Portfolio Analytics och Portfolio Brain.
- Dynamisk Portfolio IQ baserad på datatäckning, koncentration, överlapp och diversifiering.
- Samma antal överlapp visas i samtliga analysvyer.
- Portfolio Brain Brief fylls automatiskt med spårbara lokala slutsatser.
- Problem, DNA, Radar och hypotetisk kapitalallokering använder samma motor.
- Analysen uppdateras efter återställning, import och lokal portföljsynk.
- Service Worker-cache är reparerad och versionshöjd för säker uppdatering.

## Säkerhet

All privat portföljdata ligger fortsatt lokalt i IndexedDB. GitHub-koden innehåller inga privata innehav. Externa kurser, bankkoppling och handel är fortsatt avstängda.

## Kontroll efter uppladdning

1. Ladda upp alla filer samtidigt till GitHub.
2. Vänta tills GitHub Pages-deploymenten är klar.
3. Öppna appen på samma enhet och i samma webbläsare.
4. Kontrollera att 101 innehav visas.
5. Öppna **Mer → Portfolio Analytics** och kontrollera värde, täckning och överlapp.
6. Öppna **Portfolio Brain 7.1** och kontrollera att IQ, överlapp och Portfolio Brain Brief är ifyllda.
7. Skapa därefter en krypterad `.mkbackup`.
