const MedicineModel = require("../model/medicine");
const DonorModel = require("../model/Donerdata"); // import

//----------------------------------------------------------------------------------
const createMedicine = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            name,
            quantity,
            expiryDate,
            description,
            state,
            city
        } = req.body;

        const medicine = new MedicineModel({
            userId,
            name,
            quantity,
            expiryDate,
            description,
            image: req.file?.path || "",
            location: { state, city }
        });

        await medicine.save();

        res.status(201).json({
            message: "Medicine post created",
            success: true,
            data: medicine
        });

    } catch (err) {
        res.status(500).json({
            message: "Error creating post",
            error: err.message,
            success: false
        });
    }
};



//-----------------------------------------------------------------------------------------

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await MedicineModel.find()
      .populate("userId", "email"); // only email from user

    // 🔥 attach donor info manually
    const result = await Promise.all(
      medicines.map(async (m) => {
        const donor = await DonorModel.findOne({ userId: m.userId._id });

        return {
          ...m._doc,
          donor: donor || null
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "All medicines",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

//---------------------------------------------------------------------------------------
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        await MedicineModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Post deleted",
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: "Error deleting post",
            error: err.message,
            success: false
        });
    }
};

//--------------------------------------------------------------------------------------------
const getMyMedicines = async (req, res) => {
    try {
        const userId = req.user._id;

        const medicines = await MedicineModel.find({ userId });

        res.status(200).json({
            message: "My medicines fetched",
            success: true,
            data: medicines
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching my medicines",
            error: err.message,
            success: false
        });
    }
};


//-----------------------------------------------------------------------------------------
const filterMedicines = async (req, res) => {
  try {
    const { name, city } = req.query;

    let filter = {};

    // 🔍 NAME
    if (name) {
      const words = name.trim().split(/\s+/);

      filter.$and = words.map(word => ({
        name: { $regex: word, $options: "i" }
      }));
    }

    // 📍 CITY
    if (city) {
      if (filter.$and) {
        filter.$and.push({
          "location.city": { $regex: city, $options: "i" }
        });
      } else {
        filter["location.city"] = { $regex: city, $options: "i" };
      }
    }

    // ✅ Step 1: populate email
    const medicines = await MedicineModel.find(filter)
      .populate("userId", "email");

    // ✅ Step 2: attach donor info
    const result = await Promise.all(
      medicines.map(async (m) => {

        const userId =
          typeof m.userId === "object" ? m.userId._id : m.userId;

        const donor = await DonorModel.findOne({ userId });

        return {
          ...m._doc,
          donor: donor || null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


module.exports={createMedicine,
    getAllMedicines,
    deleteMedicine,
getMyMedicines,
filterMedicines }