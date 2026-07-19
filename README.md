# Mästarklass OS 10.3.1 — Portfolio Administration Layer

Detta är nästa sammanhängande steg ovanpå Portfolio Engine och Transaction Engine. Versionen bygger ett lokalt Master Data-lager utan att skriva över den äldre portföljkällan.

## Nytt i 10.3.1

- redigera antal, GAV, konto, valuta, ticker, tillgångsslag och marknadsvärde utan att skapa en falsk transaktion
- lägga till nya värdepapper utan köptransaktion
- registrera köp och försäljningar med datum, antal, pris, courtage, valuta och valutakurs
- automatisk uppdatering av antal och viktat GAV vid köp
- försäljningskontroll som hindrar försäljning av fler enheter än innehavet
- lokal transaktionshistorik med möjlighet att radera och återställa
- separat kreditregister per konto med kreditlimit, utnyttjad kredit och ränta
- spårbar ändringslogg och ångra senaste direktkorrigering
- full backup av basportfölj, administrationslager, kredit och transaktioner
- live-lagret förblir read-only och får inte skriva över privat masterdata

## Säker datamodell

Basportföljen läses från befintlig lokal lagring. Nya ändringar lagras i små separata lokala lager för administration och transaktioner. Det minskar risken för lagringskvotfel och bevarar äldre data.

## Uppladdning

Ladda upp samtliga åtta filer till repositoryts rot och ersätt filer med samma namn. Vänta tills GitHub Pages är färdig. Stäng därefter den installerade appen helt och öppna den igen.
