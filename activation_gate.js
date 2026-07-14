
window.MKActivationGate86={
 globalChecks(){return window.DATA?.liveSourceIntegration86?.activationChecks||[];},
 globalReady(){return this.globalChecks().every(x=>x.status==="PASS");},
 connectorReady(connector){return window.MKConnectorFramework86.canEnterProduction(connector);}
};
