import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiBarChart2,
  FiClipboard,
  FiLink,
  FiMessageSquare,
  FiPlusCircle,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiUsers,
} from "react-icons/fi";

import api from "../services/api";
import programmesIllustration from "../assets/programmes-illustration.png";
import PageHero from "../components/PageHero";
import StatCard from "../components/cards/StatCard";
import { getTraduction } from "../i18n";

const limiterPourcentage = (valeur) => Math.min(Math.max(valeur, 0), 100);

function Panel({ title, description, icon, action, children }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur ring-1 ring-gray-200/70">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
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
        {action}
      </div>

      {children}
    </section>
  );
}

function DistributionChart({ donnees, total, totalLabel }) {
  const max = Math.max(...donnees.map((item) => item.value), 1);
  let cumul = 0;
  const gradient = total
    ? `conic-gradient(${donnees
        .map((item) => {
          const depart = cumul;
          cumul += (item.value / total) * 100;

          return `${item.chartColor} ${depart}% ${cumul}%`;
        })
        .join(", ")})`
    : "#e2e8f0";

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
      <div
        className="mx-auto grid h-52 w-52 place-items-center rounded-full p-5"
        style={{ background: gradient }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-4xl font-bold text-slate-950">{total}</p>
            <p className="text-sm font-medium text-gray-500">{totalLabel}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {donnees.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                {item.label}
              </span>
              <span className="font-bold text-slate-950">{item.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${item.bar}`}
                style={{
                  width: `${limiterPourcentage((item.value / max) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverageCard({ label, value, helper, icon, tone }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-gray-500">{helper}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ring-1 ring-black/5 ${tone}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, description, onClick, tone = "green" }) {
  const styles = {
    green: "bg-green-50 text-green-700 border-green-100 hover:border-green-300",
    blue: "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300",
    slate: "bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300",
    amber: "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-xl transition group-hover:scale-105 ${styles[tone]}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-gray-500">
          {description}
        </span>
      </span>
    </button>
  );
}

function InsightItem({ label, value, helper, status = "ok" }) {
  const statusStyles = {
    ok: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <p className="font-bold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-5 text-gray-500">{helper}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[status]}`} />
        <span className="font-black text-slate-950">{value}</span>
      </div>
    </div>
  );
}

function NouveauxSportifs({ sportifs, emptyLabel }) {
  if (!sportifs.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
      {sportifs.map((sportif) => {
        const initiale = (sportif.nom || sportif.prenom || "S")
          .charAt(0)
          .toUpperCase();

        return (
          <div
            key={sportif.id}
            className="flex items-center justify-between gap-4 bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 font-bold text-green-700">
                {initiale}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {sportif.nom} {sportif.prenom}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {sportif.email}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              #{sportif.id}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard({ langue = "fr" }) {
  const t = getTraduction(langue);
  const navigate = useNavigate();
  const [statistiques, setStatistiques] = useState({
    totalUtilisateurs: 0,
    totalSportifs: 0,
    totalProgrammes: 0,
    totalExercices: 0,
    totalAffectations: 0,
    sportifsAvecProgramme: 0,
    sportifsSansProgramme: 0,
    nouveauxSportifs: [],
  });

  const chargerDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setStatistiques((statistiquesActuelles) => ({
        ...statistiquesActuelles,
        ...response.data,
        nouveauxSportifs: response.data.nouveauxSportifs || [],
      }));
    } catch (error) {
      console.log("Erreur chargement dashboard", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      chargerDashboard();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const totalGeneral =
    statistiques.totalUtilisateurs +
    statistiques.totalProgrammes +
    statistiques.totalExercices +
    statistiques.totalAffectations;
  const totalSuiviSportifs =
    statistiques.sportifsAvecProgramme + statistiques.sportifsSansProgramme;
  const tauxCouverture = totalSuiviSportifs
    ? (statistiques.sportifsAvecProgramme / totalSuiviSportifs) * 100
    : 0;
  const tauxCouvertureArrondi = Math.round(tauxCouverture);
  const moyenneExercicesParProgramme = statistiques.totalProgrammes
    ? (statistiques.totalExercices / statistiques.totalProgrammes).toFixed(1)
    : "0";
  const affectationsParSportif = statistiques.totalSportifs
    ? (statistiques.totalAffectations / statistiques.totalSportifs).toFixed(1)
    : "0";
  const couvertureStatus =
    tauxCouvertureArrondi >= 80
      ? "ok"
      : tauxCouvertureArrondi >= 50
      ? "warning"
      : "danger";
  const repartitionGlobale = [
    {
      label: t.dashboard.utilisateurs,
      value: statistiques.totalUtilisateurs,
      dot: "bg-green-500",
      bar: "bg-green-500",
      chartColor: "#22c55e",
    },
    {
      label: t.dashboard.programmes,
      value: statistiques.totalProgrammes,
      dot: "bg-blue-500",
      bar: "bg-blue-500",
      chartColor: "#3b82f6",
    },
    {
      label: t.dashboard.exercices,
      value: statistiques.totalExercices,
      dot: "bg-violet-500",
      bar: "bg-violet-500",
      chartColor: "#8b5cf6",
    },
    {
      label: t.dashboard.affectations,
      value: statistiques.totalAffectations,
      dot: "bg-amber-500",
      bar: "bg-amber-500",
      chartColor: "#f59e0b",
    },
  ];
  const repartitionSuivi = [
    {
      label: t.dashboard.sportifsAvecProgramme,
      value: statistiques.sportifsAvecProgramme,
      dot: "bg-green-500",
      bar: "bg-green-500",
      chartColor: "#22c55e",
    },
    {
      label: t.dashboard.sportifsSansProgramme,
      value: statistiques.sportifsSansProgramme,
      dot: "bg-red-500",
      bar: "bg-red-500",
      chartColor: "#ef4444",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        image={programmesIllustration}
        alt="Illustration anime d'un dashboard de coaching sportif"
        eyebrow={t.dashboard.eyebrow}
        title={t.dashboard.title}
        description={t.dashboard.description}
        actionLabel={t.dashboard.refresh}
        actionIcon={<FiRefreshCw />}
        onAction={chargerDashboard}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FiUsers />}
          label={t.dashboard.utilisateurs}
          value={statistiques.totalUtilisateurs}
          helper={t.dashboard.utilisateursHelper}
          color="bg-green-50 text-green-700"
        />

        <StatCard
          icon={<FiClipboard />}
          label={t.dashboard.programmes}
          value={statistiques.totalProgrammes}
          helper={t.dashboard.programmesHelper}
          color="bg-blue-50 text-blue-700"
        />

        <StatCard
          icon={<FiActivity />}
          label={t.dashboard.exercices}
          value={statistiques.totalExercices}
          helper={t.dashboard.exercicesHelper}
          color="bg-slate-100 text-slate-800"
        />

        <StatCard
          icon={<FiLink />}
          label={t.dashboard.affectations}
          value={statistiques.totalAffectations}
          helper={t.dashboard.affectationsHelper}
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CoverageCard
          label={t.dashboard.sportifsAvecProgramme}
          value={statistiques.sportifsAvecProgramme}
          helper={t.dashboard.sportifsAvecProgrammeHelper}
          icon={<FiUserCheck />}
          tone="bg-green-50 text-green-700"
        />
        <CoverageCard
          label={t.dashboard.sportifsSansProgramme}
          value={statistiques.sportifsSansProgramme}
          helper={t.dashboard.sportifsSansProgrammeHelper}
          icon={<FiUserX />}
          tone="bg-red-50 text-red-700"
        />
        <CoverageCard
          label={t.dashboard.coverageRate}
          value={`${tauxCouvertureArrondi}%`}
          helper={t.dashboard.coverageRateHelper
            .replace("{covered}", statistiques.sportifsAvecProgramme)
            .replace("{total}", totalSuiviSportifs)}
          icon={<FiBarChart2 />}
          tone="bg-blue-50 text-blue-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel
          title={t.dashboard.quickActionsTitle}
          description={t.dashboard.quickActionsDescription}
          icon={<FiPlusCircle />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction
              icon={<FiUserCheck />}
              title={t.dashboard.actionAssign}
              description={t.dashboard.actionAssignDesc}
              tone="green"
              onClick={() => navigate("/affectations")}
            />
            <QuickAction
              icon={<FiClipboard />}
              title={t.dashboard.actionProgram}
              description={t.dashboard.actionProgramDesc}
              tone="blue"
              onClick={() => navigate("/programmes")}
            />
            <QuickAction
              icon={<FiActivity />}
              title={t.dashboard.actionExercise}
              description={t.dashboard.actionExerciseDesc}
              tone="amber"
              onClick={() => navigate("/exercices")}
            />
            <QuickAction
              icon={<FiMessageSquare />}
              title={t.dashboard.actionMessage}
              description={t.dashboard.actionMessageDesc}
              tone="slate"
              onClick={() => navigate("/messages")}
            />
          </div>
        </Panel>

        <Panel
          title={t.dashboard.operationalStatusTitle}
          description={t.dashboard.operationalStatusDescription}
          icon={<FiBarChart2 />}
        >
          <div className="space-y-3">
            <InsightItem
              label={t.dashboard.coverageRate}
              value={`${tauxCouvertureArrondi}%`}
              helper={t.dashboard.operationalCoverage
                .replace("{waiting}", statistiques.sportifsSansProgramme)}
              status={couvertureStatus}
            />
            <InsightItem
              label={t.dashboard.exerciseDensity}
              value={moyenneExercicesParProgramme}
              helper={t.dashboard.exerciseDensityHelper}
              status={
                Number(moyenneExercicesParProgramme) >= 4
                  ? "ok"
                  : Number(moyenneExercicesParProgramme) >= 2
                  ? "warning"
                  : "danger"
              }
            />
            <InsightItem
              label={t.dashboard.coverage}
              value={affectationsParSportif}
              helper={t.dashboard.coverageHelper}
              status={
                Number(affectationsParSportif) >= 1
                  ? "ok"
                  : statistiques.totalSportifs
                  ? "danger"
                  : "warning"
              }
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel
          title={t.dashboard.programCoverageTitle}
          description={t.dashboard.programCoverageDescription}
          icon={<FiUserCheck />}
        >
          <DistributionChart
            donnees={repartitionSuivi}
            total={totalSuiviSportifs}
            totalLabel={t.dashboard.total}
          />
        </Panel>

        <Panel
          title={t.dashboard.newAthletesTitle}
          description={t.dashboard.newAthletesDescription}
          icon={<FiUsers />}
        >
          <NouveauxSportifs
            sportifs={statistiques.nouveauxSportifs}
            emptyLabel={t.dashboard.noNewAthletes}
          />
        </Panel>
      </div>

      <Panel
        title={t.dashboard.dashboardPilotage}
        description={t.dashboard.dashboardPilotageDescription}
        icon={<FiBarChart2 />}
      >
        <DistributionChart
          donnees={repartitionGlobale}
          total={totalGeneral}
          totalLabel={t.dashboard.total}
        />
      </Panel>
    </div>
  );
}

export default Dashboard;
