const pool = require("../config/db");

const getMessagesUtilisateur = async (req, res) => {
  try {
    const { utilisateur_id } = req.params;

    const result = await pool.query(
      `SELECT messages.*,
              expediteur.nom AS expediteur_nom,
              expediteur.prenom AS expediteur_prenom,
              destinataire.nom AS destinataire_nom,
              destinataire.prenom AS destinataire_prenom
       FROM messages
       JOIN utilisateurs AS expediteur ON messages.expediteur_id = expediteur.id
       JOIN utilisateurs AS destinataire ON messages.destinataire_id = destinataire.id
       WHERE messages.expediteur_id = $1
          OR messages.destinataire_id = $1
       ORDER BY messages.date_message DESC`,
      [utilisateur_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterMessage = async (req, res) => {
  try {
    const { expediteur_id, destinataire_id, contenu } = req.body;

    const result = await pool.query(
      `INSERT INTO messages
       (expediteur_id, destinataire_id, contenu)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [expediteur_id, destinataire_id, contenu]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const marquerCommeLu = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE messages
       SET statut = 'lu'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM messages WHERE id = $1", [id]);

    res.json({ message: "Message supprimé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getMessagesUtilisateur,
  ajouterMessage,
  marquerCommeLu,
  supprimerMessage,
};