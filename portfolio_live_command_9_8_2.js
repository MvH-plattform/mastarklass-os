(function(){
'use strict';
const VERSION='9.8.2';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const safe=(fn,fallback=null)=>{try{return fn()}catch(e){return fallback}};
function text(el){return (el?.textContent||'').trim()}
function findHeading(root,terms){return $$('h2,h3,.headline,.title',root).find(h=>terms.some(t=>text(h).toLowerCase().includes(t)))}
function ensureAnchor(el,id){if(!el)return null;let target=el.closest('.card,.ppCard,.intCard,.decisionCard,.screen>div')||el;target.id=target.id||id;target.classList.add('mk982-anchor');return target}
function buildPortfolioNav(){
 const root=$('#portfolio'); if(!root)return;
 let bar=$('.mk982-jumpbar',root); if(bar)return;
 const candidates=[
  ['Översikt',['portfolio cockpit','portfölj']],
  ['Konton',['konton']],
  ['Tillgångsslag',['tillgångsslag']],
  ['Största innehav',['största innehav']],
  ['Datakvalitet',['kvalitetsöversikt','datakvalitet']],
  ['Innehavsanalys',['portfolio intelligence workspace','kontrollrum för varje innehav']],
  ['Beslut',['från analys till handling','ai decision engine']],
  ['Rating',['personlig investeringsintelligens','investment intelligence']]
 ];
 const targets=[];
 candidates.forEach((c,i)=>{const h=findHeading(root,c[1]);const t=ensureAnchor(h,'mk982-sec-'+i);if(t)targets.push([c[0],t.id]);});
 if(!targets.length)return;
 bar=document.createElement('div');bar.className='mk982-jumpbar';bar.setAttribute('aria-label','Snabbnavigering i portföljen');
 targets.forEach(([label,id],i)=>{const b=document.createElement('button');b.textContent=label;b.dataset.target=id;if(i===0)b.classList.add('active');b.onclick=()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});};bar.appendChild(b)});
 root.insertBefore(bar,root.firstChild);
 const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){$$('button',bar).forEach(b=>b.classList.toggle('active',b.dataset.target===e.target.id));}})},{rootMargin:'-150px 0px -65% 0px',threshold:.01});
 targets.forEach(([,id])=>{const el=document.getElementById(id);if(el)obs.observe(el)});
}
function liveState(){
 const fx=safe(()=>JSON.parse(localStorage.getItem('mkos.live.fx.v1')||'{}'),{})||{};
 const rates=fx.rates||{};
 const quotes=safe(()=>JSON.parse(localStorage.getItem('mkos.live.quotes.v1')||'[]'),[])||[];
 const mappings=safe(()=>JSON.parse(localStorage.getItem('mkos.live.mappings.v1')||'[]'),[])||[];
 return {fx:Object.keys(rates).length,quotes:Array.isArray(quotes)?quotes.length:Object.keys(quotes).length,mappings:Array.isArray(mappings)?mappings.length:Object.keys(mappings).length,connector:!!window.MKLiveConnectors970};
}
function buildLiveCommand(){
 const market=$('#market');if(!market||$('#mk982-live-command'))return;
 const box=document.createElement('section');box.id='mk982-live-command';box.className='mk982-livebox mk982-anchor';
 const render=()=>{const s=liveState();box.innerHTML=`<div class="sectionHead"><div><b>Live Command 9.8.2</b><div class="small">Verifierad read-only marknadsdata</div></div><span class="pill ${s.connector?'buy':'watch'}">${s.connector?'KOPPLAD':'KONTROLL'}</span></div><div class="mk982-livegrid"><div class="mk982-livecell"><span>Valutakurser</span><b>${s.fx}</b></div><div class="mk982-livecell"><span>Mappade innehav</span><b>${s.mappings}</b></div><div class="mk982-livecell"><span>Sparade kurser</span><b>${s.quotes}</b></div><div class="mk982-livecell"><span>Connector</span><b>${s.connector?'Aktiv':'Ej laddad'}</b></div></div><div class="mk982-action"><button id="mk982-open-live">Öppna Live Portfolio</button><button class="ghost" id="mk982-refresh">Läs om status</button></div><div class="mk982-note">Live-data får endast uppdatera det separata read-only-lagret. Antal, GAV, transaktioner och Private Vault ändras inte.</div>`;
 $('#mk982-open-live',box).onclick=()=>window.showScreen?.('liveFoundation970',$$('.tab')[2]||$$('.tab')[0]);$('#mk982-refresh',box).onclick=render;};
 render();market.insertBefore(box,market.firstChild);
}
function topButton(){if($('#mk982-top'))return;const b=document.createElement('button');b.id='mk982-top';b.className='mk982-top';b.textContent='↑';b.title='Till toppen';b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});document.body.appendChild(b);window.addEventListener('scroll',()=>b.classList.toggle('show',scrollY>700),{passive:true});}
function updateVersion(){const h=$('header h1');if(h&&/Mästarklass OS/.test(text(h)))h.textContent='Mästarklass OS '+VERSION;$$('header .versionPill,header .osBadge').forEach(x=>x.textContent=VERSION);document.title='Mästarklass OS '+VERSION+' – Portfolio Live Command';}
function init(){updateVersion();buildPortfolioNav();buildLiveCommand();topButton();setTimeout(()=>{buildPortfolioNav();buildLiveCommand()},800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.MK982={version:VERSION,refresh:()=>{buildPortfolioNav();buildLiveCommand();}};
})();
