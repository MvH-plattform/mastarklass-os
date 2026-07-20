# Mästarklass OS 11.0.1 — Live Intelligence Foundation

Detta är första releasen i Live Intelligence-fasen. Den bygger vidare på hela 10.9-systemet och bevarar Portfolio Engine, Transaction Engine, Administration Layer, Portfolio Ledger, Portfolio Intelligence, Decision Center, Capital Allocation och Wealth Intelligence.

## Nytt i 11.0.1

- Provider Registry med utbytbara adapterplatser
- Data Router med kategoribaserad routing och fallback
- separat read-only Live Cache
- Validation Engine för pris, tidsstämpel och färskhet
- Instrument Mapping för portföljens innehav
- Live Event Log
- Foundation Health och täckningsmätning
- kontrollknappar för mappning och validering
- tydlig status för konfigurerade respektive okonfigurerade providers

## Säkerhetsmodell

Live-data får aldrig skriva över:

- antal
- GAV
- transaktioner
- Portfolio Ledger
- kredit
- historik

Live Intelligence är ett separat observationslager. Portfolio Ledger förblir sanningskällan.

## Viktig avgränsning

11.0.1 bygger infrastrukturen. Den hämtar ännu inte fullständiga marknadskurser för samtliga innehav. Nästa steg är 11.1.0 — Live Prices & FX, där adapters ansluts kontrollerat genom registryt.

## Uppladdning

Ladda upp samtliga åtta filer till GitHub-repots rot och ersätt filer med samma namn. Vänta på GitHub Pages, stäng appen helt och öppna den igen.
