const express = require("express");

const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");

const verifierToken = require("../middlewares/authMiddleware");

router.get("/", verifierToken, getDashboard);

module.exports = router;