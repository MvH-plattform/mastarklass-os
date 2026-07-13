
window.MKLegalCompliance85={
 checks(){return window.DATA?.verifiedData85?.complianceChecks||[];},
 allPassed(){return this.checks().every(x=>x.status==="PASS");},
 blockers(){return this.checks().filter(x=>x.status!=="PASS");}
};
