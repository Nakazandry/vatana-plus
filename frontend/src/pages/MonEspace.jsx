import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiList,
  FiLogOut,
  FiGlobe,
  FiMessageSquare,
  FiMoon,
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiSettings,
  FiSun,
  FiTarget,
} from "react-icons/fi";
import api from "../services/api";
import AlertMessage from "../components/feedback/AlertMessage";
import Messagerie from "./Messagerie";

const ordreJours = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const preferencesParDefaut = {
  theme: "clair",
  langue: "fr",
  notificationsSeance: false,
  modeConcentration: false,
};

const langues = {
  fr: {
    nom: "Français",
    description: "Interface en français",
  },
  en: {
    nom: "English",
    description: "Interface in English",
  },
  mg: {
    nom: "Malagasy",
    description: "Interface amin'ny teny Malagasy",
  },
};

const textes = {
  fr: {
    loading: "Chargement...",
    preferenceSaved: "Préférence enregistrée.",
    loadError: "Impossible de charger votre espace sportif.",
    finishError: "Impossible de terminer cet exercice pour le moment.",
    completedMessage: "{name} marqué comme terminé.",
    heroEyebrow: "Espace sportif",
    hello: "Bonjour",
    heroDescription:
      "Suivez votre programme, terminez vos exercices du jour et gardez votre progression à jour.",
    logout: "Déconnexion",
    tabs: {
      dashboard: "Dashboard",
      seance: "Séance",
      calendrier: "Calendrier",
      messages: "Messages",
      parametres: "Paramètres",
    },
    stats: {
      todayProgress: "Progression du jour",
      exercises: "Exercices",
      completedToday: "{count} terminés aujourd'hui",
      totalDuration: "Durée totale",
      plannedMinutes: "minutes prévues",
      completedSessions: "Séances réalisées",
      fullHistory: "historique complet",
    },
    program: {
      current: "Programme actuel",
      objective: "Objectif",
      level: "Niveau",
      nextExercise: "Prochain exercice",
      allDone: "Tout est terminé",
      startSession: "Démarrer la séance",
    },
    calendar: {
      title: "Calendrier de la semaine",
      description: "Vue claire de vos séances prévues et terminées.",
      exercise: "exercice",
      exercises: "exercices",
      completed: "terminés",
    },
    settings: {
      athleteProfile: "Profil sportif",
      preferences: "Préférences",
      preferencesDesc: "Paramètres simples pour votre expérience mobile.",
      appearance: "Apparence",
      appearanceDesc: "Choisissez le mode clair ou sombre.",
      lightMode: "Mode clair",
      lightModeDesc: "Interface lumineuse",
      darkMode: "Mode sombre",
      darkModeDesc: "Confort le soir",
      language: "Langue",
      languageDesc: "Sélectionnez la langue de l'application.",
      sessionNotifications: "Notifications séance",
      sessionNotificationsDesc: "Recevoir un rappel avant l'entraînement.",
      focusMode: "Mode concentration",
      focusModeDesc: "Interface plus calme pendant le timer.",
    },
    exercise: {
      today: "Aujourd'hui",
      completed: "terminés",
      sets: "séries",
      reps: "répétitions",
      done: "Terminé",
      validating: "Validation...",
      finish: "Finir",
      resume: "Reprendre",
      pause: "Pause",
      reset: "Reset",
      start: "Démarrer",
    },
    empty: {
      title: "Aucun programme affecté.",
      description: "Votre coach doit encore vous attribuer un programme.",
    },
  },
  en: {
    loading: "Loading...",
    preferenceSaved: "Preference saved.",
    loadError: "Unable to load your athlete area.",
    finishError: "Unable to complete this exercise right now.",
    completedMessage: "{name} marked as completed.",
    heroEyebrow: "Athlete area",
    hello: "Hello",
    heroDescription:
      "Follow your program, complete today's exercises, and keep your progress up to date.",
    logout: "Sign out",
    tabs: {
      dashboard: "Dashboard",
      seance: "Workout",
      calendrier: "Calendar",
      messages: "Messages",
      parametres: "Settings",
    },
    stats: {
      todayProgress: "Today's progress",
      exercises: "Exercises",
      completedToday: "{count} completed today",
      totalDuration: "Total duration",
      plannedMinutes: "planned minutes",
      completedSessions: "Completed sessions",
      fullHistory: "full history",
    },
    program: {
      current: "Current program",
      objective: "Goal",
      level: "Level",
      nextExercise: "Next exercise",
      allDone: "Everything is done",
      startSession: "Start workout",
    },
    calendar: {
      title: "Weekly calendar",
      description: "A clear view of your planned and completed sessions.",
      exercise: "exercise",
      exercises: "exercises",
      completed: "completed",
    },
    settings: {
      athleteProfile: "Athlete profile",
      preferences: "Preferences",
      preferencesDesc: "Simple settings for your mobile experience.",
      appearance: "Appearance",
      appearanceDesc: "Choose light or dark mode.",
      lightMode: "Light mode",
      lightModeDesc: "Bright interface",
      darkMode: "Dark mode",
      darkModeDesc: "Evening comfort",
      language: "Language",
      languageDesc: "Select the app language.",
      sessionNotifications: "Workout notifications",
      sessionNotificationsDesc: "Receive a reminder before training.",
      focusMode: "Focus mode",
      focusModeDesc: "A calmer interface while the timer runs.",
    },
    exercise: {
      today: "Today",
      completed: "completed",
      sets: "sets",
      reps: "reps",
      done: "Done",
      validating: "Saving...",
      finish: "Finish",
      resume: "Resume",
      pause: "Pause",
      reset: "Reset",
      start: "Start",
    },
    empty: {
      title: "No program assigned.",
      description: "Your coach still needs to assign you a program.",
    },
  },
  mg: {
    loading: "Mampiditra...",
    preferenceSaved: "Voatahiry ny safidy.",
    loadError: "Tsy afaka mampiditra ny espace sportif-nao.",
    finishError: "Tsy afaka mamita ity fanazaran-tena ity izao.",
    completedMessage: "{name} voamarika ho vita.",
    heroEyebrow: "Espace sportif",
    hello: "Manao ahoana",
    heroDescription:
      "Araho ny programanao, vitaho ny fanazaran-tena androany, ary havaozy ny fandrosoanao.",
    logout: "Hivoaka",
    tabs: {
      dashboard: "Dashboard",
      seance: "Seance",
      calendrier: "Kalandrie",
      messages: "Hafatra",
      parametres: "Kirakira",
    },
    stats: {
      todayProgress: "Fandrosoana androany",
      exercises: "Fanazaran-tena",
      completedToday: "{count} vita androany",
      totalDuration: "Faharetana manontolo",
      plannedMinutes: "minitra voaomana",
      completedSessions: "Seance vita",
      fullHistory: "tantara feno",
    },
    program: {
      current: "Programa ankehitriny",
      objective: "Tanjona",
      level: "Ambaratonga",
      nextExercise: "Fanazaran-tena manaraka",
      allDone: "Vita daholo",
      startSession: "Atombohy ny seance",
    },
    calendar: {
      title: "Kalandrie isan-kerinandro",
      description: "Fijery mazava ny seance voaomana sy vita.",
      exercise: "fanazaran-tena",
      exercises: "fanazaran-tena",
      completed: "vita",
    },
    settings: {
      athleteProfile: "Profil sportif",
      preferences: "Safidy",
      preferencesDesc: "Kirakira tsotra ho an'ny traikefa mobile.",
      appearance: "Endrika",
      appearanceDesc: "Safidio ny mode mazava na maizina.",
      lightMode: "Mode mazava",
      lightModeDesc: "Interface mazava",
      darkMode: "Mode maizina",
      darkModeDesc: "Mahazo aina amin'ny alina",
      language: "Fiteny",
      languageDesc: "Safidio ny fitenin'ny application.",
      sessionNotifications: "Fampandrenesana seance",
      sessionNotificationsDesc: "Mahazoa fampahatsiahivana alohan'ny fanazaran-tena.",
      focusMode: "Mode concentration",
      focusModeDesc: "Interface milamina kokoa mandritra ny timer.",
    },
    exercise: {
      today: "Androany",
      completed: "vita",
      sets: "serie",
      reps: "repetition",
      done: "Vita",
      validating: "Manamarina...",
      finish: "Vitao",
      resume: "Tohizo",
      pause: "Pause",
      reset: "Reset",
      start: "Atombohy",
    },
    empty: {
      title: "Tsy mbola misy programa nomena.",
      description: "Mbola mila manome programa anao ny coach.",
    },
  },
};

const nomsJours = {
  en: {
    Lundi: "Monday",
    Mardi: "Tuesday",
    Mercredi: "Wednesday",
    Jeudi: "Thursday",
    Vendredi: "Friday",
    Samedi: "Saturday",
    Dimanche: "Sunday",
  },
  mg: {
    Lundi: "Alatsinainy",
    Mardi: "Talata",
    Mercredi: "Alarobia",
    Jeudi: "Alakamisy",
    Vendredi: "Zoma",
    Samedi: "Sabotsy",
    Dimanche: "Alahady",
  },
};

function getTextes(langue) {
  return textes[langue] || textes.fr;
}

function traduireJour(jour, langue) {
  return nomsJours[langue]?.[jour] || jour;
}

function lirePreferences() {
  try {
    return {
      ...preferencesParDefaut,
      ...(JSON.parse(localStorage.getItem("vatanaPreferences")) || {}),
    };
  } catch {
    return preferencesParDefaut;
  }
}

function appliquerTheme(theme) {
  document.documentElement.classList.toggle("vatana-dark", theme === "sombre");
}

function getDateKey(date) {
  return new Date(date).toLocaleDateString("fr-CA");
}

function getDureeSecondes(exercice) {
  return Math.max(Number(exercice.duree_minutes) || 1, 1) * 60;
}

function formatTemps(secondes) {
  const minutes = Math.floor(secondes / 60);
  const resteSecondes = secondes % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    resteSecondes
  ).padStart(2, "0")}`;
}

function MonEspace() {
  const navigate = useNavigate();
  const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur") || "{}"
  );

  const [programme, setProgramme] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [seances, setSeances] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [exerciceEnCours, setExerciceEnCours] = useState(null);
  const [exerciceActifId, setExerciceActifId] = useState(null);
  const [tempsRestant, setTempsRestant] = useState(0);
  const [timerEnPause, setTimerEnPause] = useState(false);
  const [vueActive, setVueActive] = useState("dashboard");
  const [preferences, setPreferences] = useState(lirePreferences);
  const [succes, setSucces] = useState("");
  const [erreur, setErreur] = useState("");
  const [messagesNonLus, setMessagesNonLus] = useState(0);
  const t = getTextes(preferences.langue);

  const chargerSeances = useCallback(async () => {
    if (!utilisateur.id) {
      return;
    }

    const response = await api.get(`/seances/utilisateur/${utilisateur.id}`);
    setSeances(response.data);
  }, [utilisateur.id]);

  const chargerDonnees = useCallback(async () => {
    if (!utilisateur.id) {
      navigate("/login");
      return;
    }

    try {
      setChargement(true);
      setErreur("");

      const [programmeResponse, seancesResponse] = await Promise.all([
        api.get(`/client/mon-programme/${utilisateur.id}`),
        api.get(`/seances/utilisateur/${utilisateur.id}`),
      ]);

      setProgramme(programmeResponse.data.programme);
      setExercices(programmeResponse.data.exercices);
      setSeances(seancesResponse.data);
    } catch (error) {
      console.log(error);
      setErreur(getTextes(lirePreferences().langue).loadError);
    } finally {
      setChargement(false);
    }
  }, [navigate, utilisateur.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      chargerDonnees();
    }, 0);

    return () => clearTimeout(timer);
  }, [chargerDonnees]);

  useEffect(() => {
    if (!succes && !erreur) {
      return;
    }

    const timer = setTimeout(() => {
      setSucces("");
      setErreur("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [succes, erreur]);

  useEffect(() => {
    if (!exerciceActifId || timerEnPause || tempsRestant <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTempsRestant((tempsActuel) => Math.max(tempsActuel - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [exerciceActifId, tempsRestant, timerEnPause]);

  useEffect(() => {
    appliquerTheme(preferences.theme);
  }, [preferences.theme]);

  useEffect(() => {
    if (!utilisateur.id) {
      return undefined;
    }

    let composantMonte = true;

    const chargerNotificationsMessages = async () => {
      try {
        const response = await api.get(`/messages/${utilisateur.id}`);
        const totalNonLus = response.data.filter(
          (message) =>
            Number(message.destinataire_id) === Number(utilisateur.id) &&
            message.statut !== "lu"
        ).length;

        if (composantMonte) {
          setMessagesNonLus(totalNonLus);
        }
      } catch (error) {
        console.log("Erreur notifications messages", error);
      }
    };

    const premierChargement = setTimeout(() => {
      chargerNotificationsMessages();
    }, 0);
    const interval = setInterval(chargerNotificationsMessages, 30000);

    window.addEventListener(
      "vatana-messages-change",
      chargerNotificationsMessages
    );

    return () => {
      composantMonte = false;
      clearTimeout(premierChargement);
      clearInterval(interval);
      window.removeEventListener(
        "vatana-messages-change",
        chargerNotificationsMessages
      );
    };
  }, [utilisateur.id]);

  const deconnexion = () => {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const modifierPreference = (cle, valeur) => {
    setPreferences((preferencesActuelles) => {
      const nouvellesPreferences = {
        ...preferencesActuelles,
        [cle]: valeur,
      };

      localStorage.setItem(
        "vatanaPreferences",
        JSON.stringify(nouvellesPreferences)
      );
      window.dispatchEvent(new Event("vatana-preferences-change"));

      return nouvellesPreferences;
    });
    setSucces(getTextes(valeur && cle === "langue" ? valeur : preferences.langue).preferenceSaved);
  };

  // Les séances terminées aujourd'hui permettent de désactiver le bouton exercice par exercice.
  const exercicesTerminesAujourdhui = useMemo(() => {
    const aujourdHui = getDateKey(new Date());

    return new Set(
      seances
        .filter((seance) => getDateKey(seance.date_realisation) === aujourdHui)
        .map((seance) => Number(seance.exercice_id))
    );
  }, [seances]);

  const exercicesParJour = useMemo(() => {
    const groupes = exercices.reduce((acc, exercice) => {
      if (!acc[exercice.jour]) {
        acc[exercice.jour] = [];
      }

      acc[exercice.jour].push(exercice);

      return acc;
    }, {});

    // Les jours gardent toujours l'ordre naturel de la semaine.
    return ordreJours
      .filter((jour) => groupes[jour]?.length)
      .map((jour) => [jour, groupes[jour]]);
  }, [exercices]);

  const exercicesOrdonnes = useMemo(() => {
    return exercicesParJour.flatMap(([, liste]) => liste);
  }, [exercicesParJour]);

  const totalTerminesAujourdhui = exercices.filter((exercice) =>
    exercicesTerminesAujourdhui.has(Number(exercice.id))
  ).length;
  const progressionAujourdhui = exercices.length
    ? Math.round((totalTerminesAujourdhui / exercices.length) * 100)
    : 0;
  const totalMinutesProgramme = exercices.reduce(
    (total, exercice) => total + (Number(exercice.duree_minutes) || 0),
    0
  );
  const prochainExercice = exercicesOrdonnes.find(
    (exercice) => !exercicesTerminesAujourdhui.has(Number(exercice.id))
  );
  const calendrierSemaine = ordreJours.map((jour) => {
    const liste =
      exercicesParJour.find(([jourGroupe]) => jourGroupe === jour)?.[1] || [];
    const termines = liste.filter((exercice) =>
      exercicesTerminesAujourdhui.has(Number(exercice.id))
    ).length;

    return {
      jour,
      exercices: liste,
      termines,
      total: liste.length,
    };
  });
  const onglets = [
    { id: "dashboard", label: t.tabs.dashboard, icon: <FiHome /> },
    { id: "seance", label: t.tabs.seance, icon: <FiList /> },
    { id: "calendrier", label: t.tabs.calendrier, icon: <FiCalendar /> },
    { id: "messages", label: t.tabs.messages, icon: <FiMessageSquare /> },
    { id: "parametres", label: t.tabs.parametres, icon: <FiSettings /> },
  ];

  const demarrerExercice = (exercice) => {
    setExerciceActifId(exercice.id);
    setTempsRestant(getDureeSecondes(exercice));
    setTimerEnPause(false);
  };

  const reinitialiserTimer = (exercice) => {
    setTempsRestant(getDureeSecondes(exercice));
    setTimerEnPause(false);
  };

  const demarrerProchainExercice = (exerciceTermineId) => {
    const prochainExercice = exercicesOrdonnes.find(
      (exercice) =>
        Number(exercice.id) !== Number(exerciceTermineId) &&
        !exercicesTerminesAujourdhui.has(Number(exercice.id))
    );

    if (prochainExercice) {
      demarrerExercice(prochainExercice);
    } else {
      setExerciceActifId(null);
      setTempsRestant(0);
      setTimerEnPause(false);
    }
  };

  const terminerExercice = async (exercice) => {
    try {
      setExerciceEnCours(exercice.id);
      setErreur("");
      setSucces("");

      // Le backend crée une séance réalisée pour le sportif connecté.
      await api.post("/seances", {
        utilisateur_id: utilisateur.id,
        exercice_id: exercice.id,
      });

      await chargerSeances();
      demarrerProchainExercice(exercice.id);
      setSucces(t.completedMessage.replace("{name}", exercice.nom_exercice));
    } catch (error) {
      console.log(error);
      setErreur(t.finishError);
    } finally {
      setExerciceEnCours(null);
    }
  };

  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_30rem),linear-gradient(135deg,#f8fafc,#eef4f8)]">
        <div className="rounded-lg bg-white px-6 py-5 text-center shadow-sm">
          <div className="mx-auto mb-4 h-2 w-48 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-green-600" />
          </div>
          <p className="font-semibold text-slate-900">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_30rem),linear-gradient(135deg,#f8fafc,#eef4f8_55%,#f7fafc)] p-4 sm:p-6">
      <AlertMessage
        type="succes"
        message={succes}
        onFermer={() => setSucces("")}
        flottant
      />

      <AlertMessage
        type="erreur"
        message={erreur}
        onFermer={() => setErreur("")}
        flottant
      />

      <header className="relative mb-6 overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(34,197,94,0.22),transparent_18rem)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-300 via-cyan-300 to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-300">
              {t.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold">
              {t.hello} {utilisateur.nom} {utilisateur.prenom}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {t.heroDescription}
            </p>
          </div>

          <button
            onClick={deconnexion}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 font-semibold text-red-200 shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <FiLogOut />
            {t.logout}
          </button>
        </div>
      </header>

      <nav className="sticky top-3 z-20 mb-6 overflow-x-auto rounded-lg border border-white/70 bg-white/85 p-2 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
        <div className="grid min-w-[700px] grid-cols-5 gap-2 sm:min-w-0">
          {onglets.map((onglet) => (
            <button
              key={onglet.id}
              type="button"
              onClick={() => setVueActive(onglet.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold transition ${
                vueActive === onglet.id
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : "text-slate-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <span className="text-lg">{onglet.icon}</span>
              {onglet.label}
              {onglet.id === "messages" && messagesNonLus > 0 && (
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-black ${
                    vueActive === onglet.id
                      ? "bg-white text-green-700"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {messagesNonLus > 9 ? "9+" : messagesNonLus}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {vueActive === "messages" ? (
        <Messagerie contexte="client" />
      ) : programme ? (
        <>
          {vueActive === "dashboard" && (
            <div className="space-y-6">
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg shadow-slate-200/50">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.stats.todayProgress}
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {progressionAujourdhui}%
                  </p>
                  <div className="mt-4 h-3 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green-600"
                      style={{ width: `${progressionAujourdhui}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg shadow-slate-200/50">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.stats.exercises}
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {exercices.length}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    {t.stats.completedToday.replace(
                      "{count}",
                      totalTerminesAujourdhui
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg shadow-slate-200/50">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.stats.totalDuration}
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {totalMinutesProgramme}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    {t.stats.plannedMinutes}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg shadow-slate-200/50">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.stats.completedSessions}
                  </p>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {seances.length}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    {t.stats.fullHistory}
                  </p>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-blue-500" />
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700 ring-4 ring-green-100/70">
                      <FiTarget />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {t.program.current}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-950">
                        {programme.nom_programme}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                          {t.program.objective} : {programme.objectif}
                        </span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                          {t.program.level} : {programme.niveau}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700">
                      <FiPlay />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {t.program.nextExercise}
                      </p>
                      <h3 className="mt-1 font-bold text-slate-950">
                        {prochainExercice?.nom_exercice || t.program.allDone}
                      </h3>
                    </div>
                  </div>
                  {prochainExercice && (
                    <button
                      type="button"
                      onClick={() => {
                        setVueActive("seance");
                        demarrerExercice(prochainExercice);
                      }}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
                    >
                      <FiPlay />
                      {t.program.startSession}
                    </button>
                  )}
                </div>
              </section>
            </div>
          )}

          {vueActive === "calendrier" && (
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg shadow-slate-200/50">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700">
                  <FiCalendar />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {t.calendar.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t.calendar.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
                {calendrierSemaine.map((jour) => (
                  <div
                    key={jour.jour}
                    className={`rounded-lg border p-4 ${
                      jour.total
                        ? "border-green-200 bg-green-50/60"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <p className="font-bold text-slate-950">
                      {traduireJour(jour.jour, preferences.langue)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {jour.total}{" "}
                      {jour.total > 1
                        ? t.calendar.exercises
                        : t.calendar.exercise}
                    </p>
                    <div className="mt-4 h-2 rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{
                          width: `${
                            jour.total
                              ? Math.round((jour.termines / jour.total) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      {jour.termines}/{jour.total} {t.calendar.completed}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {vueActive === "parametres" && (
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-green-600 text-xl font-black text-white">
                    {(utilisateur.nom || "S").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {t.settings.athleteProfile}
                    </p>
                    <h2 className="text-xl font-bold text-slate-950">
                      {utilisateur.nom} {utilisateur.prenom}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={deconnexion}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700 transition hover:bg-red-100"
                >
                  <FiLogOut />
                  {t.logout}
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-700">
                    <FiSettings />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      {t.settings.preferences}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t.settings.preferencesDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg text-green-700">
                        <FiMoon />
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">
                          {t.settings.appearance}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.settings.appearanceDesc}
                        </p>
                      </div>
                    </div>

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
                          <span className="block font-bold">
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
                          <span className="block font-bold">
                            {t.settings.darkMode}
                          </span>
                          <span className="text-sm opacity-75">
                            {t.settings.darkModeDesc}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg text-blue-700">
                        <FiGlobe />
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">
                          {t.settings.language}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t.settings.languageDesc}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {Object.entries(langues).map(([code, langue]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => modifierPreference("langue", code)}
                          className={`rounded-lg border p-4 text-left transition ${
                            preferences.langue === code
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-gray-200 bg-white text-slate-700 hover:border-green-200"
                          }`}
                        >
                          <span className="block font-bold">{langue.nom}</span>
                          <span className="mt-1 block text-sm opacity-75">
                            {langue.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <span>
                      <span className="block font-semibold text-slate-900">
                        {t.settings.sessionNotifications}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t.settings.sessionNotificationsDesc}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.notificationsSeance}
                      onChange={(event) =>
                        modifierPreference(
                          "notificationsSeance",
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 accent-green-600"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <span>
                      <span className="block font-semibold text-slate-900">
                        {t.settings.focusMode}
                      </span>
                      <span className="text-sm text-gray-500">
                        {t.settings.focusModeDesc}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.modeConcentration}
                      onChange={(event) =>
                        modifierPreference(
                          "modeConcentration",
                          event.target.checked
                        )
                      }
                      className="h-5 w-5 accent-green-600"
                    />
                  </label>
                </div>
              </div>
            </section>
          )}

          {vueActive === "seance" && (
            <>
          <section className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-blue-500" />
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700 ring-4 ring-green-100/70">
                  <FiTarget />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.program.current}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {programme.nom_programme}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                      {t.program.objective} : {programme.objectif}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      {t.program.level} : {programme.niveau}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/50">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-emerald-300" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {t.exercise.today}
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {progressionAujourdhui}%
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700 ring-4 ring-green-100/70">
                  <FiCheckCircle />
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{ width: `${progressionAujourdhui}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {totalTerminesAujourdhui} / {exercices.length}{" "}
                {t.calendar.exercises} {t.exercise.completed}
              </p>
            </div>
          </section>

          {exercicesParJour.map(([jour, liste]) => (
            <section
              key={jour}
              className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-slate-200/50"
            >
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl text-green-700 ring-4 ring-green-100/70">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {traduireJour(jour, preferences.langue)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {liste.length}{" "}
                      {liste.length > 1
                        ? t.calendar.exercises
                        : t.calendar.exercise}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {liste.map((exercice) => {
                  const termine = exercicesTerminesAujourdhui.has(
                    Number(exercice.id)
                  );
                  const enCours = exerciceEnCours === exercice.id;
                  const estActif = exerciceActifId === exercice.id;
                  const timerFini = estActif && tempsRestant === 0;

                  return (
                    <div
                      key={exercice.id}
                      className="group flex flex-col gap-4 p-5 transition hover:bg-green-50/40 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 gap-4">
                        <div
                          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                            termine
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <FiCheckCircle />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-950">
                            {exercice.nom_exercice}
                          </h4>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            {exercice.series} {t.exercise.sets}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            {exercice.repetitions} {t.exercise.reps}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            <FiClock />
                            {exercice.duree_minutes} min
                          </span>
                        </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        {termine ? (
                          <span className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 font-bold text-green-700 ring-1 ring-green-100">
                            <FiCheckCircle />
                            {t.exercise.done}
                          </span>
                        ) : (
                          <>
                            <div
                              className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 font-black tabular-nums ring-1 ${
                                estActif
                                  ? "bg-slate-950 text-white ring-slate-900"
                                  : "bg-slate-100 text-slate-700 ring-slate-200"
                              }`}
                            >
                              <FiClock />
                              {estActif
                                ? formatTemps(tempsRestant)
                                : formatTemps(getDureeSecondes(exercice))}
                            </div>

                            {estActif ? (
                              <div className="flex flex-wrap justify-start gap-2 md:justify-end">
                                {timerFini ? (
                                  <button
                                    type="button"
                                    onClick={() => terminerExercice(exercice)}
                                    disabled={enCours}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                                  >
                                    <FiCheckCircle />
                                    {enCours
                                      ? t.exercise.validating
                                      : t.exercise.finish}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setTimerEnPause((pause) => !pause)
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                  >
                                    {timerEnPause ? <FiPlay /> : <FiPause />}
                                    {timerEnPause
                                      ? t.exercise.resume
                                      : t.exercise.pause}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => reinitialiserTimer(exercice)}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <FiRotateCcw />
                                  {t.exercise.reset}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => demarrerExercice(exercice)}
                                disabled={Boolean(exerciceActifId)}
                                className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                              >
                                <FiPlay />
                                {t.exercise.start}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
            </>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-gray-200">
          <p className="font-semibold text-slate-950">
            {t.empty.title}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {t.empty.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default MonEspace;
