import { 
  BirthType,
  Breed,
  BreedRequest,
  Color, 
  Company, 
  County, 
  DeathReason, 
  DefaultSettingsResults, 
  FlockPrefix, 
  Location, 
  Owner, 
  Premise, 
  RemoveReason, 
  Sex, 
  Species, 
  State,
  TagType,
  TissueSampleContainerType,
  TissueSampleType,
  TissueTest,
  TransferReason,
  Unit,
  UnitRequest,
  WriteNewDefaultParameters,
} from "../../../../database";


let existingDefaults: DefaultSettingsResults[] = [];

export const init = () => {
  // Get important HTML elements
  const form = document.getElementById("defaults-form");
  const existingSettingsDropdown = document.getElementById("existing-settings");

  if (!form || !existingSettingsDropdown) {
    console.error("Form or existing settings dropdown not found!");
    return;
  }

  const createDefaultBtn = document.getElementById("create-default-btn");
  if (createDefaultBtn) {
    createDefaultBtn.addEventListener("click", writeNewDefault);
  }

  const loadDefaultBtn = document.getElementById("load-default-btn");
  if (loadDefaultBtn) {
    loadDefaultBtn.addEventListener("click", loadExistingDefault);
  }

  populateAllDropdowns();

  const speciesSelect = document.getElementById("id_speciesid") as HTMLSelectElement;

  speciesSelect.addEventListener("change", async () => {
    updateBreeds();
  });

  const contactRadio = document.getElementById("select_contact") as HTMLInputElement | null;
  const companyRadio = document.getElementById("select_company") as HTMLInputElement | null;

  if (contactRadio && companyRadio) {
    contactRadio.addEventListener("change", handleOwnerXOR);
    companyRadio.addEventListener("change", handleOwnerXOR);
  } else {
    console.error("Radio buttons for company & contact IDs not found!");
  }

  const farmTagBasedOnEidTitle = "farm_tag_based_on_eid_tag";
  const farmTagBasedOnEidTagDropDown = document.getElementById(farmTagBasedOnEidTitle) as HTMLInputElement | null;

  if (farmTagBasedOnEidTagDropDown) {
    farmTagBasedOnEidTagDropDown.addEventListener("change", handleFarmtagBasedOnEID);
  } else {
    console.error(farmTagBasedOnEidTitle + " dropdown not found!");
  }

  const trichtagAutoIncTitle = "trich_tag_auto_increment";
  const trichtagAutoIncDropDown = document.getElementById(trichtagAutoIncTitle) as HTMLInputElement | null;

  if (trichtagAutoIncDropDown) {
    trichtagAutoIncDropDown.addEventListener("change", handleTrichTagStartingVal);
  } else {
    console.error(trichtagAutoIncTitle + " dropdown not found!");
  }

  connectTagSameColors();

  // handle radio XOR on page startup, otherwise the radio buttons aren't 'XOR'ed
  handleOwnerXOR();
};

/**
 * Populates a dropdown with given terms and allows custom attributes.
 * @param {string} elementId - The ID of the dropdown element to update.
 * @param {Array<{ label: string, id: string, [key: string]: string }>} terms - The options to populate in the dropdown.
 */
const populateDropdown = (
  elementId: string,
  terms: { label: string; id: string; [key: string]: string }[]
) => {
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

  // Populate the dropdown with terms
  terms.forEach((term) => {
    const option = document.createElement("option");
    option.value = term.label.toLowerCase().replace(/\s+/g, "_"); // Format value for internal usage
    option.textContent = term.label; // Display label

    option.setAttribute(`data-database-id`, term.id);

    // Loop through the properties of `term` and set them as data attributes
    Object.keys(term).forEach((key) => {
      if (key !== "label" && key !== "id") {
        option.setAttribute(`data-${key}`, term[key]);
      }
    });

    selectElement.appendChild(option);
  });
};



const selectDropdownOption = (elementId: string, selectedId: number) => {

  // do not handle cases where 0 is the "key"
  if (selectedId === 0) {
    return;
  }

  const selectElement = document.getElementById(elementId) as HTMLSelectElement;

  if (!selectElement) {
    console.warn(`Dropdown with ID "${elementId}" not found.`);
    return;
  }

  const options = selectElement.querySelectorAll("option");

  let found = false;
  options.forEach((option) => {
    if (option.getAttribute("data-database-id") === selectedId.toString()) {
      option.selected = true;
      found = true;
    }
  });

  if (!found) {
    console.warn(`No option with data-database-id="${selectedId}" found in dropdown "${elementId}".`);
  }
};



/**
 * Populates all dropdowns of the page
 */
const populateAllDropdowns = async () => {
  
  populateExistingDefaults();

  // Fetch and sort owners alphabetically by full name
  const ownerInfo: Owner[] = await (window as any).electronAPI.getOwnerInfo();

  // Sort owners alphabetically by full name
  const owners = ownerInfo
    .map((info: Owner) => ({
      label: `${info.firstName} ${info.lastName}`,
      id: info.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

  // Populate dropdowns with the sorted owners list
  populateDropdown("owner_id_contactid", owners);
  populateDropdown("breeder_id_contactid", owners);
  populateDropdown("vet_id_contactid", owners);
  populateDropdown("transfer_reason_id_contactid", owners);


  // Fetch and sort all companies alphabetically by name 
  const companyInfo: Company[] = await (window as any).electronAPI.getCompanyInfo(false);

  const companies = companyInfo
    .map((info: Company) => ({
      label: info.name,
      id: info.id,
      ...(info.registry_id !== undefined && info.registry_id !== null ? { "registry-id": info.registry_id.toString() } : {}) // Include only if registry_id is defined/not null
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  let companyFields = [
    "owner_id_companyid",
    "breeder_id_companyid",
    "lab_id_companyid",
    "transfer_reason_id_companyid"
  ];

  companyFields.forEach((id) => populateDropdown(id, companies));

  // Fetch and sort all registry companies alphabetically by name 
  const registryCompanyInfo: Company[] = await (window as any).electronAPI.getCompanyInfo(true);

  const registryCompanies = registryCompanyInfo
    .map((info: Company) => ({
      label: info.name,
      id: info.id,
      ...(info.registry_id !== undefined && info.registry_id !== null ? { "registry-id": info.registry_id.toString() } : {}) // Include only if registry_id is defined/not null
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  populateDropdown("id_registry_id_companyid", registryCompanies);

  // Premises
  const premiseInfo : Premise[] = await (window as any).electronAPI.getPremiseInfo();

  const premises = premiseInfo.map((info: Premise) => ({
    label: `${info.address} ${info.city}, ${info.postcode}, ${info.country}`, // Full address crafted from DB information
    id: info.id,
  }));

  populateDropdown("owner_id_premiseid", premises);
  populateDropdown("breeder_id_premiseid", premises);
  populateDropdown("vet_id_premiseid", premises);
  populateDropdown("lab_id_premiseid", premises);
  populateDropdown("registry_id_premiseid", premises);

  // True/False inputs
  const tf = [
    { label: "True", id: "1" }, 
    { label: "False", id: "0" }
  ];

  populateDropdown("id_eid_tag_male_color_female_color_same", tf);
  populateDropdown("id_farm_tag_male_color_female_color_same", tf);
  populateDropdown("id_fed_tag_male_color_female_color_same", tf);
  populateDropdown("id_nues_tag_male_color_female_color_same", tf);
  populateDropdown("id_trich_tag_male_color_female_color_same", tf);
  populateDropdown("use_paint_marks", tf);
  populateDropdown("evaluation_update_alert", tf);
  populateDropdown("id_bangs_tag_male_color_female_color_same", tf);
  populateDropdown("id_sale_order_tag_male_color_female_color_same", tf);

  // ensure farm_tag_based_on_eid_tag starts populated to force other dropdowns that are reliant on it to enable/disable input based on the selected value
  populateDropdown("farm_tag_based_on_eid_tag", tf);
  const ftBasedOnEid = document.getElementById("farm_tag_based_on_eid_tag") as HTMLSelectElement;
  if (ftBasedOnEid.options.length > 2) {
    ftBasedOnEid.selectedIndex = 1; // Select the first option (exclude "select an option")
  }
  handleFarmtagBasedOnEID();

  populateDropdown("trich_tag_auto_increment", tf);
  const trichAutoIncDropDown = document.getElementById("trich_tag_auto_increment") as HTMLSelectElement;
  if (trichAutoIncDropDown.options.length > 2) {
    trichAutoIncDropDown.selectedIndex = 1; // Select the first option (exclude "select an option")
  }
  handleTrichTagStartingVal();


  // Counties
  const countyInfo : County[] = await (window as any).electronAPI.getCounties();
  const counties = countyInfo.map((info: County) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_countyid", counties);

  // Colors
  const colorInfo : Color[] = await (window as any).electronAPI.getColors();
  colorInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const colors = colorInfo.map((info: Color) => ({
    label: info.name,
    id: info.id,
  }));
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
  populateDropdown("bangs_tag_color_male", colors);
  populateDropdown("bangs_tag_color_female", colors);
  populateDropdown("sale_order_tag_color_male", colors);
  populateDropdown("sale_order_tag_color_female", colors);

  // Locations
  const locationInfo : Location[] = await (window as any).electronAPI.getLocations();
  locationInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const locations = locationInfo.map((info: Location) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("eid_tag_location", locations);
  populateDropdown("farm_tag_location", locations);
  populateDropdown("fed_tag_location", locations);
  populateDropdown("nues_tag_location", locations);
  populateDropdown("trich_tag_location", locations);
  populateDropdown("paint_mark_location", locations);
  populateDropdown("tattoo_location", locations);
  populateDropdown("freeze_brand_location", locations);
  populateDropdown("bangs_tag_location", locations);
  populateDropdown("sale_order_tag_location", locations);

  // States
  const stateInfo : State[] = await (window as any).electronAPI.getStates();
  stateInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const states = stateInfo.map((info: State) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_stateid", states);

  // Flock Prefixes
  const flockPrefixInfo : FlockPrefix[] = await (window as any).electronAPI.getFlockPrefixes();
  const flockPrefixes = flockPrefixInfo
    .map((info: FlockPrefix) => ({
      label: info.name,
      id: info.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  populateDropdown("id_flockprefixid", flockPrefixes);

  // Species
  const speciesInfo : Species[] = await (window as any).electronAPI.getSpecies();
   
  const species = speciesInfo.map((info: Species) => ({
    label: info.common_name,
    id: info.id,
  }));
  populateDropdown("id_speciesid", species);

  // Sexes
  const sexInfo : Sex[] = await (window as any).electronAPI.getSexes();
  sexInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const sexes = sexInfo.map((info: Sex) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_sexid", sexes);

  // TagTypes
  const tagTypeInfo : TagType[] = await (window as any).electronAPI.getTagTypes();
  tagTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const tagTypes = tagTypeInfo.map((info: TagType) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_idtypeid_primary", tagTypes);
  populateDropdown("id_idtypeid_secondary", tagTypes);
  populateDropdown("id_idtypeid_tertiary", tagTypes);

  // RemoveReasons
  const removeReasonInfo : RemoveReason[] = await (window as any).electronAPI.getRemoveReasons();
  removeReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const removeReasons = removeReasonInfo.map((info: RemoveReason) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_idremovereasonid", removeReasons);

  // TissueSampleTypes
  const tissueSampleTypeInfo : TissueSampleType[] = await (window as any).electronAPI.getTissueSampleTypes();
  tissueSampleTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const tissueSampleTypes = tissueSampleTypeInfo.map((info: TissueSampleType) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_tissuesampletypeid", tissueSampleTypes);

  // TissueSampleContainerTypes
  const tissueSampleContainerTypeInfo : TissueSampleContainerType[] = await (window as any).electronAPI.getTissueSampleContainerTypes();
  tissueSampleContainerTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const tissueSampleContainerTypes = tissueSampleContainerTypeInfo.map((info: TissueSampleContainerType) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_tissuesamplecontainertypeid", tissueSampleContainerTypes);

  // TissueTests
  const tissueTestInfo : TissueTest[] = await (window as any).electronAPI.getTissueTests();
  tissueTestInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const tissueTests = tissueTestInfo.map((info: TissueTest) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_tissuetestid", tissueTests);

  // DeathReaons
  const deathReasonInfo : DeathReason[] = await (window as any).electronAPI.getDeathReasons();
  deathReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const deathReasons = deathReasonInfo.map((info: DeathReason) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_deathreasonid", deathReasons);

  // BirthTypes
  const birthTypeInfo : BirthType[] = await (window as any).electronAPI.getBirthTypes();
  birthTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const birthTypes = birthTypeInfo.map((info: BirthType) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("birth_type", birthTypes);
  populateDropdown("rear_type", birthTypes);

  // TransferReasons
  const transferReasonInfo : TransferReason[] = await (window as any).electronAPI.getTransferReasons();
  transferReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const transferReasons = transferReasonInfo.map((info: TransferReason) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("id_transferreasonid", transferReasons);

  // Weight Units
  const weightUnitsQueryParams: UnitRequest = {
    unit_type_name: "Weight",
    unit_type_id: null,
  } 

  const weightUnitInfo : Unit[] = await (window as any).electronAPI.getUnits(weightUnitsQueryParams);
  weightUnitInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const weightUnits = weightUnitInfo.map((info: Unit) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("birth_weight_id_unitsid", weightUnits);
  populateDropdown("weight_id_unitsid", weightUnits);

  // Currency Units
  const currencyUnitsQueryParams: UnitRequest = {
    unit_type_name: "Currency",
    unit_type_id: null,
  } 

  const currencyUnitInfo : Unit[] = await (window as any).electronAPI.getUnits(currencyUnitsQueryParams);
  currencyUnitInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

  const currencyUnits = currencyUnitInfo.map((info: Unit) => ({
    label: info.name,
    id: info.id,
  }));
  populateDropdown("sale_price_id_unitsid", currencyUnits);
};

/**
 * Populates the existing defaults dropdown with data from the database.
 */
const populateExistingDefaults = async () => {
  existingDefaults = await (window as any).electronAPI.getExistingDefaults();
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

const loadExistingDefault = async () => {
  const selectElement = document.getElementById("existing-settings") as HTMLSelectElement;
  const selectedId = selectElement.value;

  // Find the corresponding object in existingDefaults
  const selectedDefault = existingDefaults.find(setting => parseInt(setting.id) === parseInt(selectedId));

  if (!selectedDefault) {
    console.warn(`No matching default found for ID: ${selectedId}`);
    return;
  }

  const selectedSetting = selectedDefault;

  // populate species first, followed by populating the breed since breed relies on species
  selectDropdownOption("id_speciesid", selectedSetting.id_speciesid);
  await updateBreeds(); // must update the breeds before selecting a new one, since the species may change when loading
  selectDropdownOption("id_breedid", selectedSetting.id_breedid);

  selectDropdownOption("owner_id_contactid", selectedSetting.owner_id_contactid);
  selectDropdownOption("breeder_id_contactid", selectedSetting.breeder_id_contactid);
  selectDropdownOption("vet_id_contactid", selectedSetting.vet_id_contactid);
  selectDropdownOption("transfer_reason_id_contactid", selectedSetting.transfer_reason_id_contactid);
  selectDropdownOption("owner_id_companyid", selectedSetting.owner_id_companyid);
  selectDropdownOption("breeder_id_companyid", selectedSetting.breeder_id_companyid);
  selectDropdownOption("lab_id_companyid", selectedSetting.lab_id_companyid);
  selectDropdownOption("id_registry_id_companyid", selectedSetting.id_registry_id_companyid);
  selectDropdownOption("transfer_reason_id_companyid", selectedSetting.transfer_reason_id_companyid);
  selectDropdownOption("owner_id_premiseid", selectedSetting.owner_id_premiseid);
  selectDropdownOption("breeder_id_premiseid", selectedSetting.breeder_id_premiseid);
  selectDropdownOption("vet_id_premiseid", selectedSetting.vet_id_premiseid);
  selectDropdownOption("lab_id_premiseid", selectedSetting.lab_id_premiseid);
  selectDropdownOption("registry_id_premiseid", selectedSetting.registry_id_premiseid);
  selectDropdownOption("id_eid_tag_male_color_female_color_same", selectedSetting.id_eid_tag_male_color_female_color_same);
  selectDropdownOption("id_farm_tag_male_color_female_color_same", selectedSetting.id_farm_tag_male_color_female_color_same);
  selectDropdownOption("farm_tag_based_on_eid_tag", selectedSetting.farm_tag_based_on_eid_tag);
  selectDropdownOption("id_fed_tag_male_color_female_color_same", selectedSetting.id_fed_tag_male_color_female_color_same);
  selectDropdownOption("id_nues_tag_male_color_female_color_same", selectedSetting.id_nues_tag_male_color_female_color_same);
  selectDropdownOption("id_trich_tag_male_color_female_color_same", selectedSetting.id_trich_tag_male_color_female_color_same);
  selectDropdownOption("trich_tag_auto_increment", selectedSetting.trich_tag_auto_increment);
  selectDropdownOption("use_paint_marks", selectedSetting.use_paint_marks);
  selectDropdownOption("evaluation_update_alert", selectedSetting.evaluation_update_alert);
  selectDropdownOption("id_bangs_tag_male_color_female_color_same", selectedSetting.id_bangs_tag_male_color_female_color_same);
  selectDropdownOption("id_sale_order_tag_male_color_female_color_same", selectedSetting.id_sale_order_tag_male_color_female_color_same);
  selectDropdownOption("id_countyid", selectedSetting.id_countyid);
  selectDropdownOption("eid_tag_color_male", selectedSetting.eid_tag_color_male);
  selectDropdownOption("eid_tag_color_female", selectedSetting.eid_tag_color_female);
  selectDropdownOption("farm_tag_color_male", selectedSetting.farm_tag_color_male);
  selectDropdownOption("farm_tag_color_female", selectedSetting.farm_tag_color_female);
  selectDropdownOption("fed_tag_color_male", selectedSetting.fed_tag_color_male);
  selectDropdownOption("fed_tag_color_female", selectedSetting.fed_tag_color_female);
  selectDropdownOption("nues_tag_color_male", selectedSetting.nues_tag_color_male);
  selectDropdownOption("nues_tag_color_female", selectedSetting.nues_tag_color_female);
  selectDropdownOption("trich_tag_color_male", selectedSetting.trich_tag_color_male);
  selectDropdownOption("trich_tag_color_female", selectedSetting.trich_tag_color_female);
  selectDropdownOption("paint_mark_color", selectedSetting.paint_mark_color);
  selectDropdownOption("tattoo_color", selectedSetting.tattoo_color);
  selectDropdownOption("bangs_tag_color_male", selectedSetting.bangs_tag_color_male);
  selectDropdownOption("bangs_tag_color_female", selectedSetting.bangs_tag_color_female);
  selectDropdownOption("sale_order_tag_color_male", selectedSetting.sale_order_tag_color_male);
  selectDropdownOption("sale_order_tag_color_female", selectedSetting.sale_order_tag_color_female);
  selectDropdownOption("eid_tag_location", selectedSetting.eid_tag_location);
  selectDropdownOption("farm_tag_location", selectedSetting.farm_tag_location);
  selectDropdownOption("fed_tag_location", selectedSetting.fed_tag_location);
  selectDropdownOption("nues_tag_location", selectedSetting.nues_tag_location);
  selectDropdownOption("trich_tag_location", selectedSetting.trich_tag_location);
  selectDropdownOption("paint_mark_location", selectedSetting.paint_mark_location);
  selectDropdownOption("tattoo_location", selectedSetting.tattoo_location);
  selectDropdownOption("freeze_brand_location", selectedSetting.freeze_brand_location);
  selectDropdownOption("bangs_tag_location", selectedSetting.bangs_tag_location);
  selectDropdownOption("sale_order_tag_location", selectedSetting.sale_order_tag_location);
  selectDropdownOption("id_stateid", selectedSetting.id_stateid);
  selectDropdownOption("id_flockprefixid", selectedSetting.id_flockprefixid);
  selectDropdownOption("id_sexid", selectedSetting.id_sexid);
  selectDropdownOption("id_idtypeid_primary", selectedSetting.id_idtypeid_primary);
  selectDropdownOption("id_idtypeid_secondary", selectedSetting.id_idtypeid_secondary);
  selectDropdownOption("id_idtypeid_tertiary", selectedSetting.id_idtypeid_tertiary);
  selectDropdownOption("id_idremovereasonid", selectedSetting.id_idremovereasonid);
  selectDropdownOption("id_tissuesampletypeid", selectedSetting.id_tissuesampletypeid);
  selectDropdownOption("id_tissuesamplecontainertypeid", selectedSetting.id_tissuesamplecontainertypeid);
  selectDropdownOption("id_tissuetestid", selectedSetting.id_tissuetestid);
  selectDropdownOption("id_deathreasonid", selectedSetting.id_deathreasonid);
  selectDropdownOption("birth_type", selectedSetting.birth_type);
  selectDropdownOption("rear_type", selectedSetting.rear_type);
  selectDropdownOption("id_transferreasonid", selectedSetting.id_transferreasonid);
  selectDropdownOption("birth_weight_id_unitsid", selectedSetting.birth_weight_id_unitsid);
  selectDropdownOption("weight_id_unitsid", selectedSetting.weight_id_unitsid);
  selectDropdownOption("sale_price_id_unitsid", selectedSetting.sale_price_id_unitsid);
  return;
}

const writeNewDefault = async () => {

  const currentTimestamp: string = getFormattedTimestamp();

  const contactRadio = document.getElementById("select_contact") as HTMLInputElement | null;

  var contact_id: number = 0;
  var company_id: number = 0;

  if (contactRadio?.checked) {
    contact_id = getSelectedDatabaseId("owner_id_contactid")
  } else {
    company_id = getSelectedDatabaseId("owner_id_companyid")
  }

  // Construct the WriteNewDefaultParameters object
  const formData: WriteNewDefaultParameters = {
    default_settings_name: (document.getElementById("settings_name") as HTMLInputElement).value,

    owner_id_contactid: contact_id,
    owner_id_companyid: company_id,
    owner_id_premiseid: getSelectedDatabaseId("owner_id_premiseid"),

    breeder_id_contactid: getSelectedDatabaseId("breeder_id_contactid"),
    breeder_id_companyid: getSelectedDatabaseId("breeder_id_companyid"),
    breeder_id_premiseid: getSelectedDatabaseId("breeder_id_premiseid"),

    vet_id_contactid: getSelectedDatabaseId("vet_id_contactid"),
    vet_id_premiseid: getSelectedDatabaseId("vet_id_premiseid"),

    lab_id_companyid: getSelectedDatabaseId("lab_id_companyid"),
    lab_id_premiseid: getSelectedDatabaseId("lab_id_premiseid"),

    id_registry_id_companyid: getSelectedDatabaseId("id_registry_id_companyid"),
    registry_id_premiseid: getSelectedDatabaseId("registry_id_premiseid"),

    id_stateid: getSelectedDatabaseId("id_stateid"),
    id_countyid: getSelectedDatabaseId("id_countyid"),
    id_flockprefixid: getSelectedDatabaseId("id_flockprefixid"),
    id_speciesid: getSelectedDatabaseId("id_speciesid"),
    id_breedid: getSelectedDatabaseId("id_breedid"),
    id_sexid: getSelectedDatabaseId("id_sexid"),

    id_idtypeid_primary: getSelectedDatabaseId("id_idtypeid_primary"),
    id_idtypeid_secondary: getSelectedDatabaseId("id_idtypeid_secondary"),
    id_idtypeid_tertiary: getSelectedDatabaseId("id_idtypeid_tertiary"),

    id_eid_tag_male_color_female_color_same: getSelectedDatabaseId("id_eid_tag_male_color_female_color_same"),
    eid_tag_color_male: getSelectedDatabaseId("eid_tag_color_male"),
    eid_tag_color_female: getSelectedDatabaseId("eid_tag_color_female"),
    eid_tag_location: getSelectedDatabaseId("eid_tag_location"),

    id_farm_tag_male_color_female_color_same: getSelectedDatabaseId("id_farm_tag_male_color_female_color_same"),
    farm_tag_based_on_eid_tag: getSelectedDatabaseId("farm_tag_based_on_eid_tag"),
    farm_tag_number_digits_from_eid: getSelectedDatabaseId("farm_tag_number_digits_from_eid"),
    farm_tag_color_male: getSelectedDatabaseId("farm_tag_color_male"),
    farm_tag_color_female: getSelectedDatabaseId("farm_tag_color_female"),
    farm_tag_location: getSelectedDatabaseId("farm_tag_location"),

    id_fed_tag_male_color_female_color_same: getSelectedDatabaseId("id_fed_tag_male_color_female_color_same"),
    fed_tag_color_male: getSelectedDatabaseId("fed_tag_color_male"),
    fed_tag_color_female: getSelectedDatabaseId("fed_tag_color_female"),
    fed_tag_location: getSelectedDatabaseId("fed_tag_location"),

    id_nues_tag_male_color_female_color_same: getSelectedDatabaseId("id_nues_tag_male_color_female_color_same"),
    nues_tag_color_male: getSelectedDatabaseId("nues_tag_color_male"),
    nues_tag_color_female: getSelectedDatabaseId("nues_tag_color_female"),
    nues_tag_location: getSelectedDatabaseId("nues_tag_location"),

    id_trich_tag_male_color_female_color_same: getSelectedDatabaseId("id_trich_tag_male_color_female_color_same"),
    trich_tag_color_male: getSelectedDatabaseId("trich_tag_color_male"),
    trich_tag_color_female: getSelectedDatabaseId("trich_tag_color_female"),
    trich_tag_location: getSelectedDatabaseId("trich_tag_location"),
    trich_tag_auto_increment: getSelectedDatabaseId("trich_tag_auto_increment"),

    use_paint_marks: getSelectedDatabaseId("use_paint_marks"),
    paint_mark_color: getSelectedDatabaseId("paint_mark_color"),
    paint_mark_location: getSelectedDatabaseId("paint_mark_location"),

    tattoo_color: getSelectedDatabaseId("tattoo_color"),
    tattoo_location: getSelectedDatabaseId("tattoo_location"),

    freeze_brand_location: getSelectedDatabaseId("freeze_brand_location"),

    id_idremovereasonid: getSelectedDatabaseId("id_idremovereasonid"),
    id_tissuesampletypeid: getSelectedDatabaseId("id_tissuesampletypeid"),
    id_tissuetestid: getSelectedDatabaseId("id_tissuetestid"),
    id_tissuesamplecontainertypeid: getSelectedDatabaseId("id_tissuesamplecontainertypeid"),

    birth_type: getSelectedDatabaseId("birth_type"),
    rear_type: getSelectedDatabaseId("rear_type"),

    minimum_birth_weight: parseFloat((document.getElementById("minimum_birth_weight") as HTMLInputElement).value) || 0,
    maximum_birth_weight: parseFloat((document.getElementById("maximum_birth_weight") as HTMLInputElement).value) || 0,
    birth_weight_id_unitsid: getSelectedDatabaseId("birth_weight_id_unitsid"),
    weight_id_unitsid: getSelectedDatabaseId("weight_id_unitsid"),
    sale_price_id_unitsid: getSelectedDatabaseId("sale_price_id_unitsid"),

    evaluation_update_alert: getSelectedDatabaseId("evaluation_update_alert"),

    id_bangs_tag_male_color_female_color_same: getSelectedDatabaseId("id_bangs_tag_male_color_female_color_same"),
    bangs_tag_color_male: getSelectedDatabaseId("bangs_tag_color_male"),
    bangs_tag_color_female: getSelectedDatabaseId("bangs_tag_color_female"),
    bangs_tag_location: getSelectedDatabaseId("bangs_tag_location"),
    id_sale_order_tag_male_color_female_color_same: getSelectedDatabaseId("id_sale_order_tag_male_color_female_color_same"),
    sale_order_tag_color_male: getSelectedDatabaseId("sale_order_tag_color_male"),
    sale_order_tag_color_female: getSelectedDatabaseId("sale_order_tag_color_female"),
    sale_order_tag_location: getSelectedDatabaseId("sale_order_tag_location"),
    id_deathreasonid: getSelectedDatabaseId("id_deathreasonid"),

    id_transferreasonid: getSelectedDatabaseId("id_transferreasonid"),
    created: currentTimestamp,
    modified: currentTimestamp,

    death_reason_id_contactid: 0,
    death_reason_id_companyid: 0,
    trich_tag_next_tag_number: 0,
    transfer_reason_id_contactid: 0,
    transfer_reason_id_companyid: 0,
  };

  // Here you would call your API or service to write the default settings to the database
  const success: boolean = await (window as any).electronAPI.writeNewDefaultSettings(formData);

  if (success) {
    console.log("WROTE IT!!");
  } else {
    console.log("Failed to write settings.");
  }

  return;
};

// Function to get the selected option's data-database-id
const getSelectedDatabaseId = (elementId: string): number => {
  const selectElement = document.getElementById(elementId) as HTMLSelectElement;
  if (!selectElement) {
    console.warn(`Dropdown with ID "${elementId}" not found.`);
    return 0;
  }

  const selectedOption = selectElement.options[selectElement.selectedIndex];

  if (selectedOption === null) {
    console.warn(`Unable to get option ${selectElement.selectedIndex} from \"${elementId}\"`);
    return 0;
  }

  const dataId = selectedOption?.getAttribute("data-database-id");
  if (dataId === null) {
    console.warn(`Unable to get key \"data-database-id\" for \"${elementId}\"`);
    return 0;
  }

  return dataId ? parseInt(dataId, 10) || 0 : 0;
};

const getFormattedTimestamp = () => {
  const now = new Date();
  
  // Get individual components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

async function updateBreeds() {
  const breedSelect = document.getElementById("id_breedid") as HTMLSelectElement;

  breedSelect.disabled = false;

  const species_id: string = getSelectedDatabaseId("id_speciesid").toString();

  try {
      const queryParams: BreedRequest = { 
        species_id: species_id, 
      };
      const breedInfo: Breed[] = await (window as any).electronAPI.getBreeds(queryParams);

      breedInfo.sort((a, b) => a.display_order - b.display_order);

      const breeds = breedInfo.map((info) => ({
          label: info.name,
          id: info.id,
      }));

      populateDropdown("id_breedid", breeds);
  } catch (error) {
      console.error("Error fetching breed data:", error);
  }
}

/*
 * Handles allowing the user to choose only a contact or company ID.
 */
function handleOwnerXOR() {
  const contactRadio = document.getElementById("select_contact") as HTMLInputElement | null;
  const companyRadio = document.getElementById("select_company") as HTMLInputElement | null;
  const contactSelect = document.getElementById("owner_id_contactid") as HTMLSelectElement | null;
  const companySelect = document.getElementById("owner_id_companyid") as HTMLSelectElement | null;

  if (!contactRadio || !companyRadio || !contactSelect || !companySelect) {
      console.error("One or more elements are missing!");
      return;
  }

  if (contactRadio.checked) {
      contactSelect.disabled = false;
      companySelect.disabled = true;
      companySelect.value = ""; // Reset company selection
  } else if (companyRadio.checked) {
      companySelect.disabled = false;
      contactSelect.disabled = true;
      contactSelect.value = ""; // Reset contact selection
  } else {
      // If neither is selected, disable both
      contactSelect.disabled = true;
      companySelect.disabled = true;
      contactSelect.value = "";
      companySelect.value = "";
  }
}

function handleFarmtagBasedOnEID() {
  const farmTagBasedOnEidTitle = "farm_tag_based_on_eid_tag";
  const farmTagBasedOnEidTagDropDown = document.getElementById(farmTagBasedOnEidTitle) as HTMLInputElement | null;
  if (!farmTagBasedOnEidTagDropDown) {
    console.error("unable to find HTML element: " + farmTagBasedOnEidTitle);
    return;
  }

  const ftNumDigitsFromEIDTitle = "farm_tag_number_digits_from_eid";
  const ftNumDigitsFromEID = document.getElementById(ftNumDigitsFromEIDTitle) as HTMLInputElement | null;
  if (!ftNumDigitsFromEID) {
    console.error("unable to find HTML element: " + ftNumDigitsFromEIDTitle);
    return;
  }

  if (farmTagBasedOnEidTagDropDown.value == "true") {
    ftNumDigitsFromEID.disabled = false;
    ftNumDigitsFromEID.value = '1'; // default to 1 when set to true 
  } else {
    ftNumDigitsFromEID.disabled = true;
    ftNumDigitsFromEID.value = ''; // Clear the value of the field, since it is disabled
  }
}

function handleTrichTagStartingVal() {

  const trichTagAutoIncTitle = "trich_tag_auto_increment";
  const trichTagAutoIncDropDown = document.getElementById(trichTagAutoIncTitle) as HTMLInputElement | null;
  if (!trichTagAutoIncDropDown) {
    console.error("unable to find HTML element: " + trichTagAutoIncTitle);
    return;
  }

  const trichTagStartingValTitle = "trich_tag_starting_value";
  const trichTagStartingValDropDown = document.getElementById(trichTagStartingValTitle) as HTMLInputElement | null;
  if (!trichTagStartingValDropDown) {
    console.error("unable to find HTML element: " + trichTagStartingValTitle);
    return;
  }

  if (trichTagAutoIncDropDown.value == "true") {
    trichTagStartingValDropDown.disabled = false;
    trichTagStartingValDropDown.value = '1'; // default to 1 when set to true 
  } else {
    trichTagStartingValDropDown.disabled = true;
    trichTagStartingValDropDown.value = ''; // Clear the value of the field, since it is disabled
  }
}

function connectTagSameColors() {
  ////////////////////////////////////////////////////////////////
  // handle "male/female tag color same" dropdown functionality //
  ////////////////////////////////////////////////////////////////
  
  ////////////////////////////////////////////////////////////////
  // eid tag
  const eidTagSameColorTitle : string = "id_eid_tag_male_color_female_color_same";
  const eidTagColorMaleTitle : string = "eid_tag_color_male";
  const eidTagColorFemaleTitle : string = "eid_tag_color_female";
  const eidTagSameColorDropdown = document.getElementById(eidTagSameColorTitle) as HTMLInputElement | null;
  const eidTagMaleDropdown = document.getElementById(eidTagColorMaleTitle) as HTMLInputElement | null;
  const eidTagFemaleDropdown = document.getElementById(eidTagColorFemaleTitle) as HTMLInputElement | null;

  if (eidTagSameColorDropdown) {
    eidTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(eidTagSameColorTitle, eidTagColorMaleTitle, eidTagColorFemaleTitle));
  } else {
    console.error(eidTagSameColorTitle + " dropdown not found!");
  }

  if (eidTagMaleDropdown) {
    eidTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(eidTagSameColorTitle, eidTagColorMaleTitle, eidTagColorFemaleTitle));
  } else {
    console.error(eidTagSameColorTitle + " dropdown not found!");
  }

  if (eidTagFemaleDropdown) {
    eidTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(eidTagSameColorTitle, eidTagColorMaleTitle, eidTagColorFemaleTitle));
  } else {
    console.error(eidTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // farm tag
  const farmTagSameColorTitle : string = "id_farm_tag_male_color_female_color_same";
  const farmTagColorMaleTitle : string = "farm_tag_color_male";
  const farmTagColorFemaleTitle : string = "farm_tag_color_female";
  const farmTagSameColorDropdown = document.getElementById(farmTagSameColorTitle) as HTMLInputElement | null;
  const farmTagMaleDropdown = document.getElementById(farmTagColorMaleTitle) as HTMLInputElement | null;
  const farmTagFemaleDropdown = document.getElementById(farmTagColorFemaleTitle) as HTMLInputElement | null;

  if (farmTagSameColorDropdown) {
    farmTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(farmTagSameColorTitle, farmTagColorMaleTitle, farmTagColorFemaleTitle));
  } else {
    console.error(farmTagSameColorTitle + " dropdown not found!");
  }

  if (farmTagMaleDropdown) {
    farmTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(farmTagSameColorTitle, farmTagColorMaleTitle, farmTagColorFemaleTitle));
  } else {
    console.error(farmTagSameColorTitle + " dropdown not found!");
  }

  if (farmTagFemaleDropdown) {
    farmTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(farmTagSameColorTitle, farmTagColorMaleTitle, farmTagColorFemaleTitle));
  } else {
    console.error(farmTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // federal tag
  const fedTagSameColorTitle : string = "id_fed_tag_male_color_female_color_same";
  const fedTagColorMaleTitle : string = "fed_tag_color_male";
  const fedTagColorFemaleTitle : string = "fed_tag_color_female";
  const fedTagSameColorDropdown = document.getElementById(fedTagSameColorTitle) as HTMLInputElement | null;
  const fedTagMaleDropdown = document.getElementById(fedTagColorMaleTitle) as HTMLInputElement | null;
  const fedTagFemaleDropdown = document.getElementById(fedTagColorFemaleTitle) as HTMLInputElement | null;

  if (fedTagSameColorDropdown) {
    fedTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(fedTagSameColorTitle, fedTagColorMaleTitle, fedTagColorFemaleTitle));
  } else {
    console.error(fedTagSameColorTitle + " dropdown not found!");
  }

  if (fedTagMaleDropdown) {
    fedTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(fedTagSameColorTitle, fedTagColorMaleTitle, fedTagColorFemaleTitle));
  } else {
    console.error(fedTagSameColorTitle + " dropdown not found!");
  }

  if (fedTagFemaleDropdown) {
    fedTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(fedTagSameColorTitle, fedTagColorMaleTitle, fedTagColorFemaleTitle));
  } else {
    console.error(fedTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // NUES tag
  const nuesTagSameColorTitle : string = "id_nues_tag_male_color_female_color_same";
  const nuesTagColorMaleTitle : string = "nues_tag_color_male";
  const nuesTagColorFemaleTitle : string = "nues_tag_color_female";
  const nuesTagSameColorDropdown = document.getElementById(nuesTagSameColorTitle) as HTMLInputElement | null;
  const nuesTagMaleDropdown = document.getElementById(nuesTagColorMaleTitle) as HTMLInputElement | null;
  const nuesTagFemaleDropdown = document.getElementById(nuesTagColorFemaleTitle) as HTMLInputElement | null;

  if (nuesTagSameColorDropdown) {
    nuesTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(nuesTagSameColorTitle, nuesTagColorMaleTitle, nuesTagColorFemaleTitle));
  } else {
    console.error(nuesTagSameColorTitle + " dropdown not found!");
  }

  if (nuesTagMaleDropdown) {
    nuesTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(nuesTagSameColorTitle, nuesTagColorMaleTitle, nuesTagColorFemaleTitle));
  } else {
    console.error(nuesTagSameColorTitle + " dropdown not found!");
  }

  if (nuesTagFemaleDropdown) {
    nuesTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(nuesTagSameColorTitle, nuesTagColorMaleTitle, nuesTagColorFemaleTitle));
  } else {
    console.error(nuesTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // Trich tag
  const trichTagSameColorTitle : string = "id_trich_tag_male_color_female_color_same";
  const trichTagColorMaleTitle : string = "trich_tag_color_male";
  const trichTagColorFemaleTitle : string = "trich_tag_color_female";
  const trichTagSameColorDropdown = document.getElementById(trichTagSameColorTitle) as HTMLInputElement | null;
  const trichTagMaleDropdown = document.getElementById(trichTagColorMaleTitle) as HTMLInputElement | null;
  const trichTagFemaleDropdown = document.getElementById(trichTagColorFemaleTitle) as HTMLInputElement | null;

  if (trichTagSameColorDropdown) {
    trichTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(trichTagSameColorTitle, trichTagColorMaleTitle, trichTagColorFemaleTitle));
  } else {
    console.error(eidTagSameColorTitle + " dropdown not found!");
  }

  if (trichTagMaleDropdown) {
    trichTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(trichTagSameColorTitle, trichTagColorMaleTitle, trichTagColorFemaleTitle));
  } else {
    console.error(trichTagSameColorTitle + " dropdown not found!");
  }

  if (trichTagFemaleDropdown) {
    trichTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(trichTagSameColorTitle, trichTagColorMaleTitle, trichTagColorFemaleTitle));
  } else {
    console.error(trichTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // Bangs tag
  const bangsTagSameColorTitle : string = "id_bangs_tag_male_color_female_color_same";
  const bangsTagColorMaleTitle : string = "bangs_tag_color_male";
  const bangsTagColorFemaleTitle : string = "bangs_tag_color_female";
  const bangsTagSameColorDropdown = document.getElementById(bangsTagSameColorTitle) as HTMLInputElement | null;
  const bangsTagMaleDropdown = document.getElementById(bangsTagColorMaleTitle) as HTMLInputElement | null;
  const bangsTagFemaleDropdown = document.getElementById(bangsTagColorFemaleTitle) as HTMLInputElement | null;

  if (bangsTagSameColorDropdown) {
    bangsTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(bangsTagSameColorTitle, bangsTagColorMaleTitle, bangsTagColorFemaleTitle));
  } else {
    console.error(bangsTagSameColorTitle + " dropdown not found!");
  }

  if (bangsTagMaleDropdown) {
    bangsTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(bangsTagSameColorTitle, bangsTagColorMaleTitle, bangsTagColorFemaleTitle));
  } else {
    console.error(bangsTagSameColorTitle + " dropdown not found!");
  }

  if (bangsTagFemaleDropdown) {
    bangsTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(bangsTagSameColorTitle, bangsTagColorMaleTitle, bangsTagColorFemaleTitle));
  } else {
    console.error(bangsTagSameColorTitle + " dropdown not found!");
  }

  ////////////////////////////////////////////////////////////////
  // sale order tag
  const saleOrderTagSameColorTitle : string = "id_sale_order_tag_male_color_female_color_same";
  const saleOrderTagColorMaleTitle : string = "sale_order_tag_color_male";
  const saleOrderTagColorFemaleTitle : string = "sale_order_tag_color_female";
  const saleOrderTagSameColorDropdown = document.getElementById(saleOrderTagSameColorTitle) as HTMLInputElement | null;
  const saleOrderTagMaleDropdown = document.getElementById(saleOrderTagColorMaleTitle) as HTMLInputElement | null;
  const saleOrderTagFemaleDropdown = document.getElementById(saleOrderTagColorFemaleTitle) as HTMLInputElement | null;

  if (saleOrderTagSameColorDropdown) {
    saleOrderTagSameColorDropdown.addEventListener("change", (_) => handleTagSameColor(saleOrderTagSameColorTitle, saleOrderTagColorMaleTitle, saleOrderTagColorFemaleTitle));
  } else {
    console.error(saleOrderTagSameColorTitle + " dropdown not found!");
  }

  if (saleOrderTagMaleDropdown) {
    saleOrderTagMaleDropdown.addEventListener("change", (_) => handleTagSameColor(saleOrderTagSameColorTitle, saleOrderTagColorMaleTitle, saleOrderTagColorFemaleTitle));
  } else {
    console.error(saleOrderTagSameColorTitle + " dropdown not found!");
  }

  if (saleOrderTagFemaleDropdown) {
    saleOrderTagFemaleDropdown.addEventListener("change", (_) => handleTagSameColor(saleOrderTagSameColorTitle, saleOrderTagColorMaleTitle, saleOrderTagColorFemaleTitle));
  } else {
    console.error(saleOrderTagSameColorTitle + " dropdown not found!");
  }
}

function handleTagSameColor(sameDropdownId : string, maleDropdownId : string, femaleDropdownId: string) {

  const sameColorDropdown = document.getElementById(sameDropdownId) as HTMLSelectElement | null;
  if (!sameColorDropdown) {
    console.error("unable to find HTML element: " + sameDropdownId);
    return;
  }

  const maleDropdown = document.getElementById(maleDropdownId) as HTMLSelectElement | null;
  if (!maleDropdown) {
    console.error("unable to find HTML element: " + maleDropdownId);
    return;
  }

  const femaleDropdown = document.getElementById(femaleDropdownId) as HTMLSelectElement | null;
  if (!femaleDropdown) {
    console.error("unable to find HTML element: " + femaleDropdownId);
    return;
  }

  if (sameColorDropdown.value == "false") {
    femaleDropdown.disabled = false;
    return; 
  } else if (sameColorDropdown.value == "true") {
    femaleDropdown.disabled = true;
    femaleDropdown.selectedIndex = maleDropdown.selectedIndex;
    return;
  }

  // if neither true or false, then dont do anything (for example, if the option is "select an option...")
}
