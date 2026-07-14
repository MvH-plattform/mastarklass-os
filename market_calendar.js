
window.MKMarketCalendar83={
 all(){return window.DATA?.marketConnect83?.calendarItems||[];},
 upcoming(){
   return this.all().filter(x=>x.date).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 }
};
