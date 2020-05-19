const Blog =require('../models/Blog');
const customErr=require('../helper/customError')

module.exports=(where='params')=>async (req,res,next)=>{
 const blogId=req[where].id;
    const userId=req.user.id;
    const blog=await Blog.findById(blogId);
    if(!blog.userId.equals(userId))
    {
        throw customErr('Not Authorized',403)
        
    }
    next();}
  
