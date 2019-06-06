class PromiseA {
  constructor(init) {
    this.PromiseStatus = 'pending';
    var resolve=(val)=>{
        if(this.resolveCallback){
            this.PromiseStatus="fulfilled"
            this.resolveCallback(val);
        }
    }
    if(init){
        init(resolve,reject);
    }
  }
  then(onFulfill,onReject) {
    this.resolveCallback=onFulfill;
    this.rejectCallback=onReject;
    return this;
  }
}