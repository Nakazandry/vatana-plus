import { FiX } from "react-icons/fi";
import Field from "../forms/Field";

function UserModal({
  ouvert,
  formData,
  mode = "ajout",
  enregistrement,
  onChange,
  onSubmit,
  onFermer,
}) {
  if (!ouvert) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
  {mode === "modification" ? "Modification profil" : "Nouveau profil"}
</p>

<h2 className="mt-1 text-2xl font-bold text-slate-950">
  {mode === "modification"
    ? "Modifier un utilisateur"
    : "Ajouter un utilisateur"}
</h2>
          </div>

          <button
            onClick={onFermer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
            type="button"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={onChange}
              required
            />
            <Field
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={onChange}
            />
          </div>

          <Field
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />

          <Field
            label={
              mode === "modification"
                ? "Nouveau mot de passe (optionnel)"
                : "Mot de passe"
            }
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={onChange}
            required={mode !== "modification"}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Rôle
            </span>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="client">Sportif</option>
              <option value="admin">Coach/Admin</option>
            </select>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onFermer}
              className="rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enregistrement}
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
                      {enregistrement
            ? "Enregistrement..."
            : mode === "modification"
            ? "Modifier"
            : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
