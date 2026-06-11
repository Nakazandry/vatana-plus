import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/cards/StatCard";
import AlertMessage from "../components/feedback/AlertMessage";
import ConfirmModal from "../components/modals/ConfirmModal";
import UserModal from "../components/modals/UserModal";
import Pagination from "../components/pagination/Pagination";
import UsersTable from "../components/tables/UsersTable";
import { FiPlus, FiSearch, FiShield, FiUser, FiUsers } from "react-icons/fi";
import api from "../services/api";
import utilisateursIllustration from "../assets/utilisateurs-illustration.png";
import PageHero from "../components/PageHero";

const formInitial = {
  nom: "",
  prenom: "",
  email: "",
  mot_de_passe: "",
  role: "client",
};

const ELEMENTS_PAR_PAGE = 5;

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState(formInitial);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [utilisateurAModifier, setUtilisateurAModifier] = useState(null);
  const [pageActuelle, setPageActuelle] = useState(1);

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  async function chargerUtilisateurs() {
    try {
      setChargement(true);
      setErreur("");
      const response = await api.get("/utilisateurs");
      setUtilisateurs(response.data);
    } catch (error) {
      console.log(error);
      setErreur("Impossible de charger les utilisateurs pour le moment.");
    } finally {
      setChargement(false);
    }
  }

  const utilisateursFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) {
      return utilisateurs;
    }

    return utilisateurs.filter((utilisateur) =>
      [
        utilisateur.nom,
        utilisateur.prenom,
        utilisateur.email,
        utilisateur.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(terme)
    );
  }, [recherche, utilisateurs]);

  const totalPages = Math.max(
    1,
    Math.ceil(utilisateursFiltres.length / ELEMENTS_PAR_PAGE)
  );
  const pageCourante = Math.min(pageActuelle, totalPages);

  const utilisateursPagine = useMemo(() => {
    const debut = (pageCourante - 1) * ELEMENTS_PAR_PAGE;
    return utilisateursFiltres.slice(debut, debut + ELEMENTS_PAR_PAGE);
  }, [pageCourante, utilisateursFiltres]);

  useEffect(() => {
    if (!succes) {
      return;
    }

    const timer = setTimeout(() => {
      setSucces("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [succes]);

  const totalAdmins = utilisateurs.filter((u) => u.role === "admin").length;
  const totalSportifs = utilisateurs.length - totalAdmins;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fermerModal = () => {
    setModalOuvert(false);
    setUtilisateurAModifier(null);
    setFormData(formInitial);
  };

  const ouvrirAjout = () => {
    setErreur("");
    setSucces("");
    setUtilisateurAModifier(null);
    setFormData(formInitial);
    setModalOuvert(true);
  };

  const ouvrirModification = (utilisateur) => {
    setErreur("");
    setSucces("");
    setUtilisateurAModifier(utilisateur);
    setFormData({
      nom: utilisateur.nom || "",
      prenom: utilisateur.prenom || "",
      email: utilisateur.email || "",
      mot_de_passe: utilisateur.mot_de_passe || "",
      role: utilisateur.role || "client",
    });
    setModalOuvert(true);
  };

  const enregistrerUtilisateur = async (e) => {
    e.preventDefault();

    try {
      setEnregistrement(true);
      setErreur("");
      setSucces("");

      if (utilisateurAModifier) {
        await api.put(`/utilisateurs/${utilisateurAModifier.id}`, formData);
      } else {
        await api.post("/utilisateurs", formData);
      }

      const messageSucces = utilisateurAModifier
        ? "Utilisateur modifié avec succès."
        : "Utilisateur ajouté avec succès.";

      fermerModal();
      await chargerUtilisateurs();
      setSucces(messageSucces);
    } catch (error) {
      console.log(error);
      setErreur(
        error.response?.data?.message ||
          "L'enregistrement de l'utilisateur a échoué."
      );
    } finally {
      setEnregistrement(false);
    }
  };
  const supprimerUtilisateur = async () => {
    if (!utilisateurASupprimer) {
      return;
    }

    try {
      setSuppressionEnCours(true);
      setErreur("");
      setSucces("");
      await api.delete(`/utilisateurs/${utilisateurASupprimer.id}`);
      setUtilisateurASupprimer(null);
      await chargerUtilisateurs();
      setSucces("Utilisateur supprimé avec succès.");
    } catch (error) {
      console.log(error);
      setErreur("La suppression de l'utilisateur a échoué.");
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        image={utilisateursIllustration}
        alt="Illustration anime de profils utilisateurs sportifs"
        eyebrow="Gestion des membres"
        title="Utilisateurs"
        description="Suivez les sportifs inscrits, les rôles coach/admin et les comptes actifs de Vatana+."
        actionLabel="Ajouter"
        actionIcon={<FiPlus />}
        onAction={ouvrirAjout}
      />

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

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<FiUsers />}
          label="Total utilisateurs"
          value={utilisateurs.length}
          helper="Comptes enregistrés"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          icon={<FiShield />}
          label="Coach/Admin"
          value={totalAdmins}
          helper="Accès d'administration"
          color="bg-slate-100 text-slate-800"
        />
        <StatCard
          icon={<FiUser />}
          label="Sportifs"
          value={totalSportifs}
          helper="Profils clients"
          color="bg-blue-50 text-blue-700"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Liste des utilisateurs
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {utilisateursFiltres.length} résultat
              {utilisateursFiltres.length > 1 ? "s" : ""} trouvé
              {utilisateursFiltres.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                setPageActuelle(1);
              }}
              placeholder="Rechercher nom, email, rôle..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none shadow-sm transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <UsersTable
          utilisateurs={utilisateursPagine}
          chargement={chargement}
          onSupprimer={setUtilisateurASupprimer}
          onModifier={ouvrirModification}
        />

        <Pagination
          pageActuelle={pageCourante}
          totalPages={totalPages}
          totalItems={utilisateursFiltres.length}
          onPageChange={setPageActuelle}
        />
      </section>

      <UserModal
        ouvert={modalOuvert}
        mode={utilisateurAModifier ? "modification" : "ajout"}
        formData={formData}
        enregistrement={enregistrement}
        onChange={handleChange}
        onSubmit={enregistrerUtilisateur}
        onFermer={fermerModal}
      />

      <ConfirmModal
        ouvert={Boolean(utilisateurASupprimer)}
        titre="Supprimer cet utilisateur ?"
        message={
          utilisateurASupprimer
            ? `Cette action supprimera le compte de ${utilisateurASupprimer.nom} ${utilisateurASupprimer.prenom}.`
            : ""
        }
        texteConfirmation="Supprimer"
        chargement={suppressionEnCours}
        onConfirmer={supprimerUtilisateur}
        onFermer={() => setUtilisateurASupprimer(null)}
      />
    </div>
  );
}

export default Utilisateurs;
