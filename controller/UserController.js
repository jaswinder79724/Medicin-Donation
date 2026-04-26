const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../model/user");
const sendEmail = require("../utils/sendEmail"); // ✅ make sure file exists

require("dotenv").config();

const key = process.env.JWT_SECRET;

//--------------------------------------------------
// ✅ SIGNUP (UPDATED)
const singup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🔥 delete old unverified user (important)
    await UserModel.deleteMany({
      email,
      isVerified: false
    });

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 generate token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated token:", verifyToken);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      role,
      verifyToken,
      isVerified: false,
      
    });

    await newUser.save();

    // 🔗 verification link (TEMP backend link)
// ✅ NEW (frontend route)
     const link = `https://medicare-iota-nine.vercel.app/${verifyToken}`;
    // 📧 send email
    await sendEmail(
      email,
      "Verify Your Account",
      `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}" style="padding:10px 20px;background:green;color:white;text-decoration:none;">
        Verify Email
      </a>
      `
    );

    res.status(201).json({
      success: true,
      message: "Signup successful. Check your email to verify."
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

//--------------------------------------------------
// ✅ VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log("Token from URL:", token);

    const user = await UserModel.findOne({
      verifyToken: token,
    });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid link"
      });
    }

    // ✅ already verified case
    if (user.isVerified) {
      return res.json({
        success: true,
        message: "Already verified"
      });
    }

    // ✅ verify now
    user.isVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//--------------------------------------------------
// ✅ LOGIN (UPDATED)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not exist",
        success: false
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked by admin",
        success: false
      });
    }

    // 🔥 EMAIL NOT VERIFIED
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password incorrect",
        success: false
      });
    }

    const Token = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      key,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login success",
      success: true,
      email: user.email,
      Token,
      role: user.role,
      isProfileComplete: user.isProfileComplete
    });

  } catch (err) {
    res.status(400).json({
      message: `Something wrong: ${err}`,
      success: false
    });
  }
};

//--------------------------------------------------
// (UNCHANGED)
const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

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

//--------------------------------------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const link = `https://medicare-iota-nine.vercel.app/reset-password/${token}`;

    await sendEmail(
      email,
      "Reset Password",
      `<p>Click to reset password:</p><a href="${link}">${link}</a>`
    );

    res.json({
      success: true,
      message: "Reset link sent to email"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//----------------------------------------------
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//------------------------------------
module.exports = {
  singup,
  login,
  updatePassword,
  verifyEmail,
  forgotPassword,
  resetPassword

};