# Mästarklass OS 11.15.0 — Live Portfolio Valuation Engine

Bygger vidare på 11.14.1 Global Identity Resolver och gör portföljens marknadsvärde dynamiskt.

## Nytt

- beräknar aktuellt innehavsvärde som `antal × livekurs/NAV × FX`
- prioriterar verifierad livekurs eller NAV framför statiskt marknadsvärde
- använder senast känt marknadsvärde eller anskaffningsvärde som tydligt märkt fallback
- räknar om portföljtotal, kontovärden och portföljvikter automatiskt
- beräknar dagens förändring i SEK och procent där kursdata stöder det
- visar live-, NAV-, fallback- och saknad värdetäckning
- visar värdemetod och värdekälla i varje innehavsdetalj
- sparar en lokal read-only värderingssnapshot för övriga intelligenslager
- Portfolio Intelligence, koncentrationsrisk och diversifiering använder de omräknade värdena

## Säkerhet

Värderingsmotorn ändrar aldrig antal, GAV, kredit, transaktioner eller Portfolio Ledger. Live-data ligger i ett separat read-only lager. Saknas säker kurs används senast känt lokalt värde i stället för att skapa ett osäkert marknadsvärde.

## Uppladdning

Ladda upp samtliga åtta filer i paketet till GitHub-repots rot och ersätt befintliga filer. Vänta tills GitHub Pages är grönt. Stäng därefter den installerade PWA:n helt och öppna den igen.
