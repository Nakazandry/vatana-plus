import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiPlus, FiSearch } from "react-icons/fi";

import api from "../services/api";
import programmesIllustration from "../assets/programmes-illustration.png";
import PageHero from "../components/PageHero";
import StatCard from "../components/cards/StatCard";
import ConfirmModal from "../components/modals/ConfirmModal";
import ProgrammeModal from "../components/modals/ProgrammeModal";
import ProgrammesTable from "../components/tables/ProgrammesTable";
import AlertMessage from "../components/feedback/AlertMessage";
import Pagination from "../components/pagination/Pagination";


const formInitial = {
  nom_programme: "",
  objectif: "",
  niveau: "Débutant",
  utilisateur_id: 2,
};

const ELEMENTS_PAR_PAGE = 5;

function Programmes() {
  const [programmes, setProgrammes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [pageActuelle, setPageActuelle] = useState(1);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState(formInitial);
  const [enregistrement, setEnregistrement] = useState(false);

  const [programmeAModifier, setProgrammeAModifier] = useState(null);
  const [programmeASupprimer, setProgrammeASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  useEffect(() => {
    chargerProgrammes();
  }, []);

  async function chargerProgrammes() {
    try {
      setChargement(true);
      setErreur("");

      const response = await api.get("/programmes");
      setProgrammes(response.data);
    } catch (error) {
      console.log(error);
      setErreur("Impossible de charger les programmes.");
    } finally {
      setChargement(false);
    }
  }

  const programmesFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) return programmes;

    return programmes.filter((programme) =>
      [programme.nom_programme, programme.objectif, programme.niveau]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(terme)
    );
  }, [recherche, programmes]);

  const totalPages = Math.max(
    1,
    Math.ceil(programmesFiltres.length / ELEMENTS_PAR_PAGE)
  );
  const pageCourante = Math.min(pageActuelle, totalPages);

  const programmesPagine = useMemo(() => {
    const debut = (pageCourante - 1) * ELEMENTS_PAR_PAGE;
    return programmesFiltres.slice(debut, debut + ELEMENTS_PAR_PAGE);
  }, [pageCourante, programmesFiltres]);

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
    setProgrammeAModifier(null);
    setFormData(formInitial);
  };

  const ouvrirAjout = () => {
    setErreur("");
    setSucces("");
    setProgrammeAModifier(null);
    setFormData(formInitial);
    setModalOuvert(true);
  };

  const ouvrirModification = (programme) => {
    setErreur("");
    setSucces("");
    setProgrammeAModifier(programme);

    setFormData({
      nom_programme: programme.nom_programme || "",
      objectif: programme.objectif || "",
      niveau: programme.niveau || "Débutant",
      utilisateur_id: programme.utilisateur_id || 2,
    });

    setModalOuvert(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const enregistrerProgramme = async (e) => {
    e.preventDefault();

    try {
      setEnregistrement(true);
      setErreur("");
      setSucces("");

      if (programmeAModifier) {
        await api.put(`/programmes/${programmeAModifier.id}`, formData);
      } else {
        await api.post("/programmes", formData);
      }

      const messageSucces = programmeAModifier
        ? "Programme modifié avec succès."
        : "Programme ajouté avec succès.";

      fermerModal();
      await chargerProgrammes();
      setSucces(messageSucces);
    } catch (error) {
      console.log(error);
      setErreur("L'enregistrement du programme a échoué.");
    } finally {
      setEnregistrement(false);
    }
  };

  const supprimerProgramme = async () => {
    if (!programmeASupprimer) return;

    try {
      setSuppressionEnCours(true);
      setErreur("");
      setSucces("");

      await api.delete(`/programmes/${programmeASupprimer.id}`);

      setProgrammeASupprimer(null);
      await chargerProgrammes();
      setSucces("Programme supprimé avec succès.");
    } catch (error) {
      console.log(error);
      setErreur("La suppression du programme a échoué.");
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        image={programmesIllustration}
        alt="Illustration anime de création de programmes sportifs"
        eyebrow="Gestion sportive"
        title="Programmes"
        description="Créez et organisez les programmes d'entraînement proposés aux sportifs."
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FiClipboard />}
          label="Total programmes"
          value={programmes.length}
          helper="Programmes créés"
          color="bg-green-50 text-green-700"
        />

        <StatCard
          icon={<FiClipboard />}
          label="Débutant"
          value={programmes.filter((p) => p.niveau === "Débutant").length}
          helper="Programmes niveau débutant"
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          icon={<FiClipboard />}
          label="Intermédiaire"
          value={programmes.filter((p) => p.niveau === "Intermédiaire").length}
          helper="Programmes niveau intermédiaire"
          color="bg-amber-50 text-amber-700"
        />

        <StatCard
          icon={<FiClipboard />}
          label="Avancé"
          value={programmes.filter((p) => p.niveau === "Avancé").length}
          helper="Programmes intensifs"
          color="bg-slate-100 text-slate-800"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Liste des programmes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {programmesFiltres.length} résultat
              {programmesFiltres.length > 1 ? "s" : ""} trouvé
              {programmesFiltres.length > 1 ? "s" : ""}
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
              placeholder="Rechercher programme..."
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none shadow-sm transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <ProgrammesTable
          programmes={programmesPagine}
          chargement={chargement}
          onModifier={ouvrirModification}
          onSupprimer={setProgrammeASupprimer}
        />

        <Pagination
          pageActuelle={pageCourante}
          totalPages={totalPages}
          totalItems={programmesFiltres.length}
          onPageChange={setPageActuelle}
        />
      </section>

      <ProgrammeModal
        ouvert={modalOuvert}
        mode={programmeAModifier ? "modification" : "ajout"}
        formData={formData}
        enregistrement={enregistrement}
        onChange={handleChange}
        onSubmit={enregistrerProgramme}
        onFermer={fermerModal}
      />

      <ConfirmModal
        ouvert={Boolean(programmeASupprimer)}
        titre="Supprimer ce programme ?"
        message={
          programmeASupprimer
            ? `Cette action supprimera le programme ${programmeASupprimer.nom_programme}.`
            : ""
        }
        texteConfirmation="Supprimer"
        chargement={suppressionEnCours}
        onConfirmer={supprimerProgramme}
        onFermer={() => setProgrammeASupprimer(null)}
      />
    </div>
  );
}

export default Programmes;
