# Mästarklass OS 11.15.33 — Identity Integrity Engine

Den här versionen reparerar kopplingen mellan manuellt sparade ISIN, portföljens innehav, live-mappningen, resolver-snapshoten och Permanent Identity Registry.

## Nytt

- Läser och sammanfogar identitet från innehav, direktkorrigeringar, manuell instrumentmappning, Permanent Registry och tidigare live-mappning.
- Sparar manuella identiteter i ett separat beständigt register med både holdingKey och instrumentfingeravtryck.
- ISIN finns nu direkt i formulären för att lägga till och redigera värdepapper.
- Resolverns snapshot byggs från den sammanslagna identiteten, så tidigare sparade ISIN följer med in i batchen.
- Traditionella fonder med giltigt ISIN låses som säker identitet utan att skickas till aktieproviders.
- Traditionella fonder utan ISIN fortsätter markeras som `Behöver fondidentitet`.
- Samma ISIN återanvänder en redan permanent identitet för andra konton/innehav.
- Kandidater utan giltigt ISIN kan inte få högre faktisk identitetspoäng än 89 %, utom verifierade poster i det lokala globala registret.
- OpenFIGI går i cooldown direkt efter `Failed to fetch`, så samma nätverksfel upprepas inte för varje instrument.
- Alla versions- och cachefiler är synkroniserade till 11.15.33.

## Viktig avgränsning

En verifierad fondidentitet via ISIN gör att fonden kan kopplas korrekt i systemet. För ett uppdaterat fondvärde krävs dessutom en NAV-källa eller ett lokalt senast känt NAV. Identitet och prisdata är två separata steg.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version 11.15.33 visas.
5. Öppna Marknad och kör nästa resolverbatch.
6. Kontrollera loggen: `Instrument laddat` ska nu visa tidigare sparat ISIN eller `Identity Integrity merge`.
7. Fonder med ISIN ska visa `Fond/ISIN säker identitet` och sparas permanent.
8. Kör därefter live-synkningen. Börshandlade instrument kan få kurs; traditionella fonder kräver NAV-data.
