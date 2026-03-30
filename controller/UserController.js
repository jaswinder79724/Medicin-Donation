const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const UserModel=require("../model/user")
const key=process.env.JWT_SECRET;

const singup=async(req,res)=>{
    try{
         const{email,password,role}=req.body;
         const user=await UserModel.findOne({email});
         if(user){
            return res.status(400).json({message:"user alredy exist",success:false})
         }
         const userModel=new UserModel({email,password,role})
         userModel.password=await bcrypt.hash(password,10)
         await userModel.save()
         res.status(201).json({message:"singup successfully",success:true})
    }catch(err){
       return res.status(400).json({message:"something wrong :",err,success:false})
    }
}

const login=async(req,res)=>{
    try{
         const{email,password}=req.body
         const user=await UserModel.findOne({email})
         if(!user){
            return res.status(400).json({message:"ussr not exist",success:false})
         }
         if(user.isBlocked){
            return res.status(403).json({
            message: "Your account is blocked by admin",
            success: false
         });
}
         const ispassequal=await bcrypt.compare(password,user.password)
         if(!ispassequal){
            return res.status(400).json({message:"password incorrect",success:false})
         }
         const Token=jwt.sign({email:user.email,_id:user._id,role:user.role},key,{expiresIn:"24h"})

res.status(200).json({
    message: "login success",
    success: true,
    email: user.email,
    Token,
    role: user.role,
    isProfileComplete: user.isProfileComplete
});
    }
    catch(err){
        return res.status(400).json({message:`something wrong :${err}`,success:false})
    }
}

module.exports={
    singup,login
}