const DonorModel = require("../model/Donerdata");
const UserModel = require("../model/user");

const donnerdatasave = async (req, res) => {
    try {
        const userId = req.user._id; // from JWT middleware
       console.log(req.body);
        const {
            name,
            gender,
            mobile_no,
            state,
            city,
            full_address,
            donationType,
            note
        } = req.body;

        // check already exist
        const existing = await DonorModel.findOne({ userId });
        if (existing) {
            return res.status(400).json({
                message: "Donor profile already exists",
                success: false
            });
        }

        const donor = new DonorModel({
            userId,
            image: req.file?.path || "", // cloudinary/file upload
            name,
            gender,
            mobile_no,
            state,
            city,
            full_address,
            donationType,
            note
        });

        await donor.save();

        // update user profile status
        await UserModel.findByIdAndUpdate(userId, {
            isProfileComplete: true
        });

        res.status(201).json({
            message: "Donor data saved successfully",
            success: true,
            data: donor
        });

    } catch (err) {
        res.status(500).json({
            message: `Error saving donor data ${err}`,
            error: err.message,
            success: false
        });
    }
};

//--------------------------------

const showdonnerdata = async (req, res) => {
    try {
        const userId = req.user._id;

        const donor = await DonorModel.findOne({ userId });

        if (!donor) {
            return res.status(404).json({
                message: "Donor data not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Donor data fetched",
            success: true,
            data: donor
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching donor data",
            error: err.message,
            success: false
        });
    }
};

//-------------------------
const editdonnerdata = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedData = {
            ...req.body
        };

        // if new image uploaded
        if (req.file) {
            updatedData.image = req.file.path;
        }

        const donor = await DonorModel.findOneAndUpdate(
            { userId },
            updatedData,
            { new: true }
        );

        if (!donor) {
            return res.status(404).json({
                message: "Donor not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Donor data updated successfully",
            success: true,
            data: donor
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating donor data",
            error: err.message,
            success: false
        });
    }
};

module.exports={donnerdatasave,showdonnerdata, editdonnerdata}