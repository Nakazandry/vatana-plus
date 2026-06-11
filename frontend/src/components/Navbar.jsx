import { useEffect, useState } from "react";
import { FiBell, FiCommand, FiSearch, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getTraduction } from "../i18n";
import api from "../services/api";

function Navbar({ langue = "fr" }) {
  const t = getTraduction(langue);
  const navigate = useNavigate();
  const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) || {};
  const utilisateurId = utilisateur.id;
  const nomUtilisateur = utilisateur.nom || "Aaron";
  const prenomUtilisateur = utilisateur.prenom || "";
  const initiale = (nomUtilisateur || "A").charAt(0).toUpperCase();
  const [messagesNonLus, setMessagesNonLus] = useState(0);

  useEffect(() => {
    if (!utilisateurId) {
      return undefined;
    }

    let composantMonte = true;

    const chargerNotifications = async () => {
      try {
        const response = await api.get(`/messages/${utilisateurId}`);
        const totalNonLus = response.data.filter(
          (message) =>
            Number(message.destinataire_id) === Number(utilisateurId) &&
            message.statut !== "lu"
        ).length;

        if (composantMonte) {
          setMessagesNonLus(totalNonLus);
        }
      } catch (error) {
        console.log("Erreur chargement notifications messages", error);
      }
    };

    const premierChargement = setTimeout(() => {
      chargerNotifications();
    }, 0);
    const interval = setInterval(chargerNotifications, 30000);

    window.addEventListener("vatana-messages-change", chargerNotifications);

    return () => {
      composantMonte = false;
      clearTimeout(premierChargement);
      clearInterval(interval);
      window.removeEventListener(
        "vatana-messages-change",
        chargerNotifications
      );
    };
  }, [utilisateurId]);

  return (
    <header className="sticky top-3 z-20 mb-5 rounded-lg border border-white/70 bg-white/85 p-3 shadow-lg shadow-slate-200/60 backdrop-blur-xl sm:mb-6 sm:p-4 lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xl">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder={t.nav.recherche}
            className="h-11 w-full rounded-lg border border-transparent bg-slate-100/80 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-green-200 focus:bg-white focus:ring-4 focus:ring-green-100 sm:h-12 sm:pr-20"
          />

          <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-400 sm:flex">
            <FiCommand />
            K
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/parametres")}
            className="hidden h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-700 transition hover:-translate-y-0.5 hover:bg-green-50 hover:text-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:flex sm:h-12 sm:w-12"
            aria-label={t.nav.parametres}
          >
            <FiSettings />
          </button>

          <button
            type="button"
            onClick={() => navigate("/messages")}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-700 transition hover:-translate-y-0.5 hover:bg-green-50 hover:text-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:h-12 sm:w-12"
            aria-label={`${messagesNonLus} message${
              messagesNonLus > 1 ? "s" : ""
            } non lu${messagesNonLus > 1 ? "s" : ""}`}
            title={`${messagesNonLus} message${
              messagesNonLus > 1 ? "s" : ""
            } non lu${messagesNonLus > 1 ? "s" : ""}`}
          >
            <FiBell />

            {messagesNonLus > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-bold text-white ring-4 ring-white">
                {messagesNonLus > 9 ? "9+" : messagesNonLus}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-2 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:px-3"
          >
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-slate-900">
                {nomUtilisateur} {prenomUtilisateur}
              </p>
              <p className="text-sm text-gray-500">{t.nav.coachSportif}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 font-bold text-white shadow-lg shadow-green-200 sm:h-11 sm:w-11">
              {initiale}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
