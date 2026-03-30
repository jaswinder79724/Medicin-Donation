const express=require("express");
const Auth=require("./Routes/Auth")
const donorRoutes = require("./Routes/Doner");
const needyRoutes = require("./Routes/Needy");
const adminRoutes = require("./Routes/admin");
const medicineRoutes = require("./Routes/medicine");
require("dotenv").config();

const bodyparser=require("body-parser")
const cors=require("cors")
require("./model/db")
const app=express();

app.use(bodyparser.json());
app.use(cors());

app.get("/ping",(req,res)=>{
         res.send("pong");
})

app.use("/Auth",Auth)

app.use("/donor", donorRoutes);
app.use("/needy", needyRoutes);
app.use("/admin", adminRoutes);
app.use("/medicine", medicineRoutes);

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`server is stated on ${port}`)
})