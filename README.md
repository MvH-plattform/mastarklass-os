# Mästarklass OS 8.7 – Private Portfolio Vault

## Nytt
- IndexedDB-baserat privat portföljvalv
- automatisk laddning när appen öppnas
- autosparning efter ändringar
- automatisk migrering från 8.6 och äldre lokala data
- krypterad `.mkbackup`-export
- återställning på ny enhet
- AES-GCM 256 och PBKDF2-SHA-256
- SHA-256-integritetskontroll
- migrerings- och kontrollrapport
- publicerad GitHub-kod innehåller inga privata innehav
- externa källor är fortsatt avstängda

## Första öppningen efter uppgradering
På samma telefon och i samma webbläsare söker 8.7 automatiskt efter den lokala 8.6-databasen. Om den hittas migreras dina innehav till IndexedDB och laddas automatiskt.

## Ny enhet
1. Exportera en krypterad `.mkbackup`-fil på den gamla enheten.
2. Öppna Mästarklass OS på den nya enheten.
3. Ange samma lösenfras och välj backupfilen.
4. Portföljen återställs i den nya enhetens IndexedDB.
5. Därefter laddas den automatiskt vid varje start.

## Viktigt
Lösenfrasen lagras inte och kan inte återställas. GitHub-uppdateringar raderar inte IndexedDB, men rensning av webbplatsdata eller enhetsbyte kräver backup.

## Nya filer
- private_vault_8_7.js
- private_vault_8_7.css
- private_vault_db.js
- private_vault_crypto.js
- private_vault_migration.js
- private_vault_integrity.js
