const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["donor", "needy", "admin"],
    required: true
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  // 🔥 EMAIL VERIFICATION
  isVerified: {
    type: Boolean,
    default: false
  },

  verifyToken: {
    type: String
  },

  // 🔥 FORGOT PASSWORD (ADD THIS)
  resetPasswordToken: {
    type: String
  },

  resetPasswordExpire: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);