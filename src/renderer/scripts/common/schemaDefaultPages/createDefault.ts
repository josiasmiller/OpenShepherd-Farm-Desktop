export const init = () => {
  console.log("Create Default Schema Page loaded");

  // Get important HTML elements
  const form = document.getElementById("defaults-form");
  const existingSettingsDropdown = document.getElementById("existing-settings");

  if (!form || !existingSettingsDropdown) {
    console.error("Form or existing settings dropdown not found!");
    return;
  }

  console.log("Form and dropdowns initialized.");

  // Populate dropdowns with sample data (Replace with real data fetching)
  populateDropdown("existing-settings", ["Default 1", "Default 2", "Default 3"]);
  populateDropdown("id_stateid", ["California", "Texas", "New York"]);
  populateDropdown("id_countyid", ["Los Angeles County", "Harris County", "Cook County"]);
  populateDropdown("id_speciesid", ["Cattle", "Sheep", "Goat"]);
};

/**
 * Populates a dropdown with given terms.
 * @param {string} elementId - The ID of the dropdown element to update.
 * @param {Array<string>} terms - The options to populate in the dropdown.
 */
const populateDropdown = (elementId: string, terms: string[]) => {
  const selectElement = document.getElementById(elementId);

  if (!selectElement) {
    console.warn(`Dropdown with ID "${elementId}" not found.`);
    return;
  }

  // Clear any existing options
  selectElement.innerHTML = "";

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Select an option...";
  selectElement.appendChild(defaultOption);

  // Populate the dropdown
  terms.forEach((term: string) => {
    const option = document.createElement("option");
    option.value = term.toLowerCase().replace(/\s+/g, "_"); // Format as lowercase with underscores
    option.textContent = term;
    selectElement.appendChild(option);
  });

  console.log(`Dropdown "${elementId}" populated with options:`, terms);
};
