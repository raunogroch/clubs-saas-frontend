interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const PaginationTable = ({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center gap-2">
      <small>
        Página {page} de {totalPages} {total && `— Total ${total}`}
      </small>
      <div className="d-flex align-items-center" style={{ gap: "0.3rem" }}>
        <button
          className="btn btn-sm btn-primary"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <i className="fa fa-chevron-left"></i> Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`btn btn-sm ${page === num ? "btn-warning" : "btn-light"}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="btn btn-sm btn-primary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Proximo <i className="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
