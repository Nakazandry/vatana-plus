const pool = require("../config/db");

const getProgrammes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT programmes.*, utilisateurs.nom, utilisateurs.prenom
       FROM programmes
       JOIN utilisateurs ON programmes.utilisateur_id = utilisateurs.id
       ORDER BY programmes.id`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterProgramme = async (req, res) => {
  try {
    const { nom_programme, objectif, niveau, utilisateur_id } = req.body;

    const result = await pool.query(
      `INSERT INTO programmes
       (nom_programme, objectif, niveau, utilisateur_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nom_programme, objectif, niveau, utilisateur_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const modifierProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_programme, objectif, niveau, utilisateur_id } = req.body;

    const result = await pool.query(
      `UPDATE programmes
       SET nom_programme = $1,
           objectif = $2,
           niveau = $3,
           utilisateur_id = $4
       WHERE id = $5
       RETURNING *`,
      [nom_programme, objectif, niveau, utilisateur_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerProgramme = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM programmes WHERE id = $1", [id]);

    res.json({ message: "Programme supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getProgrammes,
  ajouterProgramme,
  modifierProgramme,
  supprimerProgramme
};