import { FiX } from "react-icons/fi";

function AffectationModal({
  ouvert,
  mode = "ajout",
  formData,
  utilisateurs,
  programmes,
  enregistrement,
  onChange,
  onSubmit,
  onFermer,
}) {
  if (!ouvert) return null;

  const sportifs = utilisateurs.filter(
    (u) => (u.role || "").toLowerCase() === "client"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              {mode === "modification" ? "Modification affectation" : "Nouvelle affectation"}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {mode === "modification" ? "Modifier une affectation" : "Affecter un programme"}
            </h2>
          </div>

          <button
            onClick={onFermer}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Sportif
            </span>
            <select
              name="utilisateur_id"
              value={formData.utilisateur_id}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">
                {sportifs.length === 0
                  ? "Aucun sportif disponible"
                  : "Sélectionner un sportif"}
              </option>
              {sportifs.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nom} {u.prenom} - {u.email}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Programme
            </span>
            <select
              name="programme_id"
              value={formData.programme_id}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Sélectionner un programme</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom_programme}
                </option>
              ))}
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
                : "Affecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AffectationModal;
