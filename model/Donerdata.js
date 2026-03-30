const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    image: { type: String },

    name: { type: String, required: true },
    gender: { type: String, required: true },

    mobile_no: { type: String, required: true },

    state: { type: String, required: true },
    city: { type: String, required: true },
    full_address: { type: String, required: true },

    donationType: { type: String, required: true },

    note: { type: String }

}, { timestamps: true });
const DonerModel=mongoose.model("DonorInfo", DonorSchema);
module.exports = DonerModel