const Routes=require("express").Router();
const{singupVal,loginVal}=require("../middleware/AuthValidation")
const{singup,login,updatePassword}=require("../controller/UserController")
const Auth=require("../middleware/Auth");


Routes.post("/singup",singupVal,singup)
Routes.post("/login",loginVal,login)

Routes.put("/update-password", Auth, updatePassword);


module.exports=Routes;

