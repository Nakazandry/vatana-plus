import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const utilisateurSauvegarde = localStorage.getItem("utilisateur");
  const token = localStorage.getItem("token");
  let utilisateur = null;

  if (utilisateurSauvegarde) {
    try {
      utilisateur = JSON.parse(utilisateurSauvegarde);
    } catch {
      localStorage.removeItem("utilisateur");
      localStorage.removeItem("token");
    }
  }

  if (!utilisateur || !token) {
    localStorage.removeItem("utilisateur");
    localStorage.removeItem("token");

    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  if (role && utilisateur.role !== role) {
    if (utilisateur.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/mon-espace" replace />;
  }

  return children;
}

export default ProtectedRoute;
