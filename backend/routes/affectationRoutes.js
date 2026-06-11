const express = require("express");

const router = express.Router();

const {
  getAffectations,
  ajouterAffectation,
  supprimerAffectation,
  modifierAffectation
} = require("../controllers/affectationController");

router.get("/", getAffectations);
router.post("/", ajouterAffectation);
router.delete("/:id", supprimerAffectation);
router.put("/:id", modifierAffectation);
module.exports = router;