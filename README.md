# Mästarklass OS 9.2.0 – Transaction Intelligence 2.0

Version 9.2.0 bygger vidare på den fungerande 9.1.0 Stable-basen.

## Huvudnyhet

En försäljning skiljs nu från ett uttag ur investeringsportföljen.

Försäljningslikvid kan registreras som:

- kontanter kvar på investeringskontot
- amortering av Avanza värdepapperskredit
- uttag ur investeringsportföljen
- direkt återinvestering

## Ny kapitalmodell

Plattformen skiljer på:

- värdepappersvärde
- kontanter inom investeringskonton
- totalt investeringskapital
- uttag ur portföljen
- kreditamortering
- realiserat resultat

Det innebär att en såld fond inte behöver minska det totala investeringskapitalet när pengarna fortfarande ligger kvar hos Avanza, SAVR, Montrose, Länsförsäkringar eller Lysa.

## Korrigering av tidigare Spiltan-försäljning

Om cirka 22 000 kr från Spiltan-försäljningen fortfarande ligger kvar på investeringskontot:

1. Öppna **Mer → Transaction Intelligence 9.2**.
2. Välj **Likvidjustering**.
3. Välj kontot där pengarna ligger.
4. Ange det exakta positiva beloppet.
5. Förhandsgranska och spara.

Det återställer pengarna som investeringskontanter utan att fondinnehavet återskapas.

## Säkerhet

- all privat portföljdata ligger lokalt
- IndexedDB och Private Vault rensas inte
- ingen bankkoppling
- ingen handel
- inga löner, hushållsflöden, bolån, billån eller andra privata lån

## Uppladdning

Ladda upp PART1 och gör Commit. Ladda därefter upp PART2 och gör Commit. Båda delarnas filer ska ligga i repositoryts rot.
