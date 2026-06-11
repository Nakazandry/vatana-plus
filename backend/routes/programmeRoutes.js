const express = require("express");

const router = express.Router();

const {
  getProgrammes,
  ajouterProgramme,
  modifierProgramme,
  supprimerProgramme
} = require("../controllers/programmeController");

router.get("/", getProgrammes);
router.post("/", ajouterProgramme);
router.put("/:id", modifierProgramme);
router.delete("/:id", supprimerProgramme);

module.exports = router;