import { CompanyInfo, OwnerInfo, PremiseInfo } from "../../../../database";

export const init = () => {
  console.log("Create Default Schema Page loaded");

  // Get important HTML elements
  const form = document.getElementById("defaults-form");
  const existingSettingsDropdown = document.getElementById("existing-settings");

  if (!form || !existingSettingsDropdown) {
    console.error("Form or existing settings dropdown not found!");
    return;
  }

  populateAllDropdowns();

  // Populate dropdowns with sample data (this will be implemented in another merge request)
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
};

/**
 * Populates all dropdowns of the page
 */
const populateAllDropdowns = async () => {
  
  populateExistingDefaults();

  // Owners
  const ownerInfo : OwnerInfo[] = await (window as any).electronAPI.getOwnerInfo();
  let owners : string[] = []; 
  ownerInfo.forEach((info : OwnerInfo) =>{
    let name = info.firstName + " " + info.lastName;
    owners.push(name);
  });
  populateDropdown("owner_id_contactid", owners);
  populateDropdown("breeder_id_contactid", owners);
  populateDropdown("vet_id_contactid", owners);

  // Companies
  const companyInfo : CompanyInfo[] = await (window as any).electronAPI.getCompanyInfo();
  let companies : string[] = []; 
  companyInfo.forEach((info : CompanyInfo) =>{
    companies.push(info.name);
  });
  populateDropdown("owner_id_companyid", companies);
  populateDropdown("breeder_id_companyid", companies);
  populateDropdown("lab_id_companyid", companies);

  // Premises
  const premiseInfo : PremiseInfo[] = await (window as any).electronAPI.getPremiseInfo();
  let premises : string[] = []; 
  premiseInfo.forEach((info : PremiseInfo) =>{
    let premiseName = info.address + " " + info.city + ", " + info.postcode + ", " + info.country;
    premises.push(premiseName);
  });
  populateDropdown("owner_id_premiseid", premises);
  populateDropdown("breeder_id_premiseid", premises);
  populateDropdown("vet_id_premiseid", premises);
  populateDropdown("lab_id_premiseid", premises);

};

/**
 * Populates the existing defaults dropdown with data from the database.
 */
const populateExistingDefaults = async () => {
  const existingDefaults = await (window as any).electronAPI.getExistingDefaults();
  const selectElement = document.getElementById("existing-settings") as HTMLSelectElement;

  // Clear previous options (except the placeholder)
  selectElement.innerHTML = `<option value="" disabled selected>Select a setting...</option>`;

  // Populate the dropdown with fetched results
  existingDefaults.forEach((setting: { id: string; name: string }) => {
    const option = document.createElement("option");
    option.value = setting.id;
    option.textContent = setting.name;
    selectElement.appendChild(option);
  });
};