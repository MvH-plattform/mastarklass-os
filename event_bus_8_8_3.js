
(function(){
  const listeners=new Map();
  window.MKEventBus883={
    on(event,fn){
      if(!listeners.has(event))listeners.set(event,new Set());
      listeners.get(event).add(fn);
      return ()=>listeners.get(event)?.delete(fn);
    },
    emit(event,payload){
      (listeners.get(event)||[]).forEach(fn=>{try{fn(payload)}catch(e){console.error("EventBus",event,e)}});
      (listeners.get("*")||[]).forEach(fn=>{try{fn({event,payload})}catch(e){}});
    }
  };
})();
