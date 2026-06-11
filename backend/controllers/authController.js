const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

function emailNormalise(email) {
  return String(email || "").trim().toLowerCase();
}

function estHashBcrypt(motDePasseStocke) {
  return /^\$2[aby]\$\d{2}\$/.test(String(motDePasseStocke || ""));
}

const login = async (req, res) => {
  try {
    const { mot_de_passe } = req.body;
    const email = emailNormalise(req.body.email);

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires",
      });
    }

    const result = await pool.query(
      "SELECT id, nom, prenom, email, role, mot_de_passe FROM utilisateurs WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const utilisateur = result.rows[0];
    const motDePasseStocke = utilisateur.mot_de_passe || "";
    let motDePasseValide = false;

    if (estHashBcrypt(motDePasseStocke)) {
      motDePasseValide = await bcrypt.compare(
        mot_de_passe,
        motDePasseStocke
      );
    } else {
      motDePasseValide = mot_de_passe === motDePasseStocke;

      if (motDePasseValide) {
        const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);
        await pool.query(
          "UPDATE utilisateurs SET mot_de_passe = $1 WHERE id = $2",
          [motDePasseHash, utilisateur.id]
        );
      }
    }

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete utilisateur.mot_de_passe;

    res.json({
      message: "Connexion réussie",
      utilisateur,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  login,
};
