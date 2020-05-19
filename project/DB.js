const mongoose = require("mongoose");

const db=mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=>{
  console.log('connected to server successfully')
})
.catch((err) => {
  console.log('Server Error: ',err)
  process.exit(1); //e2fel el process malha4 lazma
})

module.exports=db;