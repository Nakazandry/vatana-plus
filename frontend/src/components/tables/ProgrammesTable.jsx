import { FiEdit2, FiTrash2, FiClipboard } from "react-icons/fi";

function ProgrammesTable({
  programmes,
  chargement,
  onModifier,
  onSupprimer,
}) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full min-w-[780px] border-separate border-spacing-0">
        <thead className="sticky top-0 z-[1] text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Programme</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Objectif</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Niveau</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Coach</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {chargement ? (
            <tr>
              <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-green-500" />
                </div>
                <p className="mt-4 font-medium">Chargement des programmes...</p>
              </td>
            </tr>
          ) : programmes.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-5 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FiClipboard />
                </div>
                <p className="mt-3 font-semibold text-slate-900">
                  Aucun programme trouvé
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Ajoutez un programme d'entraînement.
                </p>
              </td>
            </tr>
          ) : (
            programmes.map((p) => (
              <tr key={p.id} className="group transition hover:bg-green-50/40">
                <td className="border-b border-gray-100 px-5 py-4">
                  <p className="font-semibold text-slate-950">
                    {p.nom_programme}
                  </p>
                  <p className="text-sm text-gray-500">ID #{p.id}</p>
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-sm font-medium text-gray-600">
                  {p.objectif}
                </td>

                <td className="border-b border-gray-100 px-5 py-4">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    {p.niveau}
                  </span>
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-sm font-medium text-gray-600">
                  {p.nom} {p.prenom}
                </td>

                <td className="border-b border-gray-100 px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onModifier(p)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSupprimer(p)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProgrammesTable;
