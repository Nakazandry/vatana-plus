import { FiAlertTriangle, FiX } from "react-icons/fi";

function ConfirmModal({
  ouvert,
  titre = "Confirmer l'action",
  message,
  texteConfirmation = "Confirmer",
  texteAnnulation = "Annuler",
  chargement = false,
  onConfirmer,
  onFermer,
}) {
  if (!ouvert) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xl text-red-600">
              <FiAlertTriangle />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{titre}</h2>
              {message && (
                <p className="mt-2 text-sm text-gray-500">{message}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onFermer}
            disabled={chargement}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiX />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onFermer}
            disabled={chargement}
            className="rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {texteAnnulation}
          </button>
          <button
            type="button"
            onClick={onConfirmer}
            disabled={chargement}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {chargement ? "Suppression..." : texteConfirmation}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
