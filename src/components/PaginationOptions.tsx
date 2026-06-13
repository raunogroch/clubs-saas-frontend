interface PaginationOptionsProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (page: number) => void;
}
const pageSizeOptions = [5, 10, 20, 50, 100];

export const PaginationOptions = (props: PaginationOptionsProps) => {
  return (
    <div className="d-flex align-items-center gap-2 pagination-options-container">
      <label htmlFor="pageSizeSelect" className="mb-0">
        <small>Registros:</small>
      </label>
      <select
        id="pageSizeSelect"
        className="form-control form-control-sm pagination-select"
        value={props.pageSize}
        onChange={(e) => {
          props.setPageSize(Number(e.target.value));
          props.setPage(1);
        }}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};
