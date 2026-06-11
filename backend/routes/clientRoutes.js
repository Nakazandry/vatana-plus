const express = require("express");

const router = express.Router();

const { getMonProgramme } = require("../controllers/clientController");

router.get("/mon-programme/:utilisateur_id", getMonProgramme);

module.exports = router;