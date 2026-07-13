
window.MKIntegrationScheduler86={
 schedules(){return window.DATA?.liveSourceIntegration86?.schedules||[];},
 nextRun(schedule,now=new Date()){
   const mins=Number(schedule?.intervalMinutes)||60;
   return new Date(now.getTime()+mins*60000).toISOString();
 }
};
