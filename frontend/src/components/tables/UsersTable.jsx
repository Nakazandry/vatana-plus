import {
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import RoleBadge from "../badges/RoleBadge";

function UsersTable({ utilisateurs, chargement, onSupprimer, onModifier }) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full min-w-[780px] border-separate border-spacing-0">
        <thead className="sticky top-0 z-[1] text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Utilisateur</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Email</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Role</th>
            <th className="border-b border-gray-200 bg-gray-50 px-5 py-4">Statut</th>
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
                <p className="mt-4 font-medium">Chargement des utilisateurs...</p>
              </td>
            </tr>
          ) : utilisateurs.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-5 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FiUsers />
                </div>
                <p className="mt-3 font-semibold text-slate-900">
                  Aucun utilisateur trouvé
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Essayez une autre recherche ou ajoutez un nouveau profil.
                </p>
              </td>
            </tr>
          ) : (
            utilisateurs.map((utilisateur) => (
              <tr
                key={utilisateur.id}
                className="group transition hover:bg-green-50/40"
              >
                <td className="border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700 ring-4 ring-green-50 transition group-hover:scale-105">
                      {getInitiales(utilisateur)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950">
                        {utilisateur.nom} {utilisateur.prenom}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID #{utilisateur.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-gray-100 px-5 py-4 text-sm font-medium text-gray-600">
                  {utilisateur.email}
                </td>
                <td className="border-b border-gray-100 px-5 py-4">
                  <RoleBadge role={utilisateur.role} />
                </td>
                <td className="border-b border-gray-100 px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    <FiCheckCircle />
                    Actif
                  </span>
                </td>
                <td className="border-b border-gray-100 px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onModifier(utilisateur)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSupprimer(utilisateur)}
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

function getInitiales(utilisateur) {
  const nom = utilisateur.nom?.trim()?.[0] || "";
  const prenom = utilisateur.prenom?.trim()?.[0] || "";
  const initiales = `${nom}${prenom}`.toUpperCase();

  return initiales || "U";
}

export default UsersTable;
