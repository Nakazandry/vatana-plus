import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

const styles = {
  erreur: {
    container: "border-red-200 bg-red-50 text-red-700",
    icon: <FiAlertCircle className="shrink-0 text-xl" />,
  },
  succes: {
    container: "border-green-200 bg-green-50 text-green-700",
    icon: <FiCheckCircle className="shrink-0 text-xl" />,
  },
};

function AlertMessage({ type = "succes", message, onFermer, flottant = false }) {
  if (!message) return null;

  const config = styles[type] || styles.succes;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm ${config.container} ${
        flottant ? "fixed right-6 top-6 z-[70] w-[min(420px,calc(100vw-32px))]" : ""
      }`}
    >
      {config.icon}

      <span className="flex-1">{message}</span>

      {onFermer && (
        <button
          type="button"
          onClick={onFermer}
          className="rounded-lg p-1 hover:bg-white/60"
        >
          <FiX />
        </button>
      )}
    </div>
  );
}

export default AlertMessage;
