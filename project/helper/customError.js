module.exports=(msg,statusCode,details=[])=>{
    const err=new Error(msg);
    err.statusCode=statusCode;
    err.details=details;
    return err; 
}