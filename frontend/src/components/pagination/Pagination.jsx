function Pagination({ pageActuelle, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPages(pageActuelle, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Page <span className="font-bold text-slate-900">{pageActuelle}</span> sur{" "}
        <span className="font-bold text-slate-900">{totalPages}</span> —{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span> élément
        {totalItems > 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pageActuelle === 1}
          onClick={() => onPageChange(Math.max(1, pageActuelle - 1))}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:text-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Précédent
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`h-10 w-10 rounded-lg text-sm font-bold shadow-sm transition hover:-translate-y-0.5 ${
              page === pageActuelle
                ? "bg-green-600 text-white shadow-green-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={pageActuelle === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, pageActuelle + 1))}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:text-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

function getPages(pageActuelle, totalPages) {
  const pages = [];

  const debut = Math.max(1, pageActuelle - 2);
  const fin = Math.min(totalPages, pageActuelle + 2);

  for (let i = debut; i <= fin; i++) {
    pages.push(i);
  }

  return pages;
}

export default Pagination;
