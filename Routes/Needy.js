const express = require("express");
const router = express.Router();

const auth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");

const {
    neddydatasave,
    showneddydata,
    editneddydata
} = require("../controller/needyController");

// 🧑‍⚕️ only needy access
router.post("/save", auth, checkRole("needy"), neddydatasave);

router.get("/get", auth, checkRole("needy"), showneddydata);

router.put("/edit", auth, checkRole("needy"), editneddydata);

module.exports = router;