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
  OwnerType,
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

import { Result, handleResult } from "../../../../shared/results/resultTypes.js";


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

  /////////////////////////////////////////////
  // handle XOR for contact/company on owners
  const contactRadioId : string = "select_contact";
  const companyRadioId : string = "select_company";
  const contactSelectId : string = "owner_id_contactid";
  const companySelectId : string = "owner_id_companyid";

  const ownerContactRadio = document.getElementById(contactRadioId) as HTMLInputElement | null;
  const ownerCompanyRadio = document.getElementById(companyRadioId) as HTMLInputElement | null;

  if (ownerContactRadio && ownerCompanyRadio) {
    ownerContactRadio.addEventListener("change", (_) => {
      handleOwnerXOR(contactRadioId, companyRadioId, contactSelectId, companySelectId);
    });
    ownerCompanyRadio.addEventListener("change", (_) => {
      handleOwnerXOR(contactRadioId, companyRadioId, contactSelectId, companySelectId);
    });
    // update fields on page startup
    handleOwnerXOR(contactRadioId, companyRadioId, contactSelectId, companySelectId);
  } else {
    console.error("Radio buttons for company & contact IDs not found!");
  }

  ///////////////////////////////////////////////////
  // handle XOR for breeder contact/company fields
  const breederContactRadioId : string = "breeder_select_contact";
  const breederCompanyRadioId : string = "breeder_select_company";
  const breederContactSelectId : string = "breeder_id_contactid";
  const breederCompanySelectId : string = "breeder_id_companyid";

  const breederContactRadio = document.getElementById(breederContactRadioId) as HTMLInputElement | null;
  const breederCompanyRadio = document.getElementById(breederCompanyRadioId) as HTMLInputElement | null;

  if (breederContactRadio && breederCompanyRadio) {
    breederContactRadio.addEventListener("change", (_) => {
      handleOwnerXOR(breederContactRadioId, breederCompanyRadioId, breederContactSelectId, breederCompanySelectId);
    });
    breederCompanyRadio.addEventListener("change", (_) => {
      handleOwnerXOR(breederContactRadioId, breederCompanyRadioId, breederContactSelectId, breederCompanySelectId);
    });
    // update fields on page startup
    handleOwnerXOR(breederContactRadioId, breederCompanyRadioId, breederContactSelectId, breederCompanySelectId);
  } else {
    console.error("Radio buttons for breeder company & contact IDs not found!");
  }

  ///////////////////////////////////////////////////
  // handle XOR for breeder contact/company fields
  const transferReasonContactRadioId : string = "transfer_reason_select_contact";
  const transferReasonCompanyRadioId : string = "transfer_reason_select_company";
  const transferReasonContactSelectId : string = "transfer_reason_id_contactid";
  const transferReasonCompanySelectId : string = "transfer_reason_id_companyid";

  const transferReasonContactRadio = document.getElementById(transferReasonContactRadioId) as HTMLInputElement | null;
  const transferReasonCompanyRadio = document.getElementById(transferReasonCompanyRadioId) as HTMLInputElement | null;

  if (transferReasonContactRadio && transferReasonCompanyRadio) {
    transferReasonContactRadio.addEventListener("change", (_) => {
      handleOwnerXOR(transferReasonContactRadioId, transferReasonCompanyRadioId, transferReasonContactSelectId, transferReasonCompanySelectId);
    });
    transferReasonCompanyRadio.addEventListener("change", (_) => {
      handleOwnerXOR(transferReasonContactRadioId, transferReasonCompanyRadioId, transferReasonContactSelectId, transferReasonCompanySelectId);
    });
    // update fields on page startup
    handleOwnerXOR(transferReasonContactRadioId, transferReasonCompanyRadioId, transferReasonContactSelectId, transferReasonCompanySelectId);
  } else {
    console.error("Radio buttons for transfer reason company & contact IDs not found!");
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



const selectDropdownOption = (elementId: string, selectedId: string) => {

  // do not handle cases where 0 is the "key"
  if (selectedId == "0") {
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

  // fetch owners
  const ownerResult: Result<Owner[], string> = await (window as any).electronAPI.getOwnerInfo();

  // Handle the result using handleResult
  handleResult(ownerResult, {
    success: (ownerInfo) => {
      // Sort owners alphabetically by full name (first + last name)
      const owners = ownerInfo
        .map((info: Owner) => ({
          label: `${info.firstName} ${info.lastName}`,
          id: info.id
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

      // Populate the dropdowns with the sorted owners list
      populateDropdown("owner_id_contactid", owners);
      populateDropdown("breeder_id_contactid", owners);
      populateDropdown("vet_id_contactid", owners);
      populateDropdown("transfer_reason_id_contactid", owners);
    },
    error: (errorMessage) => {
      console.error("Failed to fetch owners:", errorMessage);
      alert("There was an error fetching owner information.");
    }
  });


  // Fetch and sort all companies alphabetically by name 
  const companyResult: Result<Company[], string> = await (window as any).electronAPI.getCompanyInfo(false);

  // Handle the result of the API call using handleResult
  handleResult(companyResult, {
    success: (companyInfo) => {
      // Process the companies when the result is successful
      const companies = companyInfo
        .map((info: Company) => ({
          label: info.name,
          id: info.id,
          ...(info.registry_id !== undefined && info.registry_id !== null 
            ? { "registry-id": info.registry_id.toString() } 
            : {}) // Include only if registry_id is defined/not null
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
  
      // List of fields to populate dropdowns
      let companyFields = [
        "owner_id_companyid",
        "breeder_id_companyid",
        "lab_id_companyid",
        "transfer_reason_id_companyid"
      ];
  
      // Populate each dropdown with the sorted companies
      companyFields.forEach((id) => populateDropdown(id, companies));
    },
    error: (error) => {
      console.error("Failed to fetch companies:", error);
      alert("There was an error fetching companies.");
    }
  });

  // Fetch and sort all registry companies alphabetically by name 
  const registryCompanyResult: Result<Company[], string> = await (window as any).electronAPI.getCompanyInfo(true);

  // Handle the result of the API call using handleResult
  handleResult(registryCompanyResult, {
    success: (registryCompanyInfo) => {
      // Process the registry companies when the result is successful
      const registryCompanies = registryCompanyInfo
        .map((info: Company) => ({
          label: info.name,
          id: info.id,
          ...(info.registry_id !== undefined && info.registry_id !== null 
            ? { "registry-id": info.registry_id.toString() } 
            : {}) // Include only if registry_id is defined/not null
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
  
      // Populate the dropdown for registry companies
      populateDropdown("id_registry_id_companyid", registryCompanies);
    },
    error: (error) => {
      console.error("Failed to fetch registry companies:", error);
      alert("There was an error fetching registry companies.");
    }
  });

  // Premises
  const premiseResult: Result<Premise[], string> = await (window as any).electronAPI.getPremiseInfo();

  // Handle the result using handleResult
  handleResult(premiseResult, {
    success: (data) => {
      // Process successful premises data
      const premises = data.map((info: Premise) => ({
        label: `${info.address} ${info.city}, ${info.postcode}, ${info.country}`, // Full address crafted from DB information
        id: info.id,
      }));

      // Populate the dropdowns with the premises data
      populateDropdown("owner_id_premiseid", premises);
      populateDropdown("breeder_id_premiseid", premises);
      populateDropdown("vet_id_premiseid", premises);
      populateDropdown("lab_id_premiseid", premises);
      populateDropdown("registry_id_premiseid", premises);
    },
    error: (error) => {
      console.error("Failed to fetch premises:", error);
      alert("There was an error fetching premises.");
    }
  });

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
  const result: Result<County[], string> = await (window as any).electronAPI.getCounties();

  handleResult(result, {
    success: (data) => {
      const counties = data.map((info: County) => ({
        label: info.name,
        id: info.id,
      }));
      populateDropdown("id_countyid", counties);
    },
    error: (error) => {
      console.error("Failed to fetch counties:", error);
      alert("There was an error fetching county information.");
    }
  });

  // Colors
  const colorResult: Result<Color[], string> = await (window as any).electronAPI.getColors();

  // Handle the result using handleResult
  handleResult(colorResult, {
    success: (data) => {
      // Sort the colors by display order
      data.sort((a, b) => a.display_order - b.display_order);

      // Map the data to the format required by the dropdowns
      const colors = data.map((info: Color) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate dropdowns with the sorted color data
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
    },
    error: (error) => {
      console.error("Failed to fetch colors:", error);
      alert("There was an error fetching color information.");
    }
  });


  // Locations
  const locationResult: Result<Location[], string> = await (window as any).electronAPI.getLocations();

  // Handle the result
  handleResult(locationResult, {
    success: (data) => {
      // Sort the locations by display order
      data.sort((a, b) => a.display_order - b.display_order);

      // Map the locations into the format required by the dropdowns
      const locations = data.map((info: Location) => ({
        label: info.name, // Use the location name for display
        id: info.id,      // Use the location id for the value
      }));

      // Populate dropdowns with the sorted location data
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
    },
    error: (error) => {
      console.error("Failed to fetch locations:", error);
      alert("There was an error fetching tag location information.");
    }
  });

  // States
  const stateResult: Result<State[], string> = await (window as any).electronAPI.getStates();

  // Handle the result with success and error callbacks
  handleResult(stateResult, {
    success: (data) => {
      // Sort the states by display order
      data.sort((a, b) => a.display_order - b.display_order);

      // Map the states to the desired dropdown format
      const states = data.map((info: State) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the states
      populateDropdown("id_stateid", states);
    },
    error: (error) => {
      console.error("Failed to fetch states:", error);
      alert("There was an error fetching state information.");
    }
  });

  // Flock Prefixes
  const flockPrefixResult : Result<FlockPrefix[], string> = await (window as any).electronAPI.getFlockPrefixes();

  // Handle the result using handleResult
  handleResult(flockPrefixResult, {
    success: (flockPrefixInfo: FlockPrefix[]) => {
      // Map the flock prefix data and sort by label
      const flockPrefixes = flockPrefixInfo
        .map((info: FlockPrefix) => ({
          label: info.name,
          id: info.id
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

      // Populate the dropdown with sorted flock prefixes
      populateDropdown("id_flockprefixid", flockPrefixes);
    },
    error: (error: string) => {
      console.error("Failed to fetch flock prefixes:", error);
      alert("There was an error fetching flock prefixes.");
    }
  });

  // Species
  const speciesResult : Result<Species[], string> = await (window as any).electronAPI.getSpecies();

  // Handle the result using handleResult
  handleResult(speciesResult, {
    success: (speciesInfo: Species[]) => {
      // Sort the species by common_name or another attribute, if needed
      const species = speciesInfo
        .map((info: Species) => ({
          label: info.common_name,
          id: info.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

      // Populate the dropdown with the sorted species
      populateDropdown("id_speciesid", species);
    },
    error: (error: string) => {
      // Handle the error (e.g., show an alert or log it)
      alert(`Failed to fetch Species: ${error}`);
      console.error("Error fetching species:", error);
    }
  });

  // Sexes
  const sexResult : Result<Sex[], string> = await (window as any).electronAPI.getSexes();

  // Use handleResult to handle success or failure
  handleResult(sexResult, {
    success: (sexes: Sex[]) => {
      // Sort the sexes by display_order
      sexes.sort((a, b) => a.display_order - b.display_order);

      // Map to the format needed for the dropdown
      const sexOptions = sexes.map((sex: Sex) => ({
        label: sex.name,
        id: sex.id,
      }));

      // Populate the dropdown with the sorted data
      populateDropdown("id_sexid", sexOptions);
    },
    error: (error: string) => {
      console.error("Failed to fetch sexes:", error);
      alert("There was an error fetching sex information.");
    }
  });

  // Fetch TagTypes
  const tagTypeResult = await (window as any).electronAPI.getTagTypes();

  // Handle the result using handleResult
  handleResult(tagTypeResult, {
    success: (tagTypeInfo : TagType[]) => {
      // Sort TagTypes by display order
      tagTypeInfo.sort((a: TagType, b: TagType) => a.display_order - b.display_order); // sort by display order

      const tagTypes = tagTypeInfo.map((info: TagType) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate dropdowns with the sorted TagTypes list
      populateDropdown("id_idtypeid_primary", tagTypes);
      populateDropdown("id_idtypeid_secondary", tagTypes);
      populateDropdown("id_idtypeid_tertiary", tagTypes);
    },
    error: (error) => {
      console.error("Failed to fetch tag types:", error);
    },
  });

  // Remove Reasons
  const removeReasonResult: Result<RemoveReason[], string> = await (window as any).electronAPI.getRemoveReasons();

  // Handle the result
  handleResult(removeReasonResult, {
    success: (data) => {
      // Sort the remove reasons by display order
      data.sort((a, b) => a.display_order - b.display_order);

      // Map the data to create the dropdown options
      const removeReasons = data.map((info: RemoveReason) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the sorted remove reasons
      populateDropdown("id_idremovereasonid", removeReasons);
    },
    error: (error) => {
      console.error("Failed to fetch remove reasons:", error);
      alert("There was an error fetching Id Remove Reasons.");
    }
  });


  // TissueSampleTypes
  const tissueSampleTypeResult = await (window as any).electronAPI.getTissueSampleTypes();

  // Handle the result using handleResult
  handleResult(tissueSampleTypeResult, {
    success: (tissueSampleTypeInfo: TissueSampleType[]) => {
      // Sort the result by display_order
      tissueSampleTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

      const tissueSampleTypes = tissueSampleTypeInfo.map((info: TissueSampleType) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate dropdown with the sorted data
      populateDropdown("id_tissuesampletypeid", tissueSampleTypes);
    },
    error: (error: string) => {
      console.error("Failed to fetch Tissue Sample Types:", error);
      alert("There was an error fetching tissue sample types.");
    }
  });


  // TissueSampleContainerTypes
  const tissueSampleContainerTypeResult: Result<TissueSampleContainerType[], string> = await (window as any).electronAPI.getTissueSampleContainerTypes();

  // Handle the result using handleResult
  handleResult(tissueSampleContainerTypeResult, {
    success: (tissueSampleContainerTypeInfo) => {
      // Sort the result by display_order
      tissueSampleContainerTypeInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

      const tissueSampleContainerTypes = tissueSampleContainerTypeInfo.map((info: TissueSampleContainerType) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate dropdown with the sorted data
      populateDropdown("id_tissuesamplecontainertypeid", tissueSampleContainerTypes);
    },
    error: (error) => {
      console.error("Failed to fetch Tissue Sample Container Types:", error);
      alert("There was an error fetching tissue sample container types.");
    }
  });


  // TissueTests
  const tissueTestResult: Result<TissueTest[], string> = await (window as any).electronAPI.getTissueTests();

  // Handle the result using handleResult
  handleResult(tissueTestResult, {
    success: (tissueTestInfo: TissueTest[]) => {
      // Sort the tissue test info by display_order
      tissueTestInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

      // Map the tissue test info to a format suitable for populating the dropdown
      const tissueTests = tissueTestInfo.map((info: TissueTest) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the sorted tissue tests
      populateDropdown("id_tissuetestid", tissueTests);
    },
    error: (error: string) => {
      console.error("Failed to fetch Tissue Tests:", error);
      alert("There was an error fetching tissue test results.");
    }
  });

  // death reasons
  const deathReasonResult: Result<DeathReason[], string> = await (window as any).electronAPI.getDeathReasons();

  // Handle the result with success and error handlers
  handleResult(deathReasonResult, {
    success: (deathReasonInfo: DeathReason[]) => {
      // Sort the result by display_order
      deathReasonInfo.sort((a, b) => a.display_order - b.display_order);

      // Map the result to a format suitable for populating the dropdown
      const deathReasons = deathReasonInfo.map((info: DeathReason) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the sorted data
      populateDropdown("id_deathreasonid", deathReasons);
    },
    error: (error: string) => {
      console.error("Failed to fetch Death Reasons:", error);
      alert("There was an error fetching death reasons.");    
    }
  });

  // BirthTypes
  const birthTypeResult: Result<BirthType[], string> = await (window as any).electronAPI.getBirthTypes();

  // Handle the result using handleResult
  handleResult(birthTypeResult, {
    success: (birthTypeInfo: BirthType[]) => {
      // Sort the result by display_order
      birthTypeInfo.sort((a, b) => a.display_order - b.display_order);

      // Map the result to a format suitable for populating the dropdown
      const birthTypes = birthTypeInfo.map((info: BirthType) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the sorted data
      populateDropdown("birth_type", birthTypes);
      populateDropdown("rear_type", birthTypes);
    },
    error: (error: string) => {
      console.error("Failed to fetch Birth Types:", error);
      alert("There was an error fetching birth types.");  
    }
  });


  // TransferReasons
  const transferReasonResult: Result<TransferReason[], string> = await (window as any).electronAPI.getTransferReasons();

  // Handle the result using handleResult
  handleResult(transferReasonResult, {
    success: (transferReasonInfo: TransferReason[]) => {
      // Sort the transfer reason info by display_order
      transferReasonInfo.sort((a, b) => a.display_order - b.display_order); // sort by display order

      // Map the result to a format suitable for populating the dropdown
      const transferReasons = transferReasonInfo.map((info: TransferReason) => ({
        label: info.name,
        id: info.id,
      }));

      // Populate the dropdown with the transfer reasons
      populateDropdown("id_transferreasonid", transferReasons);
    },
    error: (error: string) => {
      console.error("Failed to fetch Transfer Reasons:", error);
      alert("There was an error fetching Transfer Reasons.");  
    }
  });


  // Weight Units
  try {
    const weightUnitsQueryParams: UnitRequest = {
      unit_type_name: "Weight",
      unit_type_id: null,
    };

    // Fetch weight units with the given query params
    const dbResponse = await (window as any).electronAPI.getUnits(weightUnitsQueryParams);

    // Handle success or failure
    handleResult(dbResponse, {
      success: (weightUnitInfo: Unit[]) => {
        // Sort by display order if the result is successful
        weightUnitInfo.sort((a, b) => a.display_order - b.display_order);

        // Map the units to the format required for the dropdown
        const weightUnits = weightUnitInfo.map((info: Unit) => ({
          label: info.name,
          id: info.id,
        }));

        // Populate the dropdowns with the weight units
        populateDropdown("birth_weight_id_unitsid", weightUnits);
        populateDropdown("weight_id_unitsid", weightUnits);
      },
      error: (error: string) => {
        console.error("Error fetching weight units:", error);
        alert("There was an error fetching weight units.");
      },
    });
  } catch (error) {
    console.error("Unexpected error fetching weight units:", error);
  }


  // Currency Units
  const currencyUnitsQueryParams: UnitRequest = {
    unit_type_name: "Currency",
    unit_type_id: null,
  };

  try {
    // Fetch currency units with the given query params
    const dbResponse = await (window as any).electronAPI.getUnits(currencyUnitsQueryParams);

    // Handle success or failure
    handleResult(dbResponse, {
      success: (currencyUnitInfo: Unit[]) => {
        // Sort by display order if the result is successful
        currencyUnitInfo.sort((a, b) => a.display_order - b.display_order);

        // Map the units to the format required for the dropdown
        const currencyUnits = currencyUnitInfo.map((info: Unit) => ({
          label: info.name,
          id: info.id,
        }));

        // Populate the dropdown with the currency units
        populateDropdown("sale_price_id_unitsid", currencyUnits);
      },
      error: (error: string) => {
        console.error("Error fetching currency units:", error);
        alert("There was an error fetching currency units.");
      },
    });
  } catch (error) {
    console.error("Unexpected error fetching currency units:", error);
  }

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
  if (selectedSetting.id_speciesid) {
    selectDropdownOption("id_speciesid", selectedSetting.id_speciesid);
  }
  await updateBreeds(); // must update the breeds before selecting a new one, since the species may change when loading

  if (selectedSetting.id_breedid) {
    selectDropdownOption("id_breedid", selectedSetting.id_breedid);
  }

  ///////////////////////////////////////////////////
  const contactRadioId : string = "select_contact";
  const companyRadioId : string = "select_company";
  const contactSelectId : string = "owner_id_contactid";
  const companySelectId : string = "owner_id_companyid";

  const ownerContactRadio = document.getElementById(contactRadioId) as HTMLInputElement | null;
  const ownerCompanyRadio = document.getElementById(companyRadioId) as HTMLInputElement | null;
  const ownerContactSelect = document.getElementById(contactSelectId) as HTMLSelectElement | null;
  const ownerCompanySelect = document.getElementById(companySelectId) as HTMLSelectElement | null;

  if (!ownerContactRadio || !ownerCompanyRadio || !ownerContactSelect || !ownerCompanySelect) {
    console.error("One or more elements are missing!");
    return;
  }

  if (selectedSetting.owner_type === OwnerType.CONTACT) {
    selectDropdownOption("owner_id_contactid", selectedSetting.owner_id);
    ownerContactRadio.checked = true;
    ownerCompanyRadio.checked = false;
    ownerContactSelect.disabled = false;
    ownerCompanySelect.disabled = true;
    ownerCompanySelect.value = "";

  } else if (selectedSetting.owner_type === OwnerType.COMPANY) {
    selectDropdownOption("owner_id_companyid", selectedSetting.owner_id);
    ownerContactRadio.checked = false;
    ownerCompanyRadio.checked = true;
    ownerContactSelect.disabled = true;
    ownerCompanySelect.disabled = false;
    ownerContactSelect.value = "";
  }

  /////////////////////////////////////////////////////////////////////////////
  const breederContactRadioId : string = "breeder_select_contact";
  const breederCompanyRadioId : string = "breeder_select_company";
  const breederContactSelectId : string = "breeder_id_contactid";
  const breederCompanySelectId : string = "breeder_id_companyid";

  const contactRadio = document.getElementById(breederContactRadioId) as HTMLInputElement | null;
  const companyRadio = document.getElementById(breederCompanyRadioId) as HTMLInputElement | null;
  const contactSelect = document.getElementById(breederContactSelectId) as HTMLSelectElement | null;
  const companySelect = document.getElementById(breederCompanySelectId) as HTMLSelectElement | null;

  if (!contactRadio || !companyRadio || !contactSelect || !companySelect) {
    console.error("One or more elements are missing!");
    return;
  }

  if (selectedSetting.breederType === OwnerType.CONTACT) {
    selectDropdownOption("breeder_id_contactid", selectedSetting.breederId);
    contactRadio.checked = true;
    companyRadio.checked = false;
    contactSelect.disabled = false;
    companySelect.disabled = true;
    companySelect.value = "";

  } else if (selectedSetting.breederType === OwnerType.COMPANY) {
    selectDropdownOption("breeder_id_companyid", selectedSetting.breederId);
    contactRadio.checked = false;
    companyRadio.checked = true;
    contactSelect.disabled = true;
    companySelect.disabled = false;
    contactSelect.value = "";
  }

  ///////////////////////////////////////////////////
  const transferReasonContactRadioId : string = "transfer_reason_select_contact";
  const transferReasonCompanyRadioId : string = "transfer_reason_select_company";
  const transferReasonContactSelectId : string = "transfer_reason_id_contactid";
  const transferReasonCompanySelectId : string = "transfer_reason_id_companyid";

  const transferReasonContactRadio = document.getElementById(transferReasonContactRadioId) as HTMLInputElement | null;
  const transferReasonCompanyRadio = document.getElementById(transferReasonCompanyRadioId) as HTMLInputElement | null;
  const transferReasonOwnerContactSelect = document.getElementById(transferReasonContactSelectId) as HTMLSelectElement | null;
  const transferReasonOwnerCompanySelect = document.getElementById(transferReasonCompanySelectId) as HTMLSelectElement | null;

  if (!transferReasonContactRadio || !transferReasonCompanyRadio || !transferReasonOwnerContactSelect || !transferReasonOwnerCompanySelect) {
    console.error("One or more elements are missing!");
    return;
  }

  if (selectedSetting.transferReasonContactType === OwnerType.CONTACT) {
    selectDropdownOption("transfer_reason_id_contactid", selectedSetting.transferReasonContactId);
    transferReasonContactRadio.checked = true;
    transferReasonCompanyRadio.checked = false;
    transferReasonOwnerContactSelect.disabled = false;
    transferReasonOwnerCompanySelect.disabled = true;
    transferReasonOwnerCompanySelect.value = "";

  } else if (selectedSetting.transferReasonContactType === OwnerType.COMPANY) {
    selectDropdownOption("transfer_reason_id_companyid", selectedSetting.transferReasonContactId);
    transferReasonContactRadio.checked = false;
    transferReasonCompanyRadio.checked = true;
    transferReasonOwnerContactSelect.disabled = true;
    transferReasonOwnerCompanySelect.disabled = false;
    transferReasonOwnerContactSelect.value = "";
  }

  if (selectedSetting.vet_id_contactid) {
    selectDropdownOption("vet_id_contactid", selectedSetting.vet_id_contactid);
  }

  if (selectedSetting.lab_id_companyid) {
    selectDropdownOption("lab_id_companyid", selectedSetting.lab_id_companyid);
  }

  if (selectedSetting.id_registry_id_companyid) {
    selectDropdownOption("id_registry_id_companyid", selectedSetting.id_registry_id_companyid);
  }
  
  

  if (selectedSetting.owner_id_premiseid) {
    selectDropdownOption("owner_id_premiseid", selectedSetting.owner_id_premiseid);
  }

  if (selectedSetting.breeder_id_premiseid) {
    selectDropdownOption("breeder_id_premiseid", selectedSetting.breeder_id_premiseid);
  }
  
  if (selectedSetting.vet_id_premiseid) {
    selectDropdownOption("vet_id_premiseid", selectedSetting.vet_id_premiseid);
  }

  if (selectedSetting.lab_id_premiseid) {
    selectDropdownOption("lab_id_premiseid", selectedSetting.lab_id_premiseid);
  }

  if (selectedSetting.registry_id_premiseid) {
    selectDropdownOption("registry_id_premiseid", selectedSetting.registry_id_premiseid);
  }
  
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

  if (selectedSetting.id_countyid) {
    selectDropdownOption("id_countyid", selectedSetting.id_countyid);
  }
  
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

  if (selectedSetting.id_stateid) {
    selectDropdownOption("id_stateid", selectedSetting.id_stateid);
  }
  
  if (selectedSetting.id_flockprefixid) {
    selectDropdownOption("id_flockprefixid", selectedSetting.id_flockprefixid);
  }

  if (selectedSetting.id_sexid) {
    selectDropdownOption("id_sexid", selectedSetting.id_sexid);
  }
  
  if (selectedSetting.id_idtypeid_primary) {
    selectDropdownOption("id_idtypeid_primary", selectedSetting.id_idtypeid_primary);
  }

  if (selectedSetting.id_idtypeid_secondary) {
    selectDropdownOption("id_idtypeid_secondary", selectedSetting.id_idtypeid_secondary);
  }

  if (selectedSetting.id_idtypeid_tertiary) {
    selectDropdownOption("id_idtypeid_tertiary", selectedSetting.id_idtypeid_tertiary);
  }
  
  if (selectedSetting.id_idremovereasonid) {
    selectDropdownOption("id_idremovereasonid", selectedSetting.id_idremovereasonid);
  }
  
  if (selectedSetting.id_tissuesampletypeid) {
    selectDropdownOption("id_tissuesampletypeid", selectedSetting.id_tissuesampletypeid);
  }
  
  if (selectedSetting.id_tissuesamplecontainertypeid) {
    selectDropdownOption("id_tissuesamplecontainertypeid", selectedSetting.id_tissuesamplecontainertypeid);
  }
  
  if (selectedSetting.id_tissuetestid) {
    selectDropdownOption("id_tissuetestid", selectedSetting.id_tissuetestid);
  }
  
  if (selectedSetting.id_deathreasonid) {
    selectDropdownOption("id_deathreasonid", selectedSetting.id_deathreasonid);
  }
  
  selectDropdownOption("birth_type", selectedSetting.birth_type);
  selectDropdownOption("rear_type", selectedSetting.rear_type);

  if (selectedSetting.id_transferreasonid) {
    selectDropdownOption("id_transferreasonid", selectedSetting.id_transferreasonid);
  }
  
  selectDropdownOption("birth_weight_id_unitsid", selectedSetting.birth_weight_id_unitsid);

  if (selectedSetting.weight_id_unitsid) {
    selectDropdownOption("weight_id_unitsid", selectedSetting.weight_id_unitsid);
  }
  

  if (selectedSetting.sale_price_id_unitsid) {
    selectDropdownOption("sale_price_id_unitsid", selectedSetting.sale_price_id_unitsid);
  }
  
  return;
}

const writeNewDefault = async () => {

  const currentTimestamp: string = getFormattedTimestamp();

  const contactRadio = document.getElementById("select_contact") as HTMLInputElement | null;

  var ownerType : OwnerType 
  var ownerId : string = "";

  if (contactRadio?.checked) {
    ownerType = OwnerType.CONTACT;
    ownerId = getSelectedDatabaseId("owner_id_contactid");
  } else {
    ownerType = OwnerType.COMPANY;
    ownerId = getSelectedDatabaseId("owner_id_companyid");
  }
  
  // Construct the WriteNewDefaultParameters object
  const formData: WriteNewDefaultParameters = {
    default_settings_name: (document.getElementById("settings_name") as HTMLInputElement).value,

    contactType: ownerType,
    ownerId: ownerId,
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

    death_reason_id_contactid: "0",
    death_reason_id_companyid: "0",
    trich_tag_next_tag_number: "0",
    transfer_reason_id_contactid: "0",
    transfer_reason_id_companyid: "0",
  };

  // Here you would call your API or service to write the default settings to the database
  const success: boolean = await (window as any).electronAPI.writeNewDefaultSettings(formData);

  if (success) {
    alert(`A new Default Setting has been created with the name \"${formData.default_settings_name}\"`);
  } else {
    alert("Failed to write settings.");
  }

  return;
};

// Function to get the selected option's data-database-id
const getSelectedDatabaseId = (elementId: string): string => {
  const selectElement = document.getElementById(elementId) as HTMLSelectElement;
  if (selectElement === null || selectElement === undefined) {
    console.warn(`Dropdown with ID "${elementId}" not found.`);
    return "0";
  }

  if (selectElement.selectedIndex === null || selectElement.selectedIndex === undefined) {
    console.warn(`selectElement with ID "${elementId}" does not have a \"selectedIndex\" property.`);
    return "0";
  }

  const selectedOption = selectElement.options[selectElement.selectedIndex];

  if (selectedOption === null) {
    console.warn(`Unable to get option ${selectElement.selectedIndex} from \"${elementId}\"`);
    return "0";
  }

  const dataId = selectedOption?.getAttribute("data-database-id");
  if (dataId === null) {
    console.warn(`Unable to get key \"data-database-id\" for \"${elementId}\"`);
    return "0";
  }

  return dataId;
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

    // Call the getBreeds API which now returns a Result
    const result = await (window as any).electronAPI.getBreeds(queryParams);

    // Use handleResult to process the result
    handleResult(result, {
      success: (breedInfo: Breed[]) => {
        breedInfo.sort((a, b) => a.display_order - b.display_order);

        const breeds = breedInfo.map((info) => ({
          label: info.name,
          id: info.id,
        }));

        populateDropdown("id_breedid", breeds);
      },
      error: (error: string) => {
        console.error("Error fetching breed data:", error); // Log the error message
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

/*
 * Handles allowing the user to choose only a contact or company ID.
 */
function handleOwnerXOR(contactRadioId : string, companyRadioId: string, contactSelectId: string, companySelectId: string) {
  const contactRadio = document.getElementById(contactRadioId) as HTMLInputElement | null;
  const companyRadio = document.getElementById(companyRadioId) as HTMLInputElement | null;
  const contactSelect = document.getElementById(contactSelectId) as HTMLSelectElement | null;
  const companySelect = document.getElementById(companySelectId) as HTMLSelectElement | null;

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
