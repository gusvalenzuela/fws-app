import React, { useContext } from "react";
import "./style.css";
import EmployeeContext from "../../utils/EmployeeContext";

function SearchForm() {
  const {
    handleSearchChange,
    search,
    searchOption,
    filter,
    handleSelectChange,
    handleFilterClick,
    handleClear,
    employees,
  } = useContext(EmployeeContext);
  const alphaCharacters = `abcdefghijklmnopqrstuvwxyz`.toUpperCase();
  let currentSearchOption = searchOption.split(`_`).join(` `);
  return (
    <div className="mb-3 px-2">
      {/* search rows  */}
      <div className="form-group row">
        <div className="col-md-auto pr-0 text-center">
          <label htmlFor="search-by">Search in</label>
          <select
            name="search-options"
            id="search-by"
            onChange={handleSelectChange}
          >
            <option value="first_name">FIRST NAME</option>
            <option value="last_name">LAST NAME</option>
            <option value="email">EMAIL</option>
            <option value="title">TITLE</option>
            <option value="city">CITY</option>
            <option value="state">STATE</option>
          </select>
          for:
        </div>
        <div className="col-md-8 pr-0">
          <input
            autoComplete="off"
            value={search}
            onChange={handleSearchChange}
            name="term"
            type="search"
            className="form-controol"
            placeholder="Type here to begin search"
            id="term"
          />
        </div>
      </div>

      {/* filter rows  */}

      <div className="row justify-content-center">
        <div className="col-12">
          Or filter {currentSearchOption.toUpperCase()} by:
        </div>
        <div
          className="col-12"
          id="alpha-filter-list"
          onClick={handleFilterClick}
        >
          {alphaCharacters.split(``).map((char) => (
            <button
              className={char === filter ? `active-filter` : ``}
              value={char}
              key={char}
            >
              {char}
            </button>
          ))}
        </div>
        <div className="mt-2 col-6">
          <button key="clearbtn" onClick={handleClear}>
            clear search/filter
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchForm;
