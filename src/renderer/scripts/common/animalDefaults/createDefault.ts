import { 
  BirthTypeInfo,
  BreedInfo,
  ColorInfo, 
  CompanyInfo, 
  CountyInfo, 
  DeathReasonInfo, 
  FlockPrefixInfo, 
  LocationInfo, 
  OwnerInfo, 
  PremiseInfo, 
  RemoveReasonInfo, 
  SexInfo, 
  SpeciesInfo, 
  StateInfo,
  TagTypeInfo,
  TissueSampleContainerTypeInfo,
  TissueSampleTypeInfo,
  TissueTestInfo,
  TransferReasonInfo,
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

  // Fetch and sort owners alphabetically by full name
  const ownerInfo: OwnerInfo[] = await (window as any).electronAPI.getOwnerInfo();
  const owners: string[] = ownerInfo
    .map(info => `${info.firstName} ${info.lastName}`)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  let contactFields = ["owner_id_contactid", "breeder_id_contactid", "vet_id_contactid", "transfer_reason_id_contactid", "death_reason_id_contactid"];
  contactFields.forEach(id => populateDropdown(id, owners));

  // Fetch and sort companies alphabetically by name
  const companyInfo: CompanyInfo[] = await (window as any).electronAPI.getCompanyInfo();
  const companies: string[] = companyInfo
    .map(info => info.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  let companyFields = ["owner_id_companyid", "breeder_id_companyid", "lab_id_companyid", "id_registry_id_companyid", "transfer_reason_id_companyid", "death_reason_id_companyid"];
  companyFields.forEach(id => populateDropdown(id, companies));

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

  // Breeds
  const breedInfo : BreedInfo[] = await (window as any).electronAPI.getBreeds();
  breedInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let breeds : string[] = []; 
  breedInfo.forEach((info : BreedInfo) => {
    breeds.push(info.name);
  });
  populateDropdown("id_breedid", breeds);

  // Sexes
  const sexInfo : SexInfo[] = await (window as any).electronAPI.getSexes();
  sexInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let sexes : string[] = []; 
  sexInfo.forEach((info : SexInfo) => {
    sexes.push(info.name);
  });
  populateDropdown("id_sexid", sexes);

  // TagTypes
  const tagTypeInfo : TagTypeInfo[] = await (window as any).electronAPI.getTagTypes();
  tagTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let tagTypes : string[] = []; 
  tagTypeInfo.forEach((info : TagTypeInfo) => {
    tagTypes.push(info.name);
  });
  populateDropdown("id_idtypeid_primary", tagTypes);
  populateDropdown("id_idtypeid_secondary", tagTypes);
  populateDropdown("id_idtypeid_tertiary", tagTypes);

  // RemoveReasons
  const removeReasonInfo : RemoveReasonInfo[] = await (window as any).electronAPI.getRemoveReasons();
  removeReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let removeReasons : string[] = []; 
  removeReasonInfo.forEach((info : RemoveReasonInfo) => {
    removeReasons.push(info.name);
  });
  populateDropdown("id_idremovereasonid", removeReasons);

  // TissueSampleTypes
  const tissueSampleTypeInfo : TissueSampleTypeInfo[] = await (window as any).electronAPI.getTissueSampleTypes();
  tissueSampleTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let tissueSampleTypes : string[] = []; 
  tissueSampleTypeInfo.forEach((info : TissueSampleTypeInfo) => {
    tissueSampleTypes.push(info.name);
  });
  populateDropdown("id_tissuesampletypeid", tissueSampleTypes);

  // TissueSampleContainerTypes
  const tissueSampleContainerTypeInfo : TissueSampleContainerTypeInfo[] = await (window as any).electronAPI.getTissueSampleContainerTypes();
  tissueSampleContainerTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let tissueSampleContainerTypes : string[] = []; 
  tissueSampleContainerTypeInfo.forEach((info : TissueSampleContainerTypeInfo) => {
    tissueSampleContainerTypes.push(info.name);
  });
  populateDropdown("id_tissuesamplecontainertypeid", tissueSampleContainerTypes);

  // TissueTests
  const tissueTestInfo : TissueTestInfo[] = await (window as any).electronAPI.getTissueTests();
  tissueTestInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let tissueTests : string[] = []; 
  tissueTestInfo.forEach((info : TissueTestInfo) => {
    tissueTests.push(info.name);
  });
  populateDropdown("id_tissuetestid", tissueTests);

  // DeathReaons
  const deathReasonInfo : DeathReasonInfo[] = await (window as any).electronAPI.getDeathReasons();
  deathReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let deathReasons : string[] = []; 
  deathReasonInfo.forEach((info : DeathReasonInfo) => {
    deathReasons.push(info.name);
  });
  populateDropdown("id_deathreasonid", deathReasons);

  // BirthTypes
  const birthTypeInfo : BirthTypeInfo[] = await (window as any).electronAPI.getBirthTypes();
  birthTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let birthTypes : string[] = []; 
  birthTypeInfo.forEach((info : BirthTypeInfo) => {
    birthTypes.push(info.name);
  });
  populateDropdown("birth_type", birthTypes);
  populateDropdown("rear_type", birthTypes);

  // TransferReasons
  const transferReasonInfo : TransferReasonInfo[] = await (window as any).electronAPI.getTransferReasons();
  transferReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  let transferReasons : string[] = []; 
  transferReasonInfo.forEach((info : TransferReasonInfo) => {
    transferReasons.push(info.name);
  });
  populateDropdown("id_transferreasonid", transferReasons);
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