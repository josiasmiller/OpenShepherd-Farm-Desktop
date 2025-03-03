import { 
  ColorInfo, 
  CompanyInfo, 
  CountyInfo, 
  FlockPrefixInfo, 
  LocationInfo, 
  OwnerInfo, 
  PremiseInfo, 
  SpeciesInfo, 
  StateInfo,
} from "../../../../database";

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
  populateDropdown("id_registry_id_companyid", companies);

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
  populateDropdown("registry_id_premiseid", premises);

  // True/False inputs
  const tf : string[] = ["True", "False"];
  populateDropdown("id_eid_tag_male_color_female_color_same", tf);
  populateDropdown("id_farm_tag_male_color_female_color_same", tf);
  populateDropdown("farm_tag_based_on_eid_tag", tf);
  populateDropdown("id_fed_tag_male_color_female_color_same", tf);
  populateDropdown("id_nues_tag_male_color_female_color_same", tf);
  populateDropdown("id_trich_tag_male_color_female_color_same", tf);
  populateDropdown("trich_tag_auto_increment", tf);
  populateDropdown("use_paint_marks", tf);
  populateDropdown("evaluation_update_alert", tf);

  // Counties
  const countyInfo : CountyInfo[] = await (window as any).electronAPI.getCounties();
  let counties : string[] = []; 
  countyInfo.forEach((info : CountyInfo) => {
    counties.push(info.name);
  });
  populateDropdown("id_countyid", counties);

  // Colors
  const colorInfo : ColorInfo[] = await (window as any).electronAPI.getColors();
  colorInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let colors : string[] = []; 
  colorInfo.forEach((info : ColorInfo) => {
    colors.push(info.name);
  });
  populateDropdown("eid_tag_color_male", colors);
  populateDropdown("eid_tag_color_female", colors);
  populateDropdown("farm_tag_color_male", colors);
  populateDropdown("farm_tag_color_female", colors);
  populateDropdown("fed_tag_color_male", colors);
  populateDropdown("fed_tag_color_female", colors);
  populateDropdown("nues_tag_color_male", colors);
  populateDropdown("nues_tag_color_female", colors);
  populateDropdown("trich_tag_color_male", colors);
  populateDropdown("trich_tag_color_female", colors);
  populateDropdown("paint_mark_color", colors);
  populateDropdown("tattoo_color", colors);

  // Locations
  const locationInfo : LocationInfo[] = await (window as any).electronAPI.getLocations();
  locationInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let locations : string[] = []; 
  locationInfo.forEach((info : LocationInfo) => {
    locations.push(info.name);
  });
  populateDropdown("eid_tag_location", locations);
  populateDropdown("farm_tag_location", locations);
  populateDropdown("fed_tag_location", locations);
  populateDropdown("nues_tag_location", locations);
  populateDropdown("trich_tag_location", locations);
  populateDropdown("paint_mark_location", locations);
  populateDropdown("tattoo_location", locations);
  populateDropdown("freeze_brand_location", locations);

  // States
  const stateInfo : StateInfo[] = await (window as any).electronAPI.getStates();
  stateInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let states : string[] = []; 
  stateInfo.forEach((info : StateInfo) => {
    states.push(info.name);
  });
  populateDropdown("id_stateid", states);

  // Flock Prefixes
  const flockPrefixInfo : FlockPrefixInfo[] = await (window as any).electronAPI.getFlockPrefixes();
  const flockPrefixes: string[] = flockPrefixInfo
    .map(info => info.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  populateDropdown("id_flockprefixid", flockPrefixes);

  // Species
  const speciesInfo : SpeciesInfo[] = await (window as any).electronAPI.getSpecies();
  let species : string[] = []; 
  speciesInfo.forEach((info : SpeciesInfo) => {
    species.push(info.common_name);
  });
  populateDropdown("id_speciesid", species);
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