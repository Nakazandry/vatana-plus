const pool = require("../config/db");

const getSeancesUtilisateur = async (req, res) => {
  try {
    const { utilisateur_id } = req.params;

    const result = await pool.query(
      `SELECT seances.*,
              exercices.nom_exercice,
              exercices.jour
       FROM seances
       JOIN exercices ON seances.exercice_id = exercices.id
       WHERE seances.utilisateur_id = $1
       ORDER BY seances.date_realisation DESC`,
      [utilisateur_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterSeance = async (req, res) => {
  try {
    const { utilisateur_id, exercice_id } = req.body;

    const result = await pool.query(
      `INSERT INTO seances
       (utilisateur_id, exercice_id)
       VALUES ($1, $2)
       RETURNING *`,
      [utilisateur_id, exercice_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerSeance = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM seances WHERE id = $1", [id]);

    res.json({ message: "Séance supprimée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getSeancesUtilisateur,
  ajouterSeance,
  supprimerSeance,
};