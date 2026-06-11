const pool = require("../config/db");
const bcrypt = require("bcryptjs");

function estErreurEmailDuplique(error) {
  return (
    error.code === "23505" &&
    error.constraint === "utilisateurs_email_key"
  );
}

function emailNormalise(email) {
  return String(email || "").trim().toLowerCase();
}

const getUtilisateurs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role
       FROM utilisateurs
       ORDER BY id`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const ajouterUtilisateur = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      mot_de_passe,
      role = "client",
    } = req.body;
    const email = emailNormalise(req.body.email);

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({
        message: "Le nom, l'email et le mot de passe sont obligatoires.",
      });
    }

    const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO utilisateurs
       (nom, prenom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom || "", email, motDePasseHash, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (estErreurEmailDuplique(error)) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const modifierUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      prenom,
      mot_de_passe,
      role = "client",
    } = req.body;
    const email = emailNormalise(req.body.email);

    if (!nom || !email) {
      return res.status(400).json({
        message: "Le nom et l'email sont obligatoires.",
      });
    }

    const utilisateurActuel = await pool.query(
      "SELECT mot_de_passe FROM utilisateurs WHERE id = $1",
      [id]
    );

    if (!utilisateurActuel.rows.length) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const motDePasseFinal = mot_de_passe
      ? await bcrypt.hash(mot_de_passe, 10)
      : utilisateurActuel.rows[0].mot_de_passe;

    const result = await pool.query(
      `UPDATE utilisateurs
       SET nom = $1, prenom = $2, email = $3, mot_de_passe = $4, role = $5
       WHERE id = $6
       RETURNING id, nom, prenom, email, role`,
      [nom, prenom || "", email, motDePasseFinal, role, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (estErreurEmailDuplique(error)) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const supprimerUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM utilisateurs WHERE id = $1 RETURNING id",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getUtilisateurs,
  ajouterUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
};
