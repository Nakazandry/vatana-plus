import { FiX } from "react-icons/fi";
import Field from "../forms/Field";

function ExerciceModal({
  ouvert,
  mode = "ajout",
  formData,
  programmes,
  enregistrement,
  onChange,
  onSubmit,
  onFermer,
}) {
  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              {mode === "modification" ? "Modification exercice" : "Nouvel exercice"}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {mode === "modification"
                ? "Modifier un exercice"
                : "Ajouter un exercice"}
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
          <Field
            label="Nom de l'exercice"
            name="nom_exercice"
            value={formData.nom_exercice}
            onChange={onChange}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Séries"
              type="number"
              name="series"
              value={formData.series}
              onChange={onChange}
              required
            />

            <Field
              label="Répétitions"
              type="number"
              name="repetitions"
              value={formData.repetitions}
              onChange={onChange}
              required
            />

            <Field
              label="Durée min"
              type="number"
              name="duree_minutes"
              value={formData.duree_minutes}
              onChange={onChange}
              required
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Jour
            </span>

            <select
              name="jour"
              value={formData.jour}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
              <option value="Dimanche">Dimanche</option>
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
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            >
              <option value="">Sélectionner un programme</option>

              {programmes.map((programme) => (
                <option key={programme.id} value={programme.id}>
                  {programme.nom_programme}
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
                : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExerciceModal;