import { useSearch } from "../core/context/SearchContext";

export const NavHeaderSearch = () => {
  const { searchValue, setSearchValue } = useSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className=" navbar-form-custom form-group">
      <input
        type="text"
        placeholder="Escribe para buscar..."
        className="form-control"
        name="top-search"
        id="top-search"
        value={searchValue}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
};
