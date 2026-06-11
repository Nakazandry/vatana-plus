const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const utilisateurs = await pool.query("SELECT COUNT(*) AS total FROM utilisateurs");

    const sportifs = await pool.query(
      "SELECT COUNT(*) AS total FROM utilisateurs WHERE role = 'client'"
    );

    const programmes = await pool.query(
      "SELECT COUNT(*) AS total FROM programmes"
    );

    const exercices = await pool.query(
      "SELECT COUNT(*) AS total FROM exercices"
    );

    const affectations = await pool.query(
      "SELECT COUNT(*) AS total FROM affectations"
    );

    const sportifsAvecProgramme = await pool.query(
      `SELECT COUNT(DISTINCT utilisateurs.id) AS total
       FROM utilisateurs
       JOIN affectations ON affectations.utilisateur_id = utilisateurs.id
       WHERE utilisateurs.role = 'client'`
    );

    const nouveauxSportifs = await pool.query(
      `SELECT id, nom, prenom, email
       FROM utilisateurs
       WHERE role = 'client'
       ORDER BY id DESC
       LIMIT 5`
    );

    const totalSportifs = Number(sportifs.rows[0].total);
    const totalSportifsAvecProgramme = Number(
      sportifsAvecProgramme.rows[0].total
    );

    res.json({
      totalUtilisateurs: Number(utilisateurs.rows[0].total),
      totalSportifs,
      totalProgrammes: Number(programmes.rows[0].total),
      totalExercices: Number(exercices.rows[0].total),
      totalAffectations: Number(affectations.rows[0].total),
      sportifsAvecProgramme: totalSportifsAvecProgramme,
      sportifsSansProgramme: Math.max(
        totalSportifs - totalSportifsAvecProgramme,
        0
      ),
      nouveauxSportifs: nouveauxSportifs.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  getDashboard,
};
