const express = require("express");
const router = express.Router();

const auth = require("../middleware/Auth");
const checkRole = require("../middleware/checkRole");
const upload = require("../middleware/upload"); // 👈 IMPORTANT

const {
    neddydatasave,
    showneddydata,
    editneddydata
} = require("../controller/needyController");

// 🧑‍⚕️ CREATE (2 images)
router.post(
  "/save",
  auth,
  checkRole("needy"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "diseaseProofImage", maxCount: 1 }
  ]),
  neddydatasave
);

// GET
router.get(
  "/get",
  auth,
  checkRole("needy"),
  showneddydata
);

// UPDATE (2 images)
router.put(
  "/edit",
  auth,
  checkRole("needy"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "diseaseProofImage", maxCount: 1 }
  ]),
  editneddydata
);

module.exports = router;