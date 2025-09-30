import { api } from "../../../main.js";
import { getPageState } from "./getPageState.js";

/**
 * Initialise the filter and search form controls on the graveyard page.
 *
 * - Reads current page state from the URL (order, orderBy, limit, query, types).
 * - Populates the form inputs with those values.
 * - Fetches the list of available types from the API and builds checkboxes for them.
 * - Marks any checkboxes as checked if they match the current state.
 *
 * @async
 * @function setupGraveyardForms
 * @returns {Promise<void>} Resolves when the form elements are populated.
 *
 * @example
 * import { setupGraveyardForms } from "../components/features/graveyard/index.js";
 * setupGraveyardForms();
 */
export async function setupGraveyardForms() {
  let { order, orderBy, types, limit, query } = getPageState();
  const orderSelector = document.querySelector("#order-selector");
  orderSelector.value = order;
  const orderBySelector = document.querySelector("#orderby-selector");
  orderBySelector.value = orderBy;
  const limitSelector = document.querySelector("#limit-selector");
  limitSelector.value = limit;
  const typesCheckboxes = document.querySelector("#types");
  const searchForm = document.getElementById("search-form");
  searchForm.query.value = query;

  const typesRes = await api.getAllTypes();
  let typesArray = [];
  if (typesRes.success) {
    typesArray = typesRes.data;
  }

  typesArray.forEach((type) => {
    const label = document.createElement("label");
    label.setAttribute("for", `type-${type.id}`);
    label.style.display = "block"; // if you want each on a new line

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "types";
    checkbox.value = type.id;
    checkbox.id = `type-${type.id}`;

    const selectTypes = types.split(",");
    if (selectTypes.includes(`${type.id}`)) {
      checkbox.checked = true;
    }

    label.appendChild(checkbox);
    label.append(` ${type.name}`);
    typesCheckboxes.appendChild(label);
  });
}
