const express = require("express");
const router = express.Router();

const ensureAuth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");

const {
    createMedicine,
    getAllMedicines,
    deleteMedicine,
    getMyMedicines,
    filterMedicines
} = require("../controller/medicineController");

// 🩸 donor create post
router.post("/create", ensureAuth, checkRole("donor"), createMedicine);

// 👀 admin +needy view all
router.get("/all", ensureAuth, checkRole("needy", "admin"), getAllMedicines);

// 👤 donor own list
router.get("/my", ensureAuth, checkRole("donor"), getMyMedicines);

// 🔍 needy search/filter
router.get("/filter", ensureAuth, checkRole("needy"), filterMedicines);

// ❌ delete ( donor)
router.delete(
    "/delete/:id",
    ensureAuth,
    checkRole("donor"),
    deleteMedicine
);

module.exports = router;