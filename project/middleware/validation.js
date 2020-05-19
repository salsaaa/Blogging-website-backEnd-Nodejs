const {validationResult}=require('express-validator')
const customErr=require('../helper/customError')
module.exports=(...validations)=>
    async(req,res,next)=>{
      await Promise.all( validations.map(v=>v.run(req))); //promis all btstna lama kol el validations tkhls
            const {errors} = validationResult(req);
    if (!errors.length) {
      return next();
    }
    throw customErr('Validation error',422,errors)
   
  
       
    }

