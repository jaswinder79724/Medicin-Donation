const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["donor", "needy", "admin"], 
        required: true 
    },

    // important for flow
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    
    isBlocked: {
    type: Boolean,
    default: false
}

},

{ timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);