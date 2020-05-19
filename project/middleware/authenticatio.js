const User=require('../models/User')
const customErr=require('../helper/customError')
module.exports= async (req,res,next)=>{
    try{
            const token=req.headers.authorization;
            console.log(token)
            if(!token) throw customErr ('No Authorization Provided',401);
            const currUser=await User.getUserFromToken(token);
            req.user=currUser;
            next();

    }
    catch(err){
       
        next(err)

    }
}