const express = require("express");

const router = express.Router();

const {
  getExercices,
  ajouterExercice,
  modifierExercice,
  supprimerExercice,
} = require("../controllers/exerciceController");

router.get("/", getExercices);
router.post("/", ajouterExercice);
router.put("/:id", modifierExercice);
router.delete("/:id", supprimerExercice);

module.exports = router;