const express = require("express");

const router = express.Router();

const {
  getMessagesUtilisateur,
  ajouterMessage,
  marquerCommeLu,
  supprimerMessage,
} = require("../controllers/messageController");

router.get("/:utilisateur_id", getMessagesUtilisateur);
router.post("/", ajouterMessage);
router.put("/:id/lu", marquerCommeLu);
router.delete("/:id", supprimerMessage);

module.exports = router;