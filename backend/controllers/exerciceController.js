const pool = require("../config/db");

const getExercices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT exercices.*, programmes.nom_programme
       FROM exercices
       JOIN programmes ON exercices.programme_id = programmes.id
       ORDER BY exercices.id`
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterExercice = async (req, res) => {
  try {
    const {
      nom_exercice,
      series,
      repetitions,
      duree_minutes,
      jour,
      programme_id,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO exercices
       (nom_exercice, series, repetitions, duree_minutes, jour, programme_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nom_exercice, series, repetitions, duree_minutes, jour, programme_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const modifierExercice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nom_exercice,
      series,
      repetitions,
      duree_minutes,
      jour,
      programme_id,
    } = req.body;

    const result = await pool.query(
      `UPDATE exercices
       SET nom_exercice = $1,
           series = $2,
           repetitions = $3,
           duree_minutes = $4,
           jour = $5,
           programme_id = $6
       WHERE id = $7
       RETURNING *`,
      [nom_exercice, series, repetitions, duree_minutes, jour, programme_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerExercice = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM exercices WHERE id = $1", [id]);

    res.json({ message: "Exercice supprimé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getExercices,
  ajouterExercice,
  modifierExercice,
  supprimerExercice,
};