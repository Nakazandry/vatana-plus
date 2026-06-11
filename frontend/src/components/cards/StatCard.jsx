function StatCard({ icon, label, value, helper, color }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/70 bg-white/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-400 via-cyan-300 to-transparent opacity-90" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-green-400/10 blur-2xl transition group-hover:bg-cyan-400/10" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black leading-none text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl shadow-sm ring-1 ring-black/5 transition group-hover:scale-105 ${color}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <p className="text-sm font-medium text-gray-500">{helper}</p>
      </div>
    </div>
  );
}

export default StatCard;
