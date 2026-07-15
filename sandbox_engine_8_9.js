
(function(){
  window.MKSandbox89={
    current:null,
    run(data,input){
      const result=window.MKPortfolioImpact89.simulate(data,input);
      this.current=result;
      return result;
    },
    clear(){this.current=null},
    get(){return this.current}
  };
})();
