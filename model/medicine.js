const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: { type: String, required: true }, // medicine name

    quantity: { type: String, required: true },

    expiryDate: { type: String, required: true },

    description: { type: String },

    image: { type: String },

    location: {
        state: String,
        city: String
    }

}, { timestamps: true });
MedicineModel= mongoose.model("Medicine", MedicineSchema);
module.exports = MedicineModel;