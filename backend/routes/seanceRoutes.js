const express = require("express");

const router = express.Router();

const {
  getSeancesUtilisateur,
  ajouterSeance,
  supprimerSeance,
} = require("../controllers/seanceController");

router.get("/utilisateur/:utilisateur_id", getSeancesUtilisateur);
router.post("/", ajouterSeance);
router.delete("/:id", supprimerSeance);

module.exports = router;