function PageHero({
  image,
  alt,
  eyebrow,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
}) {
  return (
    <section className="relative min-h-[250px] overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl shadow-slate-300/40">
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(34,197,94,0.24),transparent_18rem),linear-gradient(105deg,#020617_0%,rgba(15,23,42,0.96)_42%,rgba(15,23,42,0.52)_70%,rgba(15,23,42,0.14)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-green-300 via-cyan-300 to-transparent" />
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-slate-950/45 to-transparent" />

      <div className="relative flex min-h-[250px] max-w-2xl flex-col justify-center p-6 text-white sm:p-8">
        <p className="w-fit rounded-full border border-green-300/20 bg-green-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-200">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
          {description}
        </p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
          >
            {actionIcon}
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}

export default PageHero;
