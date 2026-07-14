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
