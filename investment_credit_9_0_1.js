
function ic901SetTab(tab){
  document.querySelectorAll("[data-ic901tab]").forEach(b=>b.classList.toggle("active",b.dataset.ic901tab===tab));
  document.querySelectorAll("[id^='ic901-']").forEach(p=>{if(p.classList.contains("ic901Panel"))p.classList.toggle("active",p.id==="ic901-"+tab)});
}
function setupInvestmentCredit901(){
  document.querySelectorAll("[data-ic901tab]").forEach(b=>{if(!b.dataset.bound){b.dataset.bound="1";b.onclick=()=>ic901SetTab(b.dataset.ic901tab)}});
}
function openInvestmentCredit901(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("investmentCredit901")?.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  renderInvestmentCredit901();window.scrollTo({top:0,behavior:"smooth"});
}
function ic901Money(v){return Math.round(Number(v)||0).toLocaleString("sv-SE")+" kr"}
function ic901Row(title,meta,right,badge,cls="info"){
  return `<div class="ic901Row"><div><div class="ic901Name">${title}</div><div class="ic901Meta">${meta||""}</div>${badge?`<span class="ic901Badge ${cls}">${badge}</span>`:""}</div><div class="ic901Right">${right||""}</div></div>`;
}
async function saveCreditAccount901(){
  const out=document.getElementById("ic901SettingsResult");
  try{
    const account=window.MKCreditEngine901.saveAccount(DATA,{
      name:document.getElementById("ic901NameInput").value,
      platform:document.getElementById("ic901PlatformInput").value,
      limitSEK:document.getElementById("ic901LimitInput").value,
      usedSEK:document.getElementById("ic901UsedInput").value,
      annualRatePct:document.getElementById("ic901RateInput").value,
      collateralValueSEK:document.getElementById("ic901CollateralInput").value
    });
    await window.MKCreditIntegration901.persist(DATA,"Kreditkonto uppdaterades");
    if(out)out.textContent=`Sparat lokalt: ${account.name}, utnyttjad kredit ${ic901Money(account.usedSEK)}.`;
    renderInvestmentCredit901();
  }catch(e){if(out)out.textContent="Kunde inte spara: "+e.message}
}
function creditEventInput901(){
  return {
    type:document.getElementById("ic901EventType").value,
    amountSEK:document.getElementById("ic901EventAmount").value,
    date:document.getElementById("ic901EventDate").value,
    link:document.getElementById("ic901EventLink").value,
    note:document.getElementById("ic901EventNote").value
  };
}
function renderCreditEventPreview901(){
  const box=document.getElementById("ic901EventPreview");if(!box)return;
  try{
    const p=window.MKCreditEngine901.previewEvent(DATA,creditEventInput901());
    box.innerHTML=ic901Row("Kredit före",p.account.name,ic901Money(p.before))+
      ic901Row("Kredit efter",`${p.delta<=0?"Minskning":"Ökning"} ${ic901Money(Math.abs(p.delta))}`,ic901Money(p.after),p.delta<=0?"RISK MINSKAR":"RISK ÖKAR",p.delta<=0?"pass":"wait");
  }catch(e){box.innerHTML='<div class="ic901Meta">Fyll i beloppet för att se kontrollen före sparning.</div>'}
}
async function saveCreditEvent901(){
  const out=document.getElementById("ic901EventResult");
  try{
    const event=window.MKCreditEngine901.applyEvent(DATA,creditEventInput901());
    await window.MKCreditIntegration901.persist(DATA,`${event.type} · ${ic901Money(event.amountSEK)}`);
    if(out)out.textContent=`Sparat: kredit ${ic901Money(event.beforeSEK)} → ${ic901Money(event.afterSEK)}.`;
    renderInvestmentCredit901();
  }catch(e){if(out)out.textContent="Kunde inte spara: "+e.message}
}
function renderCreditSimulation901(){
  const box=document.getElementById("ic901Simulation");if(!box)return;
  try{
    const type=document.getElementById("ic901ScenarioType").value;
    const amount=document.getElementById("ic901ScenarioAmount").value;
    const s=window.MKCreditEngine901.simulate(DATA,type,amount);
    const before=window.MKCreditRisk901.analyze(s.account);
    const afterAcc={...s.account,usedSEK:s.after};
    const after=window.MKCreditRisk901.analyze(afterAcc);
    box.innerHTML=
      ic901Row("Kredit",`${ic901Money(s.before)} → ${ic901Money(s.after)}`,`${s.delta>=0?"+":""}${ic901Money(s.delta)}`)+
      ic901Row("Utnyttjandegrad",`${before.utilizationPct.toFixed(2)} % → ${after.utilizationPct.toFixed(2)} %`,`${(after.utilizationPct-before.utilizationPct).toFixed(2)} pp`)+
      ic901Row("Månatlig ränta",`${ic901Money(before.monthlyInterestSEK)} → ${ic901Money(after.monthlyInterestSEK)}`,ic901Money(after.monthlyInterestSEK-before.monthlyInterestSEK))+
      ic901Row("Säkerhetsnivå",`${before.label} → ${after.label}`,"",after.label,after.level==="GREEN"?"pass":after.level==="YELLOW"?"wait":"block");
  }catch(e){box.innerHTML=ic901Row("Ingen simulering","Konfigurera kreditkontot och ange ett belopp.","")}
}
function renderInvestmentCredit901(){
  if(!document.getElementById("investmentCredit901"))return;
  const account=window.MKCreditEngine901.account(DATA),risk=window.MKCreditRisk901.analyze(account);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set("ic901Used",ic901Money(account?.usedSEK||0));
  set("ic901Limit",ic901Money(account?.limitSEK||0));
  set("ic901Utilization",risk.utilizationPct.toFixed(2)+" %");
  set("ic901Safety",risk.label.toUpperCase());

  const date=document.getElementById("ic901EventDate");if(date&&!date.value)date.value=new Date().toISOString().slice(0,10);
  ["ic901EventType","ic901EventAmount","ic901EventLink"].forEach(id=>{const e=document.getElementById(id);if(e&&!e.dataset.bound){e.dataset.bound="1";e.addEventListener("input",renderCreditEventPreview901);e.addEventListener("change",renderCreditEventPreview901)}});

  if(account){
    document.getElementById("ic901NameInput").value=account.name||"Avanza Kredit";
    document.getElementById("ic901LimitInput").value=account.limitSEK||0;
    document.getElementById("ic901UsedInput").value=account.usedSEK||0;
    document.getElementById("ic901RateInput").value=account.annualRatePct||0;
    document.getElementById("ic901CollateralInput").value=account.collateralValueSEK||0;
    document.getElementById("ic901PlatformInput").value=account.platform||"Avanza KF";
  }

  const ov=document.getElementById("ic901Overview");
  if(ov)ov.innerHTML=account?
    ic901Row("Utnyttjad kredit",account.name,ic901Money(account.usedSEK))+
    ic901Row("Tillgängligt kreditutrymme",`${risk.utilizationPct.toFixed(2)} % utnyttjat`,ic901Money(risk.availableSEK))+
    ic901Row("Belåningsgrad mot registrerat belåningsvärde",`${ic901Money(account.collateralValueSEK)} belåningsvärde`,risk.loanToCollateralPct.toFixed(2)+" %")+
    ic901Row("Årsränta",`${account.annualRatePct.toFixed(2)} %`,ic901Money(risk.annualInterestSEK))+
    ic901Row("Beräknad månadskostnad","Förenklad rak årsberäkning",ic901Money(risk.monthlyInterestSEK))+
    ic901Row("Säkerhetsnivå",`Utnyttjandegrad ${risk.utilizationPct.toFixed(2)} %`,"",risk.label,risk.level==="GREEN"?"pass":risk.level==="YELLOW"?"wait":"block"):
    ic901Row("Kreditkonto saknas","Öppna fliken Kreditkonto och registrera Avanza-krediten.","","KONFIGURERA","wait");

  const impact=document.getElementById("ic901ImpactSummary");
  if(impact)impact.innerHTML=account?
    ic901Row("Portfolio IQ-påverkan","Kreditrisken vägs in i kommande IQ 2.0",`${window.MKCreditIntegration901.creditImpactOnIQ(account)} p`)+
    ic901Row("Försäljningslikvid","Kan registreras som amortering via fliken Förändring.","","STÖDS","pass")+
    ic901Row("Privat kassaflöde","Lön, bolån och hushållsekonomi ingår inte.","","AVGRÄNSAT","pass"):
    ic901Row("Ingen analys ännu","Konfigurera kreditkontot först.","");

  const history=document.getElementById("ic901History");
  const events=DATA?.investmentCredit901?.events||[];
  if(history)history.innerHTML=events.length?events.map(e=>ic901Row(
    `${e.type==="DRAW"?"Ökad kredit":e.type==="REPAY"?"Amortering":e.type==="INTEREST"?"Ränta/avgift":"Korrigering"}`,
    `${e.date} · ${e.link}<br>${e.note||""}<br>${ic901Money(e.beforeSEK)} → ${ic901Money(e.afterSEK)}`,
    ic901Money(e.amountSEK)
  )).join(""):ic901Row("Ingen kredithistorik","Förändringar visas här efter första registreringen.","");

  const sys=document.getElementById("ic901System");
  if(sys)sys.innerHTML=Object.entries(DATA?.investmentCredit901?.status||{}).map(([k,v])=>ic901Row(k,"",v)).join("");

  renderCreditEventPreview901();renderCreditSimulation901();
}
