const NeedyModel = require("../model/NeddyData");
const UserModel = require("../model/user");

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

        // check already exist
        const existing = await NeedyModel.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                message: "Needy profile already exists",
                success: false
            });
        }

        const needy = new NeedyModel({
            userId,
            image: req.file?.path || "",
            name,
            gender,
            mobile_no,
            state,
            city,
            full_address,
            disease,
            medicine,
            diseaseProofImage: req.files?.diseaseProofImage?.[0]?.path || "",
            note
        });

        await needy.save();

        // update user profile status
        await UserModel.findByIdAndUpdate(userId, {
            isProfileComplete: true
        });

        res.status(201).json({
            message: "Needy data saved successfully",
            success: true,
            data: needy
        });

    } catch (err) {
        res.status(500).json({
            message: "Error saving needy data",
            error: err.message,
            success: false
        });
    }
};


//-----------------------------------------------------------------

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

//-----------------------------------------------------

const editneddydata = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedData = {
            ...req.body
        };

        // update main image
        if (req.file) {
            updatedData.image = req.file.path;
        }

        // update disease proof image (if using multiple files)
        if (req.files?.diseaseProofImage) {
            updatedData.diseaseProofImage =
                req.files.diseaseProofImage[0].path;
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

module.exports={neddydatasave,showneddydata,editneddydata};