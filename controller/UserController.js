const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const UserModel=require("../model/user")
require("dotenv").config();

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


//--------------------------------------------------------------------------------------
const updatePassword = async (req, res) => {
    // console.log("ok")
  try {
    const userId = req.user._id; // from auth middleware

    const { oldPassword, newPassword } = req.body;
    

    // 🔍 check fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // 🔍 find user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔐 check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // 🔒 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//-------------------------------------------------------------------------------------
module.exports={
    singup,login,updatePassword
}