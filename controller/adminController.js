const UserModel = require("../model/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password");

        res.status(200).json({
            message: "All users fetched",
            success: true,
            data: users
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching users",
            error: err.message,
            success: false
        });
    }
};

const blockUnblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // toggle block
        user.isBlocked = !user.isBlocked;

        await user.save();

        res.status(200).json({
            message: user.isBlocked 
                ? "User blocked successfully"
                : "User unblocked successfully",
            success: true,
            data: user
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating user",
            error: err.message,
            success: false
        });
    }
};

module.exports={getAllUsers, blockUnblockUser}