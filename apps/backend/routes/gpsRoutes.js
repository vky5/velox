const express = require("express");
const { validateJWT } = require("../controllers/authController");
const { validateGpsId } = require("../controllers/gpsController");

const router = express.Router();

router.use(validateJWT);
router.get("/validate/:gpsId", validateGpsId);

module.exports = router;
