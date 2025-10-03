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

  const orderSel = document.querySelector("#order-selector");
  if (orderSel) orderSel.value = order;

  const orderBySel = document.querySelector("#orderby-selector");
  if (orderBySel) orderBySel.value = orderBy;

  const limitSel = document.querySelector("#limit-selector");
  if (limitSel) limitSel.value = limit;
  document.getElementById("search-form").query.value = query;

  const typesRes = await api.getAllTypes();
  if (typesRes.success && typesRes.data) {
    const dropdownMenu = document.getElementById("categoryDropdownMenu");
    dropdownMenu.innerHTML = "";

    typesRes.data.forEach((type) => {
      const label = document.createElement("label");
      label.className = "dropdown-checkbox-label";
      label.innerHTML = `
        <input type="checkbox" value="${type.id}" name="types" class="dropdown-checkbox" />
        ${type.name}
      `;

      // pre-check any saved filters
      if (types.split(",").includes(String(type.id))) {
        label.querySelector("input").checked = true;
      }

      dropdownMenu.appendChild(label);
    });
  }
}
