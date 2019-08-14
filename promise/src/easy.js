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
      setTimeout(() => { // 为了支持同步任务
        init(resolve,reject);
      })  
    }
  }
  then(onFulfill,onReject) {
    this.resolveCallback=onFulfill;
    this.rejectCallback=onReject;
    return this;
  }
}