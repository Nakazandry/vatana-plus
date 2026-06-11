const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function resetPassword() {
  const [, , emailArg, motDePasseArg] = process.argv;
  const email = String(emailArg || "").trim().toLowerCase();
  const motDePasse = String(motDePasseArg || "");

  if (!email || !motDePasse) {
    console.log("Usage: node scripts/resetPassword.js email nouveau_mot_de_passe");
    process.exit(1);
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);
  const result = await pool.query(
    `UPDATE utilisateurs
     SET mot_de_passe = $1
     WHERE email = $2
     RETURNING id, email, role`,
    [motDePasseHash, email]
  );

  if (!result.rows.length) {
    console.log(`Aucun utilisateur trouvé pour ${email}`);
    process.exit(1);
  }

  console.log(
    `Mot de passe réinitialisé pour ${result.rows[0].email} (${result.rows[0].role})`
  );
}

resetPassword()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => pool.end());
