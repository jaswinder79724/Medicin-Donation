const Routes = require("express").Router();
const { singupVal, loginVal } = require("../middleware/AuthValidation");
const { singup, login, updatePassword, verifyEmail, forgotPassword, resetPassword } = require("../controller/UserController");
const Auth = require("../middleware/Auth");

Routes.post("/singup", singupVal, singup);
Routes.post("/login", loginVal, login);

// 🔥 ADD THIS
Routes.get("/verify/:token", verifyEmail);

Routes.put("/update-password", Auth, updatePassword);

Routes.post("/forgot-password", forgotPassword);
Routes.post("/reset-password/:token", resetPassword);

module.exports = Routes;