var express = require("express");
var router = express.Router();
var Blog=require('../models/Blog');
var User = require("./user");
const authenticationMiddleware=require('../middleware/authenticatio')


router.post("/",authenticationMiddleware, function(req, res) {
  const userId=req.user.id;
  const author=req.user.name;
  console.log("UseId",userId)

  console.log("name",author)
    const { title,body,tags,pic } = req.body;
    const Newblog = new Blog({
     userId,
     title,
     body,
     tags,
     pic,
     author
    });
    Newblog.save()
      .then((data) => {
        res.send({ message: "Blog was added successfully", data});
        console.log("added");
      })
      .catch(e => res.send({ error: e.message }));
 


});
router.get("/", (req, res,next) =>{
  Blog.find().then((data)=>{
console.log(data)
    res.send(data);
  }).catch((err)=>{
    next(err);
  })
});
//get blogs by user id
router.get('/getByUserId/:id',authenticationMiddleware,async(req,res,next)=>{
    try{ 
      let myProfile=false;
      let id = 0;
    if (req.params.id!='undefined') {
      if(req.params.id==req.user.id)
      {
        myProfile=true;
      }
      id = req.params.id;
    } else {
      id = req.user.id;
    }
        console.log("userId",id)
        const blogs=await Blog.find({userId:id})
        res.json({blogs,myProfile,authorName:req.user.name});
    }
    catch(err){
next(err);
    }

})
//get blog by id
router.get('/:id',authenticationMiddleware,async(req,res,next)=>{
  try{ 
   const id = req.params.id;
      // console.log("userId",id)
      const blogs=await Blog.find({_id:id})

      res.json(blogs);
  }
  catch(err){
next(err);
  }

})
//edit blog
router.patch("/:id",authenticationMiddleware,function(req, res) {
    const id = req.params.id;
    const { title,body,tags,pic } = req.body;
    Blog.findByIdAndUpdate(
      {_id:id},
      {
        title,
        body,
        tags,
        pic
      },
      { new: true, omitUndefined: true, runValidators: true },
      (err, data) => {
        if (err) {
            console.log(err);
            res.statusCode=401;
          res.send("blog is not exist");
        } else {
          res.send({ msg: "blog was edited successfully", userUdated: data });
        }
      }
    );
  });

  router.delete("/:id",authenticationMiddleware, function(req, res) {
    const id = req.params.id;
    console.log("deletedid",id)
    Blog.findByIdAndDelete({ _id: id }, (err, data) => {
      if (err) {
        res.send("Blog is not exist");
      } else {
        res.send("deleted successfully");
      }
    
    });
  
  });
module.exports=router;