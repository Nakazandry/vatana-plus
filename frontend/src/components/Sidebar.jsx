import { NavLink } from "react-router-dom";
import {
  FiChevronRight,
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiMessageSquare,
} from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";
import logo from "../assets/vatana-logo.svg";
import { useNavigate } from "react-router-dom";
import { getTraduction } from "../i18n";

function Sidebar({ langue = "fr" }) {
  const t = getTraduction(langue);
  const utilisateur = JSON.parse(localStorage.getItem("utilisateur")) || {};
  const nomUtilisateur = utilisateur.nom || "Aaron";
  const roleUtilisateur =
    utilisateur.role === "admin" ? t.nav.coach : t.nav.coachSportif;
  const initiale = (nomUtilisateur || "A").charAt(0).toUpperCase();
  const menuItems = [
    { path: "/dashboard", label: t.nav.dashboard, icon: <FiHome /> },
    { path: "/utilisateurs", label: t.nav.utilisateurs, icon: <FiUsers /> },
    { path: "/programmes", label: t.nav.programmes, icon: <FiCalendar /> },
    { path: "/exercices", label: t.nav.exercices, icon: <MdFitnessCenter /> },
    { path: "/affectations", label: t.nav.affectations, icon: <FiUserCheck /> },
    { path: "/messages", label: t.nav.messages, icon: <FiMessageSquare /> },
    { path: "/parametres", label: t.nav.parametres, icon: <FiSettings /> },
  ];
  const navigate = useNavigate();

  const deconnexion = () => {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 z-30 flex shrink-0 flex-col overflow-hidden border-b border-white/10 bg-slate-950/95 p-3 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-green-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 hidden h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl lg:block" />

      <div className="relative mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-2.5 shadow-inner lg:mb-8 lg:p-3">
        <img
          src={logo}
          alt="Vatana+"
          className="h-10 w-auto object-contain drop-shadow lg:h-12"
        />
        <button
          type="button"
          onClick={deconnexion}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition hover:border-red-300/40 hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 lg:hidden"
          aria-label={t.nav.deconnexion}
        >
          <FiLogOut className="text-base" />
          <span>{t.nav.deconnexion}</span>
        </button>
      </div>

      <nav className="relative -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-semibold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-green-400 lg:w-full lg:px-4 lg:py-3 ${
                isActive
                  ? "bg-white text-slate-950 shadow-lg shadow-green-950/30 lg:translate-x-1"
                  : "text-gray-300 hover:bg-white/10 hover:text-white lg:hover:translate-x-1"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-r-full transition lg:block ${
                    isActive ? "bg-green-500" : "bg-transparent"
                  }`}
                />
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl transition ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-white/5 text-gray-300 group-hover:bg-green-500/15 group-hover:text-green-300"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="min-w-0 truncate lg:flex-1">{item.label}</span>
                <FiChevronRight
                  className={`hidden text-base transition lg:block ${
                    isActive
                      ? "translate-x-0 text-green-600"
                      : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-5 hidden rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-inner lg:block">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-400 font-bold text-slate-950 shadow-lg shadow-green-950/40">
            {initiale}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{nomUtilisateur}</p>
            <p className="text-sm text-gray-400">{roleUtilisateur}</p>
          </div>
        </div>

        <button
          onClick={deconnexion}
          className="group flex w-full items-center justify-center gap-3 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:border-red-300/40 hover:bg-red-500/20 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <FiLogOut className="transition group-hover:-translate-x-0.5" />
          {t.nav.deconnexion}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
