# Mästarklass OS 8.8.5.1 – Transaction Stability Fix

## Rättat

- felet `heroValue is not defined` efter sparad transaktion
- äldre dashboardfält uppdateras nu säkert endast när de finns i DOM
- en redan sparad transaktion rapporteras inte längre som misslyckad på grund av ett efterföljande renderingsfel
- synk, Private Vault och automatisk lokal backup körs före visuell uppdatering
- versionsidentitet och Service Worker-cache är höjda till 8.8.5.1

## Viktigt vid test

Det tidigare försöket kan redan ha hunnit sparas innan felmeddelandet visades. Kontrollera därför först PepsiCo/Montrose-innehavets antal och transaktionshistoriken innan samma köp registreras igen.

## Kontroll efter uppladdning

1. Ladda upp samtliga filer samtidigt till GitHub.
2. Vänta tills GitHub Pages deployment är klar.
3. Öppna plattformen på samma enhet och webbläsare.
4. Kontrollera befintligt antal och historik för innehavet som testades.
5. Registrera därefter en liten testtransaktion.
6. Bekräfta att sparmeddelandet visas, historiken fylls och backupstatus uppdateras.

# Mästarklass OS 8.8.5 – Transaction & Backup Engine

## Nytt
- registrering av köp, försäljningar och utdelningar
- automatiskt antal och viktat GAV vid köp
- kontroll mot registrerat antal vid försäljning
- courtage, valuta och valutakurs till SEK
- transaktionshistorik per innehav
- möjlighet att ta bort en felregistrerad transaktion och återställa föregående antal/GAV
- omedelbar synk till Private Vault, Dashboard, Analytics och Portfolio Brain
- automatisk lokal backup efter varje förändring
- manuell AES-GCM-krypterad `.mkbackup`
- verifiering genom dekryptering och SHA-256-checksumma före nedladdning
- backupstatus: aktuell, ändringar sedan backup eller backup saknas
- lokal backuphistorik
- återställning på en ny enhet

## Registrera ett köp av två PepsiCo
1. Öppna **Mer → Transaktioner & Backup 8.8.5**.
2. Välj **Köp**.
3. Välj PepsiCo och rätt konto.
4. Ange antal `2`, pris per aktie, valuta, valutakurs till SEK och courtage.
5. Kontrollera förhandsvisningen.
6. Tryck **Kontrollera och spara**.

Innehavets antal och GAV uppdateras automatiskt. Ändringen sparas i Private Vault och skapar en automatisk lokal backup.

## Backup
Den automatiska backupen är lokal i IndexedDB och uppdateras efter varje förändring. Den nedladdade `.mkbackup`-filen kan inte skrivas över automatiskt av webbläsaren. Appen visar därför hur många ändringar som har skett sedan filen skapades och när en ny manuell backup bör laddas ned.
