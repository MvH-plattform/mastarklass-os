
(function(){
  const V='9.8.0';
  function add(tag,attrs){
    const el=document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>el[k]=v);
    document.head.appendChild(el);
    return el;
  }
  if(!document.querySelector('link[data-mk980]')){
    const l=add('link',{rel:'stylesheet',href:'live_portfolio_9_8_0.css?v='+V});l.dataset.mk980='1';
  }
  if(!document.querySelector('script[data-mk980]')){
    const s=add('script',{src:'live_portfolio_9_8_0.js?v='+V,async:false});s.dataset.mk980='1';
  }
})();
