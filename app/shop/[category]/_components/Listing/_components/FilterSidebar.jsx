import React from "react";

const FilterSidebar = ({
  subCategoriesData,
  selectedSubCatIds,
  handleToggleCategory,
  openMenus,
  toggleMenu,
  styles,
}) => {
  // Render Categories Recursive Helper (UI)
  function renderCategoriesRecursive(levels) {
    if (!levels || !Array.isArray(levels) || levels.length === 0) return null;

    return levels.map((item) => {
      const children = [...(item.level2 || []), ...(item.level3 || [])];
      const hasChildren = children.length > 0;
      const itemId = item.id;

      if (hasChildren) {
        return (
          <div
            key={item.id}
            className={styles.FilterBox}
            style={{ border: "none", padding: "0", marginTop: "10px" }}
          >
            <div
              className={styles.FilterHeader}
              onClick={() => toggleMenu(item.id)}
            >
              <h5 style={{ fontSize: "14px", color: "#6e736a" }}>
                {item.name}
              </h5>
              {openMenus[item.id] ? (
                <span style={{ fontSize: "12px" }}>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-0.000177827 8.48503L3.77106 4.7138L-0.000178165 0.942561L0.942631 -0.000248161L4.71387 3.77099L8.4851 -0.000248161L9.42791 0.942561L5.65668 4.7138L9.42791 8.48503L8.4851 9.42784L4.71387 5.65661L0.942631 9.42784L-0.000177827 8.48503Z"
                      fill="#6E736A"
                    />
                  </svg>
                </span>
              ) : (
                <span style={{ fontSize: "12px" }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.33333 12V6.66667H0V5.33333H5.33333V0H6.66667V5.33333H12V6.66667H6.66667V12H5.33333Z"
                      fill="#6E736A"
                    />
                  </svg>
                </span>
              )}
            </div>
            <div
              className={`${styles.AnimatedBox} ${
                openMenus[item.id] ? styles.open : ""
              }`}
            >
              <div
                className={styles.FilterOptions}
                style={{ marginTop: "8px", paddingLeft: "10px" }}
              >
                {renderCategoriesRecursive(children)}
              </div>
            </div>
          </div>
        );
      }

      return (
        <label key={item.id}>
          <input
            type="checkbox"
            checked={selectedSubCatIds.includes(itemId)}
            onChange={() => handleToggleCategory(itemId)}
          />
          {item.name}
        </label>
      );
    });
  }

  return (
    <div
      className={styles.LeftBottom}
      style={{ gap: "0px", display: "flex", flexDirection: "column" }}
    >
      {subCategoriesData?.level1?.map((item) => {
        const children = [...(item.level2 || []), ...(item.level3 || [])];
        const itemId = item.id;

        return (
          <div key={item.id} className={styles.FilterBox}>
            <div
              className={styles.FilterHeader}
              onClick={() => toggleMenu(item.id)}
            >
              <h5>{item.name}</h5>
              {openMenus[item.id] ? (
                <span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M-0.000177827 8.48503L3.77106 4.7138L-0.000178165 0.942561L0.942631 -0.000248161L4.71387 3.77099L8.4851 -0.000248161L9.42791 0.942561L5.65668 4.7138L9.42791 8.48503L8.4851 9.42784L4.71387 5.65661L0.942631 9.42784L-0.000177827 8.48503Z"
                      fill="#6E736A"
                    />
                  </svg>
                </span>
              ) : (
                <span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.33333 12V6.66667H0V5.33333H5.33333V0H6.66667V5.33333H12V6.66667H6.66667V12H5.33333Z"
                      fill="#6E736A"
                    />
                  </svg>
                </span>
              )}
            </div>
            <div
              className={`${styles.AnimatedBox} ${
                openMenus[item.id] ? styles.open : ""
              }`}
            >
              <div className={styles.FilterOptions}>
                {children.length > 0 ? (
                  renderCategoriesRecursive(children)
                ) : (
                  // If level 1 has no children, it acts as its own checkbox
                  <label key={item.slug}>
                    <input
                      type="checkbox"
                      checked={selectedSubCatIds.includes(itemId)}
                      onChange={() => handleToggleCategory(itemId)}
                    />
                    {item.name}
                  </label>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilterSidebar;
