
window.MKDataLineage85={
 create(point){
   return {
     sourceId:point.sourceId||null,
     adapter:point.adapter||null,
     observedAt:point.observedAt||null,
     fetchedAt:point.fetchedAt||new Date().toISOString(),
     validation:point.validation||null,
     cacheState:point.cacheState||null,
     normalizedAs:point.normalizedAs||null,
     consumedBy:point.consumedBy||[]
   };
 }
};
