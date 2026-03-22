import Link from "next/link";

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  basePath: string;
};

export default function Pagination({ page, total, limit, basePath }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href={`${basePath}?page=${prev}`}
          className={`rounded-lg border px-3 py-1.5 ${page === 1 ? "pointer-events-none opacity-50" : "border-slate-200 text-slate-600"}`}
        >
          Prev
        </Link>
        <Link
          href={`${basePath}?page=${next}`}
          className={`rounded-lg border px-3 py-1.5 ${page === totalPages ? "pointer-events-none opacity-50" : "border-slate-200 text-slate-600"}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
