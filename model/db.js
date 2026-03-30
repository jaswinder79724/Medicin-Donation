const mongoose=require("mongoose")
const url=process.env.MONGO_URI;

mongoose.connect(url)
.then(()=>{console.log("data base connected")})
.catch((err)=>{console.log("something wrong :",err)})