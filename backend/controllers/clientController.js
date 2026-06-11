const pool = require("../config/db");

const getMonProgramme = async (req, res) => {
  try {
    const { utilisateur_id } = req.params;

    const affectationResult = await pool.query(
      `SELECT affectations.*,
              programmes.nom_programme,
              programmes.objectif,
              programmes.niveau
       FROM affectations
       JOIN programmes ON affectations.programme_id = programmes.id
       WHERE affectations.utilisateur_id = $1
       ORDER BY affectations.id DESC
       LIMIT 1`,
      [utilisateur_id]
    );

    if (affectationResult.rows.length === 0) {
      return res.json({
        programme: null,
        exercices: [],
      });
    }

    const programme = affectationResult.rows[0];

    const exercicesResult = await pool.query(
      `SELECT *
       FROM exercices
       WHERE programme_id = $1
       ORDER BY 
         CASE jour
           WHEN 'Lundi' THEN 1
           WHEN 'Mardi' THEN 2
           WHEN 'Mercredi' THEN 3
           WHEN 'Jeudi' THEN 4
           WHEN 'Vendredi' THEN 5
           WHEN 'Samedi' THEN 6
           WHEN 'Dimanche' THEN 7
           ELSE 8
         END`,
      [programme.programme_id]
    );

    res.json({
      programme,
      exercices: exercicesResult.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  getMonProgramme,
};