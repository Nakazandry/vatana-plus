import { useEffect, useMemo, useState } from "react";
import { FiLink, FiPlus, FiSearch } from "react-icons/fi";

import api from "../services/api";
import affectationsIllustration from "../assets/affectations-illustration.png";
import PageHero from "../components/PageHero";
import StatCard from "../components/cards/StatCard";
import AlertMessage from "../components/feedback/AlertMessage";
import Pagination from "../components/pagination/Pagination";
import ConfirmModal from "../components/modals/ConfirmModal";
import AffectationModal from "../components/modals/AffectationModal";
import AffectationsTable from "../components/tables/AffectationsTable";

const formInitial = {
  utilisateur_id: "",
  programme_id: "",
};

function Affectations() {
  const [affectations, setAffectations] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState(formInitial);
  const [enregistrement, setEnregistrement] = useState(false);

  const [affectationAModifier, setAffectationAModifier] = useState(null);
  const [affectationASupprimer, setAffectationASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const [pageActuelle, setPageActuelle] = useState(1);
  const elementsParPage = 5;

  useEffect(() => {
    chargerDonnees();
  }, []);

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

  async function chargerDonnees() {
    try {
      setChargement(true);
      setErreur("");

      const [affectationsRes, utilisateursRes, programmesRes] =
        await Promise.all([
          api.get("/affectations"),
          api.get("/utilisateurs"),
          api.get("/programmes"),
        ]);

      setAffectations(affectationsRes.data);
      setUtilisateurs(utilisateursRes.data);
      setProgrammes(programmesRes.data);
    } catch (error) {
      console.log(error);
      setErreur("Impossible de charger les affectations.");
    } finally {
      setChargement(false);
    }
  }

  const affectationsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) return affectations;

    return affectations.filter((a) =>
      [
        a.nom,
        a.prenom,
        a.email,
        a.nom_programme,
        a.objectif,
        a.niveau,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(terme)
    );
  }, [recherche, affectations]);

  const totalPages = Math.max(
    1,
    Math.ceil(affectationsFiltres.length / elementsParPage)
  );
  const pageCourante = Math.min(pageActuelle, totalPages);

  const affectationsPagine = affectationsFiltres.slice(
    (pageCourante - 1) * elementsParPage,
    pageCourante * elementsParPage
  );

  const fermerModal = () => {
    setModalOuvert(false);
    setAffectationAModifier(null);
    setFormData(formInitial);
  };

  const ouvrirAjout = () => {
    setAffectationAModifier(null);
    setFormData(formInitial);
    setModalOuvert(true);
  };

  const ouvrirModification = (affectation) => {
    setAffectationAModifier(affectation);

    setFormData({
      utilisateur_id: affectation.utilisateur_id || "",
      programme_id: affectation.programme_id || "",
    });

    setModalOuvert(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enregistrerAffectation = async (e) => {
    e.preventDefault();

    try {
      setEnregistrement(true);
      setErreur("");
      setSucces("");

      if (affectationAModifier) {
        await api.put(`/affectations/${affectationAModifier.id}`, formData);
        setSucces("Affectation modifiée avec succès.");
      } else {
        await api.post("/affectations", formData);
        setSucces("Programme affecté avec succès.");
      }

      fermerModal();
      chargerDonnees();
    } catch (error) {
      console.log(error);
      setErreur(
        error.response?.data?.message ||
          "L'enregistrement de l'affectation a échoué."
      );
    } finally {
      setEnregistrement(false);
    }
  };

  const supprimerAffectation = async () => {
    if (!affectationASupprimer) return;

    try {
      setSuppressionEnCours(true);
      setErreur("");
      setSucces("");

      await api.delete(`/affectations/${affectationASupprimer.id}`);

      setAffectationASupprimer(null);
      setSucces("Affectation supprimée avec succès.");
      chargerDonnees();
    } catch (error) {
      console.log(error);
      setErreur("La suppression de l'affectation a échoué.");
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        image={affectationsIllustration}
        alt="Illustration anime d'affectation de programmes à des sportifs"
        eyebrow="Coaching"
        title="Affectations"
        description="Affectez un programme sportif à chaque utilisateur avec une interface claire."
        actionLabel="Affecter"
        actionIcon={<FiPlus />}
        onAction={ouvrirAjout}
      />

      <AlertMessage
        type="erreur"
        message={erreur}
        onFermer={() => setErreur("")}
        flottant
      />

      <AlertMessage
        type="succes"
        message={succes}
        onFermer={() => setSucces("")}
        flottant
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<FiLink />}
          label="Total affectations"
          value={affectations.length}
          helper="Programmes attribués"
          color="bg-green-50 text-green-700"
        />

        <StatCard
          icon={<FiLink />}
          label="Sportifs concernés"
          value={new Set(affectations.map((a) => a.utilisateur_id)).size}
          helper="Utilisateurs avec programme"
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          icon={<FiLink />}
          label="Programmes utilisés"
          value={new Set(affectations.map((a) => a.programme_id)).size}
          helper="Programmes déjà affectés"
          color="bg-slate-100 text-slate-800"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Liste des affectations
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {affectationsFiltres.length} résultat
              {affectationsFiltres.length > 1 ? "s" : ""} affiché
              {affectationsFiltres.length > 1 ? "s" : ""}
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
                setPageActuelle(1);
              }}
              placeholder="Rechercher sportif ou programme..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none shadow-sm transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <AffectationsTable
          affectations={affectationsPagine}
          chargement={chargement}
          onModifier={ouvrirModification}
          onSupprimer={setAffectationASupprimer}
        />

        <Pagination
          pageActuelle={pageCourante}
          totalPages={totalPages}
          totalItems={affectationsFiltres.length}
          onPageChange={setPageActuelle}
        />
      </section>

      <AffectationModal
        ouvert={modalOuvert}
        mode={affectationAModifier ? "modification" : "ajout"}
        formData={formData}
        utilisateurs={utilisateurs}
        programmes={programmes}
        enregistrement={enregistrement}
        onChange={handleChange}
        onSubmit={enregistrerAffectation}
        onFermer={fermerModal}
      />

      <ConfirmModal
        ouvert={Boolean(affectationASupprimer)}
        titre="Supprimer cette affectation ?"
        message={
          affectationASupprimer
            ? `Cette action supprimera le programme ${affectationASupprimer.nom_programme} de ${affectationASupprimer.nom} ${affectationASupprimer.prenom}.`
            : ""
        }
        texteConfirmation="Supprimer"
        chargement={suppressionEnCours}
        onConfirmer={supprimerAffectation}
        onFermer={() => setAffectationASupprimer(null)}
      />
    </div>
  );
}

export default Affectations;
