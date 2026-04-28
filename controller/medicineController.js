const MedicineModel = require("../model/medicine");
const DonorModel = require("../model/Donerdata");

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🔥 helper function
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

//----------------------------------------------------------------------------------
// ✅ CREATE MEDICINE (UPDATED)
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

    let imageUrl = "";

    // ✅ upload image to cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "medicine_images"
      );
      imageUrl = result.secure_url;
    }

    const medicine = new MedicineModel({
      userId,
      name,
      quantity,
      expiryDate,
      description,
      image: imageUrl,
      location: { state, city }
    });

    await medicine.save();

    res.status(201).json({
      message: "Medicine post created",
      success: true,
      data: medicine
    });

  } catch (err) {
    console.error(err);
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
      .populate("userId", "email");

    const result = await Promise.all(
      medicines.map(async (m) => {
        try {
          const userId =
            typeof m.userId === "object" ? m.userId._id : m.userId;

          const donor = await DonorModel.findOne({ userId });

          return {
            ...m._doc,
            donor: donor || null
          };
        } catch (err) {
          return {
            ...m._doc,
            donor: null
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      message: "All medicines",
      data: result
    });

  } catch (err) {
    console.error("GET ALL ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//---------------------------------------------------------------------------------------
// DELETE
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
// GET MY MEDICINES
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

    // ✅ fetch medicines
    const medicines = await MedicineModel.find(filter)
      .populate("userId", "email");

    // ✅ SAFE donor attach
    const result = await Promise.all(
      medicines.map(async (m) => {
        try {
          if (!m.userId) {
            return { ...m._doc, donor: null };
          }

          const userId =
            typeof m.userId === "object" ? m.userId._id : m.userId;

          const donor = await DonorModel.findOne({ userId });

          return {
            ...m._doc,
            donor: donor || null
          };
        } catch (err) {
          return {
            ...m._doc,
            donor: null
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("FILTER ERROR:", err); // 👈 MUST ADD
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//-----------------------------------------------------------------------------------------

module.exports = {
  createMedicine,
  getAllMedicines,
  deleteMedicine,
  getMyMedicines,
  filterMedicines
};