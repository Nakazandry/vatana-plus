import { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiGlobe,
  FiLock,
  FiMail,
  FiMoon,
  FiRefreshCw,
  FiShield,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { getTraduction } from "../i18n";

const preferencesParDefaut = {
  theme: "clair",
  langue: "fr",
  emailNotifications: true,
  pushNotifications: true,
  rappelSeances: true,
  rappelHeure: "07:30",
  profilVisible: false,
  doubleVerification: false,
  sessionAuto: "30",
};

function appliquerTheme(theme) {
  document.documentElement.classList.toggle("vatana-dark", theme === "sombre");
}

function lireObjetLocalStorage(cle, valeurParDefaut) {
  try {
    return JSON.parse(localStorage.getItem(cle)) || valeurParDefaut;
  } catch {
    return valeurParDefaut;
  }
}

function Toggle({ checked, onChange, label, description, icon }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-green-200">
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-lg text-green-700">
          {icon}
        </span>
        <span>
          <span className="block font-semibold text-slate-900">{label}</span>
          <span className="mt-1 block text-sm leading-5 text-gray-500">
            {description}
          </span>
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-green-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </label>
  );
}

function Section({ title, description, icon, children }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-800 ring-1 ring-black/5">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Parametres() {
  const utilisateur = useMemo(() => {
    return lireObjetLocalStorage("utilisateur", {});
  }, []);

  const [preferences, setPreferences] = useState(() => {
    const preferencesSauvegardees = lireObjetLocalStorage(
      "vatanaPreferences",
      {}
    );

    return {
      ...preferencesParDefaut,
      ...preferencesSauvegardees,
    };
  });
  const [sauvegarde, setSauvegarde] = useState(false);
  const t = getTraduction(preferences.langue);

  useEffect(() => {
    appliquerTheme(preferences.theme);
  }, [preferences.theme]);

  const modifierPreference = (cle, valeur) => {
    setPreferences((preferencesActuelles) => ({
      ...preferencesActuelles,
      [cle]: valeur,
    }));
    setSauvegarde(false);
  };

  const sauvegarderPreferences = () => {
    localStorage.setItem("vatanaPreferences", JSON.stringify(preferences));
    window.dispatchEvent(new Event("vatana-preferences-change"));
    appliquerTheme(preferences.theme);
    setSauvegarde(true);
  };

  const reinitialiserPreferences = () => {
    setPreferences(preferencesParDefaut);
    localStorage.setItem(
      "vatanaPreferences",
      JSON.stringify(preferencesParDefaut)
    );
    window.dispatchEvent(new Event("vatana-preferences-change"));
    appliquerTheme(preferencesParDefaut.theme);
    setSauvegarde(true);
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgba(34,197,94,0.2),transparent_18rem)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-300 via-cyan-300 to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-300">
              {t.settings.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold">{t.settings.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              {t.settings.description}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 font-bold text-slate-950">
              {(utilisateur.nom || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">
                {utilisateur.nom || "Admin"} {utilisateur.prenom || ""}
              </p>
              <p className="text-sm text-slate-300">
                {utilisateur.email || t.settings.adminAccount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Section
            title={t.settings.appearance}
            description={t.settings.appearanceDesc}
            icon={<FiMoon />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => modifierPreference("theme", "clair")}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                  preferences.theme === "clair"
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-slate-700 hover:border-green-200"
                }`}
              >
                <FiSun className="text-xl" />
                <span>
                  <span className="block font-semibold">
                    {t.settings.lightMode}
                  </span>
                  <span className="text-sm opacity-75">
                    {t.settings.lightModeDesc}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => modifierPreference("theme", "sombre")}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                  preferences.theme === "sombre"
                    ? "border-green-500 bg-slate-900 text-green-300"
                    : "border-gray-200 bg-white text-slate-700 hover:border-green-200"
                }`}
              >
                <FiMoon className="text-xl" />
                <span>
                  <span className="block font-semibold">
                    {t.settings.darkMode}
                  </span>
                  <span className="text-sm opacity-75">
                    {t.settings.darkModeDesc}
                  </span>
                </span>
              </button>
            </div>
          </Section>

          <Section
            title={t.settings.language}
            description={t.settings.languageDesc}
            icon={<FiGlobe />}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(t.languages).map(([code, langue]) => (
                <button
                  type="button"
                  key={code}
                  onClick={() => modifierPreference("langue", code)}
                  className={`rounded-lg border p-4 text-left transition ${
                    preferences.langue === code
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 bg-white text-slate-700 hover:border-green-200"
                  }`}
                >
                  <span className="block text-lg font-bold">
                    {langue.name}
                  </span>
                  <span className="mt-2 block text-sm leading-5 opacity-75">
                    {langue.preview}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section
            title={t.settings.notifications}
            description={t.settings.notificationsDesc}
            icon={<FiBell />}
          >
            <div className="space-y-3">
              <Toggle
                checked={preferences.emailNotifications}
                onChange={(valeur) =>
                  modifierPreference("emailNotifications", valeur)
                }
                label={t.settings.emailNotifications}
                description={t.settings.emailNotificationsDesc}
                icon={<FiMail />}
              />
              <Toggle
                checked={preferences.pushNotifications}
                onChange={(valeur) =>
                  modifierPreference("pushNotifications", valeur)
                }
                label={t.settings.pushNotifications}
                description={t.settings.pushNotificationsDesc}
                icon={<FiBell />}
              />
              <Toggle
                checked={preferences.rappelSeances}
                onChange={(valeur) =>
                  modifierPreference("rappelSeances", valeur)
                }
                label={t.settings.sessionReminder}
                description={t.settings.sessionReminderDesc}
                icon={<FiClock />}
              />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title={t.settings.account}
            description={t.settings.accountDesc}
            icon={<FiUser />}
          >
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  {t.settings.displayName}
                </span>
                <input
                  type="text"
                  value={`${utilisateur.nom || "Admin"} ${
                    utilisateur.prenom || ""
                  }`.trim()}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-slate-700 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  {t.settings.reminderTime}
                </span>
                <input
                  type="time"
                  value={preferences.rappelHeure}
                  onChange={(event) =>
                    modifierPreference("rappelHeure", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
            </div>
          </Section>

          <Section
            title={t.settings.privacy}
            description={t.settings.privacyDesc}
            icon={<FiShield />}
          >
            <div className="space-y-3">
              <Toggle
                checked={preferences.profilVisible}
                onChange={(valeur) => modifierPreference("profilVisible", valeur)}
                label={t.settings.visibleProfile}
                description={t.settings.visibleProfileDesc}
                icon={<FiUser />}
              />
              <Toggle
                checked={preferences.doubleVerification}
                onChange={(valeur) =>
                  modifierPreference("doubleVerification", valeur)
                }
                label={t.settings.twoFactor}
                description={t.settings.twoFactorDesc}
                icon={<FiLock />}
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                {t.settings.autoLogout}
              </span>
              <select
                value={preferences.sessionAuto}
                onChange={(event) =>
                  modifierPreference("sessionAuto", event.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="15">{t.settings.after15}</option>
                <option value="30">{t.settings.after30}</option>
                <option value="60">{t.settings.after60}</option>
                <option value="jamais">{t.settings.never}</option>
              </select>
            </label>
          </Section>

          <section className="rounded-lg border border-green-100 bg-green-50 p-5">
            <div className="flex items-start gap-3 text-green-900">
              <FiCheck className="mt-1 text-xl" />
              <div>
                <p className="font-bold">{t.settings.summaryTitle}</p>
                <p className="mt-1 text-sm leading-5">
                  {t.settings.summary
                    .replace("{theme}", t.themeNames[preferences.theme])
                    .replace(
                      "{language}",
                      t.languages[preferences.langue].name
                    )
                    .replace("{time}", preferences.rappelHeure)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {sauvegarde
            ? t.settings.saved
            : t.settings.unsaved}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reinitialiserPreferences}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <FiRefreshCw />
            {t.settings.reset}
          </button>
          <button
            type="button"
            onClick={sauvegarderPreferences}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-semibold text-white transition hover:bg-green-700"
          >
            <FiCheck />
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Parametres;
