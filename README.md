# Mästarklass OS 11.15.34 — Identity Recovery & Safety Lock

Den här versionen söker igenom appens äldre lokala datalager efter tidigare sparade ISIN och skiljer strikt mellan verifierad instrumentidentitet och manuellt godkänd marknadsrutt.

## Nytt

- Automatisk ISIN Recovery vid första starten av 11.15.34.
- Genomsöker samtliga JSON-poster i localStorage och, när webbläsaren tillåter det, alla IndexedDB-databaser och object stores.
- Matchar återfunna ISIN mot värdepapper genom normaliserat namn, konto, tillgångsslag och ticker.
- Skriver återställt ISIN till direktkorrigering, manuellt identitetsregister och live-mappning.
- Visar återställningsstatus direkt i Global Identity Resolver.
- Ny knapp **Sök gamla ISIN** för att köra återställningen igen manuellt.
- Kandidater utan giltigt ISIN sparas som **manuell marknadsrutt**, inte som verifierad identitet.
- Manuella marknadsrutter kan användas för pris efter uttryckligt godkännande, men får högst 89 % identitetssäkerhet.
- ISIN-verifierade och registerverifierade identiteter behåller full verifieringsstatus.
- OpenFIGI-cooldown, IndexedDB-checkpoint och batchmotorn från 11.15.33 behålls.

## När ISIN behöver läggas in på nytt

Gå till **Portfölj → Administrera → Redigera befintligt innehav → välj värdepapper → Öppna redigering**. Fyll i ISIN-fältet och spara direktkorrigeringen. Det lagras därefter versionsoberoende i det manuella identitetsregistret och live-mappningen.

## Test efter uppladdning

1. Ersätt samtliga åtta filer i GitHub-repots rot.
2. Vänta på grön GitHub Pages-deployment.
3. Stäng PWA:n helt och öppna den igen.
4. Kontrollera att version 11.15.34 visas.
5. Öppna Marknad. Kontrollera rutan **ISIN Recovery 11.15.34**.
6. Tryck **Sök gamla ISIN** om automatisk körning inte hittade allt.
7. Kör nästa resolverbatch.
8. Fonder med återställt ISIN ska visa `Fond/ISIN säker identitet` i loggen.
9. Tickerförslag utan ISIN får sparas endast som manuell marknadsrutt och får inte visas som verifierad identitet.
