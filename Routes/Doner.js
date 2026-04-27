const express = require("express");
const router = express.Router();

const auth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");
const upload = require("../middleware/upload"); // 👈 add this

const {
    donnerdatasave,
    showdonnerdata,
    editdonnerdata
} = require("../controller/donorController");

// ✅ CREATE (with image upload)
router.post(
  "/save",
  auth,
  checkRole("donor"),
  upload.single("image"),   // 👈 IMPORTANT
  donnerdatasave
);

// ✅ GET
router.get(
  "/get",
  auth,
  checkRole("donor"),
  showdonnerdata
);

// ✅ UPDATE (with image upload)
router.put(
  "/edit",
  auth,
  checkRole("donor"),
  upload.single("image"),   // 👈 IMPORTANT
  editdonnerdata
);

module.exports = router;