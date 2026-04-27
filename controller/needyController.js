const NeedyModel = require("../model/NeddyData");
const UserModel = require("../model/user");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🔥 helper (same as donor)
const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// ================= CREATE =================
const neddydatasave = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            name,
            gender,
            mobile_no,
            state,
            city,
            full_address,
            disease,
            medicine,
            note
        } = req.body;

        const existing = await NeedyModel.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                message: "Needy profile already exists",
                success: false
            });
        }

        let imageUrl = "";
        let proofUrl = "";

        // ✅ profile image
        if (req.files?.image?.[0]) {
            const result = await uploadToCloudinary(
                req.files.image[0].buffer,
                "needy_profiles"
            );
            imageUrl = result.secure_url;
        }

        // ✅ disease proof image
        if (req.files?.diseaseProofImage?.[0]) {
            const result = await uploadToCloudinary(
                req.files.diseaseProofImage[0].buffer,
                "disease_proofs"
            );
            proofUrl = result.secure_url;
        }

        const needy = new NeedyModel({
            userId,
            image: imageUrl,
            name,
            gender,
            mobile_no,
            state,
            city,
            full_address,
            disease,
            medicine,
            diseaseProofImage: proofUrl,
            note
        });

        await needy.save();

        await UserModel.findByIdAndUpdate(userId, {
            isProfileComplete: true
        });

        res.status(201).json({
            message: "Needy data saved successfully",
            success: true,
            data: needy
        });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({
            message: "Error saving needy data",
            error: err.message,
            success: false
        });
    }
};

// ================= GET =================
const showneddydata = async (req, res) => {
    try {
        const userId = req.user._id;

        const needy = await NeedyModel.findOne({ userId });

        if (!needy) {
            return res.status(404).json({
                message: "Needy data not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Needy data fetched",
            success: true,
            data: needy
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching needy data",
            error: err.message,
            success: false
        });
    }
};

// ================= UPDATE =================
const editneddydata = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedData = { ...req.body };

        // ✅ profile image update
        if (req.files?.image?.[0]) {
            const result = await uploadToCloudinary(
                req.files.image[0].buffer,
                "needy_profiles"
            );
            updatedData.image = result.secure_url;
        }

        // ✅ disease proof update
        if (req.files?.diseaseProofImage?.[0]) {
            const result = await uploadToCloudinary(
                req.files.diseaseProofImage[0].buffer,
                "disease_proofs"
            );
            updatedData.diseaseProofImage = result.secure_url;
        }

        const needy = await NeedyModel.findOneAndUpdate(
            { userId },
            updatedData,
            { new: true }
        );

        if (!needy) {
            return res.status(404).json({
                message: "Needy not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Needy data updated successfully",
            success: true,
            data: needy
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating needy data",
            error: err.message,
            success: false
        });
    }
};

module.exports = {
    neddydatasave,
    showneddydata,
    editneddydata
};