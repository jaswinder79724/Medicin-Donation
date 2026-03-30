const express = require("express");
const router = express.Router();

const ensureAuth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");

const {
    getAllUsers,
    blockUnblockUser
} = require("../controller/adminController");

// 🔐 only admin access
router.get("/users", ensureAuth, checkRole("admin"), getAllUsers);

router.put("/block/:userId", ensureAuth, checkRole("admin"), blockUnblockUser);

module.exports = router;