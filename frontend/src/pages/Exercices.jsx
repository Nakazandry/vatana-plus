import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiPlus, FiSearch } from "react-icons/fi";

import api from "../services/api";
import exercicesIllustration from "../assets/exercices-illustration.png";
import PageHero from "../components/PageHero";
import StatCard from "../components/cards/StatCard";
import AlertMessage from "../components/feedback/AlertMessage";
import Pagination from "../components/pagination/Pagination";
import ConfirmModal from "../components/modals/ConfirmModal";
import ExerciceModal from "../components/modals/ExerciceModal";
import ExercicesTable from "../components/tables/ExercicesTable";

const formInitial = {
  nom_exercice: "",
  series: "",
  repetitions: "",
  duree_minutes: "",
  jour: "Lundi",
  programme_id: "",
};

const ELEMENTS_PAR_PAGE = 5;

function Exercices() {
  const [exercices, setExercices] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState(formInitial);
  const [enregistrement, setEnregistrement] = useState(false);

  const [exerciceAModifier, setExerciceAModifier] = useState(null);
  const [exerciceASupprimer, setExerciceASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const [pageActuelle, setPageActuelle] = useState(1);
  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    try {
      setChargement(true);
      setErreur("");

      const exercicesResponse = await api.get("/exercices");
      const programmesResponse = await api.get("/programmes");

      setExercices(exercicesResponse.data);
      setProgrammes(programmesResponse.data);
    } catch (error) {
      console.log(error);
      setErreur("Impossible de charger les exercices.");
    } finally {
      setChargement(false);
    }
  }

  const exercicesFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) return exercices;

    return exercices.filter((exercice) =>
      [
        exercice.nom_exercice,
        exercice.nom_programme,
        exercice.jour,
        exercice.series,
        exercice.repetitions,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(terme)
    );
  }, [recherche, exercices]);

  const totalPages = Math.max(
    1,
    Math.ceil(exercicesFiltres.length / ELEMENTS_PAR_PAGE)
  );
  const pageCourante = Math.min(pageActuelle, totalPages);

  const exercicesPagine = useMemo(() => {
    const debut = (pageCourante - 1) * ELEMENTS_PAR_PAGE;
    return exercicesFiltres.slice(debut, debut + ELEMENTS_PAR_PAGE);
  }, [pageCourante, exercicesFiltres]);

  useEffect(() => {
    if (!succes) {
      return;
    }

    const timer = setTimeout(() => {
      setSucces("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [succes]);

  const fermerModal = () => {
    setModalOuvert(false);
    setExerciceAModifier(null);
    setFormData(formInitial);
  };

  const ouvrirAjout = () => {
    setErreur("");
    setSucces("");
    setExerciceAModifier(null);
    setFormData(formInitial);
    setModalOuvert(true);
  };

  const ouvrirModification = (exercice) => {
    setErreur("");
    setSucces("");
    setExerciceAModifier(exercice);

    setFormData({
      nom_exercice: exercice.nom_exercice || "",
      series: exercice.series || "",
      repetitions: exercice.repetitions || "",
      duree_minutes: exercice.duree_minutes || "",
      jour: exercice.jour || "Lundi",
      programme_id: exercice.programme_id || "",
    });

    setModalOuvert(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enregistrerExercice = async (e) => {
    e.preventDefault();

    try {
      setEnregistrement(true);
      setErreur("");
      setSucces("");

      if (exerciceAModifier) {
        await api.put(`/exercices/${exerciceAModifier.id}`, formData);
      } else {
        await api.post("/exercices", formData);
      }

      const messageSucces = exerciceAModifier
        ? "Exercice modifié avec succès."
        : "Exercice ajouté avec succès.";

      fermerModal();
      await chargerDonnees();
      setSucces(messageSucces);
    } catch (error) {
      console.log(error);
      setErreur("L'enregistrement de l'exercice a échoué.");
    } finally {
      setEnregistrement(false);
    }
  };

  const supprimerExercice = async () => {
    if (!exerciceASupprimer) return;

    try {
      setSuppressionEnCours(true);
      setErreur("");
      setSucces("");

      await api.delete(`/exercices/${exerciceASupprimer.id}`);

      setExerciceASupprimer(null);
      await chargerDonnees();
      setSucces("Exercice supprimé avec succès.");
    } catch (error) {
      console.log(error);
      setErreur("La suppression de l'exercice a échoué.");
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        image={exercicesIllustration}
        alt="Illustration anime d'exercices sportifs dans une salle virtuelle"
        eyebrow="Entraînement"
        title="Exercices"
        description="Gérez les exercices de chaque programme sportif avec une vue claire et dynamique."
        actionLabel="Ajouter"
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
          icon={<FiActivity />}
          label="Total exercices"
          value={exercices.length}
          helper="Exercices enregistrés"
          color="bg-green-50 text-green-700"
        />

        <StatCard
          icon={<FiActivity />}
          label="Programmes liés"
          value={new Set(exercices.map((e) => e.programme_id)).size}
          helper="Programmes contenant exercices"
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          icon={<FiActivity />}
          label="Aujourd'hui"
          value={exercices.filter((e) => e.jour === "Lundi").length}
          helper="Exercices du lundi"
          color="bg-slate-100 text-slate-800"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Liste des exercices
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {exercicesFiltres.length} résultat
              {exercicesFiltres.length > 1 ? "s" : ""} affiché
              {exercicesFiltres.length > 1 ? "s" : ""}
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
              placeholder="Rechercher exercice..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none shadow-sm transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <ExercicesTable
          exercices={exercicesPagine}
          chargement={chargement}
          onModifier={ouvrirModification}
          onSupprimer={setExerciceASupprimer}
        />

        <Pagination
          pageActuelle={pageCourante}
          totalPages={totalPages}
          totalItems={exercicesFiltres.length}
          onPageChange={setPageActuelle}
        />
      </section>

      <ExerciceModal
        ouvert={modalOuvert}
        mode={exerciceAModifier ? "modification" : "ajout"}
        formData={formData}
        programmes={programmes}
        enregistrement={enregistrement}
        onChange={handleChange}
        onSubmit={enregistrerExercice}
        onFermer={fermerModal}
      />

      <ConfirmModal
        ouvert={Boolean(exerciceASupprimer)}
        titre="Supprimer cet exercice ?"
        message={
          exerciceASupprimer
            ? `Cette action supprimera l'exercice ${exerciceASupprimer.nom_exercice}.`
            : ""
        }
        texteConfirmation="Supprimer"
        chargement={suppressionEnCours}
        onConfirmer={supprimerExercice}
        onFermer={() => setExerciceASupprimer(null)}
      />
    </div>
  );
}

export default Exercices;
