# Mästarklass OS 10.4 – Portfolio Ledger

Detta är nästa sammanhängande lager ovanpå Portfolio Engine, Transaction Engine och Administration Layer.

## Nytt i 10.4

- gemensamt revisionsspår för hela portföljen
- automatisk migrering av befintliga transaktioner och direktkorrigeringar till ledgern
- historik per innehav i innehavskortet
- manuella händelser: insättning, uttag, utdelning, skatt, ränta, avgift, valutaväxling, split, namnbyte, anteckning och AI-rekommendation
- konto, innehav, belopp och kommentar kan kopplas till varje händelse
- full backup omfattar nu även Portfolio Ledger
- live-lagret förblir read-only och får inte skriva över antal, GAV, kredit, transaktioner eller ledger

## Uppladdning

Ladda upp samtliga åtta filer till repositoryts rot och ersätt filer med samma namn. Vänta tills GitHub Pages har deployat färdigt. Stäng därefter den installerade appen helt och öppna den igen.

Ingen befintlig lokal portföljdata raderas.
