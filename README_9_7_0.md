# Mästarklass OS 9.7.0 – Live Portfolio Pilot

Detta är första kontrollerade steget mot verklig livekoppling.

## Ingår
- Data Source Registry för flera källor
- read-only kurslager separat från Private Vault
- stöd för aktier, ETF:er, fonder och valuta
- färskhetsklassning: fresh, stale, expired
- avvikelsekontroll mot lokalt värde
- blockeringsgräns för orimliga kurser
- CSV- och manuell pilotimport
- full lokal auditlogg
- inga API-nycklar, ingen bankkoppling och ingen handel

## Viktigt
Denna release aktiverar inte en extern leverantör ännu. Den bygger test- och säkerhetslagret som krävs innan en juridiskt godkänd marknadsdatakälla kopplas in.

## Integrering i index.html
Lägg till i `<head>`:

```html
<link rel="stylesheet" href="live_portfolio_pilot_9_7_0.css">
```

Lägg till före `</body>`:

```html
<script src="live_provider_registry_9_7_0.js"></script>
<script src="live_portfolio_pilot_9_7_0.js"></script>
<script src="live_portfolio_pilot_ui_9_7_0.js"></script>
<script src="version_guard_9_7_0.js"></script>
```

Placera vyn där den ska visas:

```html
<div data-mk-live-pilot></div>
```

## Nästa del
9.7.1 Provider Pilot kopplar en första extern read-only källa efter juridisk, teknisk och täckningsmässig kontroll.
