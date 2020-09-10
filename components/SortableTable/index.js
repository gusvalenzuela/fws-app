import React, { useState, useMemo, useContext } from "react";

const useSortableData = (
  items,
  config = {
    key: "name",
    direction: "ascending",
  }
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aProperty = a[sortConfig.key];
        let bProperty = b[sortConfig.key];

        if (typeof aProperty === "string") {
          if (aProperty.toLowerCase() < bProperty.toLowerCase()) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aProperty.toLowerCase() > bProperty.toLowerCase()) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        if (aProperty < bProperty) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aProperty > bProperty) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { data: sortedItems, requestSort, sortConfig };
};

const SortableTable = () => {
  const { users } = useContext([]);

  const { data, requestSort, sortConfig } = useSortableData(users);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <>
      <style jsx>
        {`
          table {
            width: 100%;
            border-collapse: collapse;
          }
          .wow {
            background: var(--main-bg);
          }

          .table-responsive {
            max-height: 500px;
          }

          thead th {
            text-align: left;
            border-bottom: 2px solid black;
            /* width: 100%; */
          }

          thead button {
            text-align: left;
            display: inline-block;
            border: 0;
            font-family: inherit;
            font-weight: 700;
            font-size: inherit;
            padding: 0.5em 0.25rem;
            margin-bottom: 1px;
            width: 100%;
          }
          thead button:focus {
            outline: none !important;
          }
          thead button.ascending:enabled,
          thead button.descending:enabled {
            background: #aaaaaa;
            outline: none !important;
          }

          thead button.ascending::after {
            content: "🔽";
            margin-left: 0.5rem;
          }

          thead button.descending::after {
            content: "🔼";
            margin-left: 0.5rem;
          }

          tbody td {
            padding: 0.25em;
            text-align: left;
            min-width: 120px;
            border-bottom: 1px solid #ccc;
          }

          tbody tr:hover {
            background-color: #eee;
          }
        `}
      </style>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("name")}
                  className={getClassNamesFor("name")}
                >
                  FIRST
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("last_name")}
                  className={getClassNamesFor("last_name")}
                >
                  LAST
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("title")}
                  className={getClassNamesFor("title")}
                >
                  TITLE
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort("email")}
                  className={getClassNamesFor("email")}
                >
                  EMAIL
                </button>
              </th>

              <th>
                <button
                  type="button"
                  onClick={() => requestSort("city")}
                  className={getClassNamesFor("city")}
                >
                  LOCATION
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td className={"searchOption" === "first_name" ? "wow" : ""}>
                  {user.name}
                </td>
                {/* <td className={"searchOption" === "first_name" ? "wow" : ""}>
                  {user.name}
                </td> */}
                {/* <td className={searchOption === "last_name" ? "wow" : ""}>
                {user.last_name}
              </td>
              <td className={searchOption === "title" ? "wow" : ""}>
                {user.title}
              </td>
              <td className={searchOption === "email" ? "wow" : ""}>
                {user.email}
              </td>
              <td
                className={
                  searchOption === "city" || searchOption === "state"
                    ? "wow"
                    : ""
                }
              >
                {user.city}, {employee.state}
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SortableTable;
