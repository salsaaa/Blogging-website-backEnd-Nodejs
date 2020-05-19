const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const _ =require('lodash');
const jwt=require('jsonwebtoken')
const util=require('util') //34an t7wlha promise 
const saltRound=7;
const jwtSecret=process.env.JWT_SECRET
// const sign=(payload,secret,options)=>new Promise((resolve,reject)=>{
//   jwt.sign(
//     payload,
//     secret,
//     options,
//     (err,token)=>{
//       if(err)return reject(err);
//       return resolve(token)
//     }
//   )
// })
const sign=util.promisify(jwt.sign);
const verify=util.promisify(jwt.verify);
// sign(
//   {userId:123},
//   'mySecret',
//   {expiresIn:'30m'}
// ).then((token)=>{
//   console.log(token)
// }).catch((err)=>{
//   console.error(err);
// })
// verify(
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNTg3NzQyNTIxLCJleHAiOjE1ODc3NDQzMjF9.7KAk307yORppsLNluIxD4406PZaPMybEvsZAOmLZJMg'
// ).then((data)=>console.log(data))
// .catch((err)=>console.log(err))
const User = mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.ObjectId, ref: 'User' }]
},
{
  timestamps: true,
  // toJSON:{virtuals:true,transform:(doc)=>{return _.pick(doc,['name','id','Blogs'])}}
}
);
//for creating hashing
User.pre('save',async function()
{
  const userInstance=this;
  if(this.isModified)
  {
    userInstance.password=await bcrypt.hashSync(userInstance.password, saltRound);
  }
})
//for using hashing
User.methods.comparePassword= function(plainPass){
  const userInstance=this;
  return bcrypt.compare(plainPass,userInstance.password)
}
//generate token
User.methods.generateToken =function(){
  const userInstance=this;
  return sign({userId:userInstance.id},jwtSecret)
}
//verify on token(i dont know who is the user so its a static func)
User.statics.getUserFromToken=async function(token)
{
  const User=this;
  const payload=await verify(token,jwtSecret);
  const currUser=await User.findById(payload.userId)
  if(!currUser) throw new Error('User Not Found')
  return currUser;

}
User.virtual('blogs',
{ref:'Blog',
localField:'_id',
foreignField:'userId'}

)
// User.virtual('friends',
// {ref:'User',
// localField:'_id',
// foreignField:'friendId'}

// )
module.exports = mongoose.model("User", User);

// const User = mongoose.model('User', {

//     username: {type:String, required:true,unique:true},
//     password : {type:String, required:true},
//     firstName: {type:String,required:true, minlength: 3, maxlength: 15},
//     age: {type:Number, optional:true, min : 13}
// });

// module.exports=User;
