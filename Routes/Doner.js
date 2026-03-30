const express = require("express");
const router = express.Router();

const auth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");

const {
    donnerdatasave,
    showdonnerdata,
    editdonnerdata
} = require("../controller/donorController");

// 👇 donor only access
router.post("/save", auth, checkRole("donor"), donnerdatasave);

router.get("/get", auth, checkRole("donor"), showdonnerdata);

router.put("/edit", auth, checkRole("donor"), editdonnerdata);

module.exports = router;