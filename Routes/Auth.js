const Routes=require("express").Router();
const{singupVal,loginVal}=require("../middleware/AuthValidation")
const{singup,login}=require("../controller/UserController")
//const Auth=require("../middleware/Auth");


Routes.post("/singup",singupVal,singup)
Routes.post("/login",loginVal,login)


module.exports=Routes;

