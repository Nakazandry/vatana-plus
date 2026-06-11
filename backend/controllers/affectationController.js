const pool = require("../config/db");

const getAffectations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT affectations.*,
              utilisateurs.nom,
              utilisateurs.prenom,
              utilisateurs.email,
              programmes.nom_programme,
              programmes.objectif,
              programmes.niveau
       FROM affectations
       JOIN utilisateurs ON affectations.utilisateur_id = utilisateurs.id
       JOIN programmes ON affectations.programme_id = programmes.id
       ORDER BY affectations.id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterAffectation = async (req, res) => {
  try {
    const { utilisateur_id, programme_id } = req.body;

    const result = await pool.query(
      `INSERT INTO affectations
       (utilisateur_id, programme_id)
       VALUES ($1, $2)
       RETURNING *`,
      [utilisateur_id, programme_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerAffectation = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM affectations WHERE id = $1", [id]);

    res.json({ message: "Affectation supprimée avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const modifierAffectation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      utilisateur_id,
      programme_id
    } = req.body;

    const result = await pool.query(
      `UPDATE affectations
       SET utilisateur_id = $1,
           programme_id = $2
       WHERE id = $3
       RETURNING *`,
      [utilisateur_id, programme_id, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
};


module.exports = {
  getAffectations,
  ajouterAffectation,
  supprimerAffectation,
  modifierAffectation,
};