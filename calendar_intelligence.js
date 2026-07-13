
window.MKCalendarIntelligence84={
 items(){return window.DATA?.marketConnect83?.calendarItems||[];},
 dated(){return this.items().filter(x=>x.date).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));},
 undated(){return this.items().filter(x=>!x.date);}
};
