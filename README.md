# Mästarklass OS 8.2 – Live Portfolio Engine

## Nytt
- Portfolio Valuation Engine
- Ticker Mapping
- verifierad CSV-kursimport
- FX Conversion Engine
- dagsförändringsmotor
- källa och tidsstämpel per innehav
- full datastatus
- fallback till lokalt verifierat marknadsvärde
- inga fabricerade livekurser
- ingen bankkoppling eller handel

## Aktuellt lokalt utfall
- portföljvärde: 310,970 kr
- Engine Score: 50/100
- värdetäckning: 60%
- tickerkartläggning: 0%
- antal/andelar täckning: 94%
- aktiva externa kurskällor: 0

## Viktigt
Portföljvärdet bygger ännu på senast lokalt verifierade marknadsvärden. Dagsförändring visas först när aktuell kurs, tidigare stängningskurs, valuta, källa och tidsstämpel är verifierade.

## Officiella öppna datakandidater
- Sveriges Riksbank: räntor och valutakurser
- SCB: svensk makrostatistik

Aktiekurser, ETF-kurser, fondkurser, rapporter och utdelningar aktiveras inte förrän en källa är gratis för avsedd användning, avtalsmässigt tillåten, tekniskt stabil och kan användas utan hemligheter i frontend.

## Nya filer
- live_portfolio_8_2.js
- live_portfolio_8_2.css
- ticker_mapping.js
- portfolio_valuation.js
- snapshot_importer.js
- live_snapshot_template.csv
