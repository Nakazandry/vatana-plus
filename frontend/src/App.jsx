import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Exercices from "./pages/Exercices";
import Programmes from "./pages/Programmes";
import Utilisateurs from "./pages/Utilisateurs";
import Affectations from "./pages/Affectations";
import Parametres from "./pages/Parametres";
import Messagerie from "./pages/Messagerie";

import Login from "./pages/Login";
import MonEspace from "./pages/MonEspace";
import ProtectedRoute from "./components/ProtectedRoute";

function lirePreferences() {
  try {
    return JSON.parse(localStorage.getItem("vatanaPreferences")) || {};
  } catch {
    return {};
  }
}

function lireThemePreference() {
  return lirePreferences().theme || "clair";
}

function lireLanguePreference() {
  return lirePreferences().langue || "fr";
}

function AppContent() {
  const location = useLocation();
  const [chargementPage, setChargementPage] = useState(false);
  const [theme, setTheme] = useState(lireThemePreference);
  const [langue, setLangue] = useState(lireLanguePreference);

  useEffect(() => {
    const debutTimer = setTimeout(() => {
      setChargementPage(true);
    }, 0);

    const timer = setTimeout(() => {
      setChargementPage(false);
    }, 700);

    return () => {
      clearTimeout(debutTimer);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  useEffect(() => {
    const synchroniserPreferences = () => {
      const themeActuel = lireThemePreference();
      const langueActuelle = lireLanguePreference();

      setTheme(themeActuel);
      setLangue(langueActuelle);
      document.documentElement.classList.toggle(
        "vatana-dark",
        themeActuel === "sombre"
      );
    };

    synchroniserPreferences();
    window.addEventListener("storage", synchroniserPreferences);
    window.addEventListener(
      "vatana-preferences-change",
      synchroniserPreferences
    );

    return () => {
      window.removeEventListener("storage", synchroniserPreferences);
      window.removeEventListener(
        "vatana-preferences-change",
        synchroniserPreferences
      );
    };
  }, []);

  if (location.pathname === "/" || location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  if (location.pathname === "/mon-espace") {
    return (
      <Routes>
        <Route
          path="/mon-espace"
          element={
            <ProtectedRoute role="client">
              <MonEspace />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  const adminLayout = (
    <div className="min-h-screen lg:flex">
      <Sidebar langue={langue} />

      <div
        className={`relative min-w-0 flex-1 px-4 py-4 sm:px-6 lg:p-6 ${
          theme === "sombre"
            ? "bg-slate-950"
            : "bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_30rem),linear-gradient(135deg,#f8fafc,#eef4f8_55%,#f7fafc)]"
        }`}
      >
        <Navbar langue={langue} />

        {chargementPage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/65 backdrop-blur-md">
            <Grid size="60" speed="1.5" color="#16a34a" />
          </div>
        )}

        <Routes>
          <Route path="/dashboard" element={<Dashboard langue={langue} />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/affectations" element={<Affectations />} />
          <Route path="/messages" element={<Messagerie contexte="admin" />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
      </div>
    </div>
  );

  return <ProtectedRoute role="admin">{adminLayout}</ProtectedRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
