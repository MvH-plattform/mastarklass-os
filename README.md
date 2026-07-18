# Mästarklass OS 10.1.1 – Storage Recovery

Denna korrigering löser felet `Setting the value ... exceeded the quota`.

## Vad som ändrats

- äldre portföljdata läses direkt från befintlig lokal lagring utan att dupliceras
- 10.1.1 försöker inte längre skriva en full kopia av portföljen till en ny LocalStorage-nyckel
- mål och månadssparande sparas i ett litet separat inställningslager
- lagringsfel fångas utan att hela appen stannar
- ingen lokal portföljdata, Private Vault, antal, GAV eller transaktioner raderas

## Uppladdning

Ladda upp PART 1 först och PART 2 sist. Rensa inga äldre GitHub-filer förrän appen har öppnats och samtliga huvudflikar har verifierats.
