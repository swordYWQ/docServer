module.exports = {
  checkParams:(str,params)=>{
    if(params.hasOwnProperty(str)){
      return true;
    }
    return false;
  }
}