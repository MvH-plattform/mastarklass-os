# Mästarklass OS 8.7.1 – Vault Recovery & Migration Stabilization

## Nytt
- söker igenom samtliga LocalStorage-nycklar efter äldre Mästarklass-portföljer
- väljer automatiskt den mest kompletta portföljen
- flexibel CSV-import
- JSON-import
- automatisk normalisering av innehav
- kontrollrapport efter återställning eller import
- Vault Health Check
- backupstatus och påminnelse
- fortsatt lokal IndexedDB-lagring och autosparning
- inga privata innehav i GitHub
- externa källor fortsatt avstängda

## När startsidan visar 0 innehav
1. Tryck **Sök igenom all lokal lagring**.
2. Hittas ingen äldre portfölj, välj **Importera portföljfil**.
3. Välj en CSV- eller JSON-fil med dina innehav.
4. Kontrollera antalet importerade innehav.
5. Ange en lösenfras och exportera en krypterad `.mkbackup`.

Efter lyckad återställning sparas portföljen i IndexedDB och laddas automatiskt varje gång appen öppnas på samma enhet och i samma webbläsare.
