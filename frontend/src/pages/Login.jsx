import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";
import api from "../services/api";
import AlertMessage from "../components/feedback/AlertMessage";
import logo from "../assets/vatana-logo.svg";
import heroImage from "../assets/hero.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });

  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const seConnecter = async (e) => {
    e.preventDefault();

    try {
      setChargement(true);
      setErreur("");

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "utilisateur",
        JSON.stringify(response.data.utilisateur)
      );

      const utilisateur = response.data.utilisateur;
      const pageDemandee = location.state?.from;

      if (utilisateur.role === "admin") {
        navigate(
          pageDemandee && pageDemandee !== "/mon-espace"
            ? pageDemandee
            : "/dashboard"
        );
      } else {
        navigate("/mon-espace");
      }
    } catch (error) {
      console.log(error);
      setErreur(
        error.response?.data?.message || "Email ou mot de passe incorrect."
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-slate-950 text-white lg:grid-cols-[1.08fr_0.92fr]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.22),transparent_24rem),radial-gradient(circle_at_90%_80%,rgba(14,165,233,0.16),transparent_28rem)]" />

      <section className="relative hidden min-h-screen items-end overflow-hidden p-8 lg:flex">
        <img
          src={heroImage}
          alt="Sportif utilisant Vatana+"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/78 to-slate-950/20" />
        <div className="relative max-w-2xl pb-10">
          <span className="inline-flex rounded-full border border-green-300/25 bg-green-300/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-green-200">
            Coaching connecté
          </span>
          <h1 className="mt-6 text-5xl font-black leading-tight">
            Pilotez les programmes sportifs avec précision.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
            Vatana+ réunit suivi, exercices, affectations et préférences dans
            une interface rapide pour coachs et sportifs.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["Programmes", "Séances", "Suivi"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm font-bold text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-300">Temps réel</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
          <img
            src={logo}
            alt="Vatana+"
            className="mx-auto h-20 w-auto object-contain lg:mx-0"
          />

          <p className="mt-4 text-sm font-medium text-slate-300">
            Connectez-vous à votre espace sportif
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/40 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
            Connexion
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Entrez vos identifiants pour continuer.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700">
              <FiShield />
            </div>
          </div>

          <AlertMessage
            type="erreur"
            message={erreur}
            onFermer={() => setErreur("")}
          />

          <form onSubmit={seConnecter} className="space-y-4 mt-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </span>
              <span className="relative block">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Mot de passe
              </span>
              <span className="relative block">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={motDePasseVisible ? "text" : "password"}
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMotDePasseVisible((visible) => !visible)
                  }
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  aria-label={
                    motDePasseVisible
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {motDePasseVisible ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={chargement}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-70"
            >
              {chargement ? "Connexion..." : "Se connecter"}
              {!chargement && <FiArrowRight />}
            </button>
          </form>
        </div>
      </div>
      </main>
    </div>
  );
}

export default Login;
