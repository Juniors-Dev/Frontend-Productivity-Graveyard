import { api } from "../../../main.js";
import { getPageState } from "./getPageState.js";

/**
 * Initialise the filter + search form controls on the graveyard page.
 * Populates selects, search box and type checkboxes from the current URL state.
 */
export async function setupGraveyardForms() {
  const { order, orderBy, types, limit, query } = getPageState();

  // Populate selects
  const orderSel = document.querySelector("#order-selector");
  if (orderSel) orderSel.value = order;

  const orderBySel = document.querySelector("#orderby-selector");
  if (orderBySel) orderBySel.value = orderBy;

  const limitSel = document.querySelector("#limit-selector");
  if (limitSel) limitSel.value = limit;

  // Populate search box
  const searchForm = document.getElementById("search-form");
  if (searchForm?.query) searchForm.query.value = query;

  // Populate type checkboxes
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

      if (types.split(",").includes(String(type.id))) {
        label.querySelector("input").checked = true;
      }

      dropdownMenu.appendChild(label);
    });
  }
}
