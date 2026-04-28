const express = require("express");
const router = express.Router();

const ensureAuth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");

// ✅ multer import (memory storage वाला)
const upload = require("../middleware/upload");

const {
    createMedicine,
    getAllMedicines,
    deleteMedicine,
    getMyMedicines,
    filterMedicines
} = require("../controller/medicineController");

// 🩸 donor create post (WITH IMAGE)
router.post(
    "/create",
    ensureAuth,
    checkRole("donor"),
    upload.single("image"), // ✅ IMPORTANT
    createMedicine
);

// 👀 admin + needy view all
router.get(
    "/all",
    ensureAuth,
    checkRole("needy", "admin"),
    getAllMedicines
);

// 👤 donor own list
router.get(
    "/my",
    ensureAuth,
    checkRole("donor"),
    getMyMedicines
);

// 🔍 needy search/filter
router.get(
    "/filter",
    ensureAuth,
    checkRole("needy"),
    filterMedicines
);

// ❌ delete (donor)
router.delete(
    "/delete/:id",
    ensureAuth,
    checkRole("donor"),
    deleteMedicine
);

module.exports = router;