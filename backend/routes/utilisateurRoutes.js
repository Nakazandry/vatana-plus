const express = require("express");

const router = express.Router();

const {
  getUtilisateurs,
  ajouterUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur
} = require("../controllers/utilisateurController");

router.get("/", getUtilisateurs);
router.post("/", ajouterUtilisateur);
router.put("/:id", modifierUtilisateur);
router.delete("/:id", supprimerUtilisateur);

module.exports = router;