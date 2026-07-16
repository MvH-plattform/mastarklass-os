# Mästarklass OS 9.1.0 Stable – Investment Intelligence Platform

9.1.0 är den första stabila produktionsversionen efter 9.0.3 Beta.

## Stabilisering

- all Beta-märkning är borttagen
- index, manifest, Service Worker och cache använder 9.1.0
- icke-destruktiv versionsväxling
- IndexedDB och LocalStorage rensas inte
- Private Vault och lokala innehav bevaras
- ny systemstatus för Vault, backup, transaktioner, Analytics, Brain, kredit och Sandbox
- förbättrad mobil statusvy
- bankkoppling och handel fortsatt avstängda

## Projektets avgränsning

Mästarklass OS hanterar investeringar:

- aktier, ETF:er och fonder
- köp, försäljningar och utdelningar
- GAV och transaktionshistorik
- portföljanalys och Portfolio Brain
- värdepapperskredit kopplad till investeringar
- lokal och krypterad backup

Lön, hushållsekonomi, bolån, billån och övriga privata kassaflöden ingår inte.

## Uppladdning till GitHub från mobil

Releasepaketet är uppdelat i delar med högst 100 filer:

1. Ladda upp **PART1** och gör Commit.
2. Ladda upp **PART2** och gör Commit.
3. Vänta tills GitHub Pages-deploymenten är klar.
4. Stäng den gamla appfliken och öppna appen igen.

Alla delar ska laddas upp i repositoryts rot, inte i separata GitHub-mappar.
