import { 
  BirthType,
  Breed,
  BreedRequest,
  Color, 
  Company, 
  Country, 
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

import { OwnerType } from "../../../../database/client-types";

import React, { useEffect, useMemo, useState } from "react";
import { handleResult } from "../../../../shared/results/resultTypes";

const CreateDefaults: React.FC = () => {

  // define the arrays that are used when retrieving data from the DB
  const [contacts, setOwnerContacts] = useState<Owner[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [registryCompanies, setRegistryCompanies] = useState<Company[]>([]);
  const [premises, setPremises] = useState<Premise[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [removeReasons, setRemoveReasons] = useState<RemoveReason[]>([]);
  const [deathReasons, setDeathReasons] = useState<DeathReason[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [locations, setLocation] = useState<Location[]>([]);
  const [sexes, setSexes] = useState<Sex[]>([]);
  const [flockPrefixes, setFlockPrefixes] = useState<FlockPrefix[]>([]);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [tissueSampleContainerTypes, setTissueSampleContainerTypes] = useState<TissueSampleContainerType[]>([]);
  const [tissueSampleTypes, setTissueSampleTypes] = useState<TissueSampleType[]>([]);
  const [tissueTests, setTissueTests] = useState<TissueTest[]>([]);
  const [transferReasons, setTransferReasons] = useState<TransferReason[]>([]);
  const [birthTypes, setBirthTypes] = useState<BirthType[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [weightUnits, setWeightUnits] = useState<Unit[]>([]);
  const [currencyUnits, setCurrencyUnits] = useState<Unit[]>([]);

  // define state-specific 
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
  const [existingDefaults, setExistingDefaults] = useState<DefaultSettingsResults[]>([]);

  const [ownerSelection, setOwnerSelection] = useState<OwnerType>(OwnerType.CONTACT);
  const [breederSelection, setBreederSelection] = useState<OwnerType>(OwnerType.CONTACT);




  useEffect(() => {
    const loadData = async () => {

      // define requests needed for specific pieces of data
      const weightReq: UnitRequest = {
        unit_type_id: null,
        unit_type_name: "weight",
      };

      const currencyReq: UnitRequest = {
        unit_type_id: null,
        unit_type_name: "currency",
      };

      const [
        existingDefaultsResult,
        ownerResult,
        standardCompanyResult,
        registryCompanyResult,
        premiseResult,
        stateResult,
        countyResult,
        removeReasonResult,
        deathReasonResult,
        speciesResult,
        sexResult,
        locationResult,
        flockPrefixResult,
        tagTypeResult,
        tissueSampleContainerTypeResult,
        tissueSampleTypeResult,
        tissueTestResult,
        transferReasonsResult,
        birthTypeResult,
        colorResult,
        weightUnitsResult,
        currencyUnitsResult,
      ] = await Promise.all([
        (window as any).electronAPI.getExistingDefaults(),
        (window as any).electronAPI.getOwnerInfo(),
        (window as any).electronAPI.getCompanyInfo(false),
        (window as any).electronAPI.getCompanyInfo(true),
        (window as any).electronAPI.getPremiseInfo(),
        (window as any).electronAPI.getStates(),
        (window as any).electronAPI.getCounties(),
        (window as any).electronAPI.getRemoveReasons(),
        (window as any).electronAPI.getDeathReasons(),
        (window as any).electronAPI.getSpecies(),
        (window as any).electronAPI.getSexes(),
        (window as any).electronAPI.getLocations(),
        (window as any).electronAPI.getFlockPrefixes(),
        (window as any).electronAPI.getTagTypes(),
        (window as any).electronAPI.getTissueSampleContainerTypes(),
        (window as any).electronAPI.getTissueSampleTypes(),
        (window as any).electronAPI.getTissueTests(),
        (window as any).electronAPI.getTransferReasons(),
        (window as any).electronAPI.getBirthTypes(),
        (window as any).electronAPI.getColors(),
        (window as any).electronAPI.getUnits(weightReq),
        (window as any).electronAPI.getUnits(currencyReq),
      ]);

      handleResult(existingDefaultsResult, {
        success: (data : DefaultSettingsResults[]) => {
          setExistingDefaults(data);
        },
        error: (err) => {
          console.error("Failed to fetch existing defaults:", err);
        },
      });

      handleResult(ownerResult, {
        success: (data : Owner[]) => {
          setOwnerContacts(data);
        },
        error: (err) => {
          console.error("Failed to fetch owners:", err);
        },
      });

      handleResult(standardCompanyResult, {
        success: (data: Company[]) => {
          setCompanies(data);
        },
        error: (err) => {
          console.error("Failed to fetch companies:", err);
        },
      });

      handleResult(registryCompanyResult, {
        success: (data: Company[]) => {
          setRegistryCompanies(data);
        },
        error: (err) => {
          console.error("Failed to fetch registry companies:", err);
        },
      });

      handleResult(premiseResult, {
        success: (data: Premise[]) => {
          setPremises(data);
        },
        error: (err) => {
          console.error("Failed to fetch premises:", err);
        },
      });

      handleResult(stateResult, {
        success: (data: State[]) => {
          setStates(data);
        },
        error: (err) => {
          console.error("Failed to fetch states:", err);
        },
      });

      handleResult(countyResult, {
        success: (data: County[]) => {
          setCounties(data);
        },
        error: (err) => {
          console.error("Failed to fetch counties:", err);
        },
      });

      handleResult(removeReasonResult, {
        success: (data: RemoveReason[]) => {
          setRemoveReasons(data);
        },
        error: (err) => {
          console.error("Failed to fetch remove reasons:", err);
        },
      });

      handleResult(deathReasonResult, {
        success: (data: DeathReason[]) => {
          setDeathReasons(data);
        },
        error: (err) => {
          console.error("Failed to fetch death reasons:", err);
        },
      });

      handleResult(speciesResult, {
        success: (data: Species[]) => {
          setSpecies(data);
        },
        error: (err) => {
          console.error("Failed to fetch species:", err);
        },
      });

      handleResult(sexResult, {
        success: (data: Sex[]) => {
          setSexes(data);
        },
        error: (err) => {
          console.error("Failed to fetch sex:", err);
        },
      });

      handleResult(locationResult, {
        success: (data: Location[]) => {
          setLocation(data);
        },
        error: (err) => {
          console.error("Failed to fetch location:", err);
        },
      });

      handleResult(flockPrefixResult, {
        success: (data: FlockPrefix[]) => {
          setFlockPrefixes(data);
        },
        error: (err) => {
          console.error("Failed to fetch flock prefix:", err);
        },
      });

      handleResult(tagTypeResult, {
        success: (data: TagType[]) => {
          setTagTypes(data);
        },
        error: (err) => {
          console.error("Failed to fetch tag type:", err);
        },
      });

      handleResult(tissueSampleContainerTypeResult, {
        success: (data: TissueSampleContainerType[]) => {
          setTissueSampleContainerTypes(data);
        },
        error: (err) => {
          console.error("Failed to fetch tissue sample container type:", err);
        },
      });

      handleResult(tissueSampleTypeResult, {
        success: (data: TissueSampleType[]) => {
          setTissueSampleTypes(data);
        },
        error: (err) => {
          console.error("Failed to fetch tissue sample type:", err);
        },
      });

      handleResult(tissueTestResult, {
        success: (data: TissueTest[]) => {
          setTissueTests(data);
        },
        error: (err) => {
          console.error("Failed to fetch tissue tests:", err);
        },
      });

      handleResult(transferReasonsResult, {
        success: (data: TransferReason[]) => {
          setTransferReasons(data);
        },
        error: (err) => {
          console.error("Failed to fetch transfer reason:", err);
        },
      });

      handleResult(birthTypeResult, {
        success: (data: BirthType[]) => {
          setBirthTypes(data);
        },
        error: (err) => {
          console.error("Failed to fetch birth types:", err);
        },
      });

      handleResult(colorResult, {
        success: (data : Color[]) => {
          setColors(data);
        },
        error: (err) => {
          console.error("Failed to fetch colors:", err);
        },
      });

      handleResult(weightUnitsResult, {
        success: (data: Unit[]) => {
          setWeightUnits(data);
        },
        error: (err) => {
          console.error("Failed to fetch unit:", err);
        },
      });

      handleResult(currencyUnitsResult, {
        success: (data: Unit[]) => {
          setCurrencyUnits(data);
        },
        error: (err) => {
          console.error("Failed to fetch unit:", err);
        },
      });

    }; // end loadData definition
  
    loadData();
  }, []);

  const updateBreeds = async (speciesId : string) => {
    if (!speciesId) return; // no species selected yet

    try {
      const queryParams: BreedRequest = {
        species_id: speciesId,
      };

      const result = await (window as any).electronAPI.getBreeds(queryParams);

      handleResult(result, {
        success: (breedInfo: Breed[]) => {
          const sorted = [...breedInfo].sort((a, b) => a.display_order - b.display_order);
          setBreeds(sorted);
        },
        error: (error: string) => {
          console.error("Error fetching breed data:", error);
        },
      });
    } catch (error) {
      console.error("Unexpected error while fetching breeds:", error);
    }
  };

  const handleOwnerSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerSelection(e.target.id === "select_contact" ? OwnerType.CONTACT : OwnerType.COMPANY);
  };

  const handleBreederSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreederSelection(e.target.id === "breeder_select_contact" ? OwnerType.CONTACT : OwnerType.COMPANY);
  };
  

  const contactOptions = useMemo(() => (
    contacts.map((contact) => (
      <option key={contact.id} value={contact.id}>
        {contact.firstName} {contact.lastName}
      </option>
    ))
  ), [contacts]);

  const companyOptions = useMemo(() => (
    companies.map((company) => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    ))
  ), [companies]);
  
  const premiseOptions = useMemo(() => (
    premises.map((premise) => (
      <option key={premise.id} value={premise.id}>
        {premise.address}, {premise.city}, {premise.country}
      </option>
    ))
  ), [premises]);

  const registryCompanyOptions = useMemo(() => (
    registryCompanies.map((company) => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    ))
  ), [registryCompanies]);
  

  const colorOptions = useMemo(() => (
    colors.map((color) => (
      <option key={color.id} value={color.id}>
        {color.name}
      </option>
    ))
  ), [premises]);

  const stateOptions = useMemo(() => (
    states.map((state) => (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    ))
  ), [states]);
  
  const countyOptions = useMemo(() => (
    counties.map((county) => (
      <option key={county.id} value={county.id}>
        {county.name}
      </option>
    ))
  ), [counties]);

  const tagTypeOptions = useMemo(() => (
    tagTypes.map((tagType) => (
      <option key={tagType.id} value={tagType.id}>
        {tagType.name}
      </option>
    ))
  ), [tagTypes]);

  const locationOptions = useMemo(() => (
    locations.map((location) => (
      <option key={location.id} value={location.id}>
        {location.name}
      </option>
    ))
  ), [locations]);
  
  const tissueSampleTypeOptions = useMemo(() => (
    tissueSampleTypes.map((type) => (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    ))
  ), [tissueSampleTypes]);
  
  const tissueTestOptions = useMemo(() => (
    tissueTests.map((test) => (
      <option key={test.id} value={test.id}>
        {test.name}
      </option>
    ))
  ), [tissueTests]);
  
  const tissueSampleContainerTypeOptions = useMemo(() => (
    tissueSampleContainerTypes.map((container) => (
      <option key={container.id} value={container.id}>
        {container.name}
      </option>
    ))
  ), [tissueSampleContainerTypes]);

  const flockPrefixOptions = useMemo(() => (
    flockPrefixes.map((flockPrefix) => (
      <option key={flockPrefix.id} value={flockPrefix.id}>
        {flockPrefix.name}
      </option>
    ))
  ), [flockPrefixes]);
  
  const sexOptions = useMemo(() => (
    sexes.map((sex) => (
      <option key={sex.id} value={sex.id}>
        {sex.name}
      </option>
    ))
  ), [sexes]);
  
  const birthTypeOptions = useMemo(() => (
    birthTypes.map((bt) => (
      <option key={bt.id} value={bt.id}>
        {bt.name}
      </option>
    ))
  ), [birthTypes]);

  const deathReasonOptions = useMemo(() => (
    deathReasons.map((dr) => (
      <option key={dr.id} value={dr.id}>
        {dr.name}
      </option>
    ))
  ), [deathReasons]);

  const transferReasonOptions = useMemo(() => (
    transferReasons.map((tr) => (
      <option key={tr.id} value={tr.id}>
        {tr.name}
      </option>
    ))
  ), [transferReasons]);

  const weightUnitOptions = useMemo(() => (
    weightUnits.map((weight) => (
      <option key={weight.id} value={weight.id}>
        {weight.name}
      </option>
    ))
  ), [weightUnits]);
  
  const currencyUnitOptions = useMemo(() => (
    currencyUnits.map((curr) => (
      <option key={curr.id} value={curr.id}>
        {curr.name}
      </option>
    ))
  ), [currencyUnits]);

  const speciesOptions = useMemo(() => (
    species.map((spec) => (
      <option key={spec.id} value={spec.id}>
        {spec.common_name}
      </option>
    ))
  ), [species]);

  const breedOptions = useMemo(() => (
    breeds.map((breed) => (
      <option key={breed.id} value={breed.id}>
        {breed.name}
      </option>
    ))
  ), [breeds]); 

  const removeReasonOptions = useMemo(() => (
    removeReasons.map((removeReason) => (
      <option key={removeReason.id} value={removeReason.id}>
        {removeReason.name}
      </option>
    ))
  ), [removeReasons]);   

  return (
    <div className="container">
      {/* Top Section */}
      <div className="create-defaults-top-section">
        <h2>Default Settings</h2>
        <button id="create-default-btn" className="forward-button">
          Create New Default
        </button>
      </div>

      {/* Bottom Section */}
      <div className="create-defaults-bottom-section">
        <form id="defaults-form">

          {/* Existing Setting Selection */}
          <div className="existing-setting-container">
            <label htmlFor="existing-settings">Start from Existing Setting:</label>
            <select id="existing-settings" name="existing-settings">
              <option value="">Select an Existing Default...</option>
              {existingDefaults.map((existingdef) => (
                <option key={existingdef.id} value={existingdef.id}>
                  {existingdef.name}
                </option>
              ))}
            </select>

            {/* existingDefaults */}

            {/* Load Default Button */}
            <button id="load-default-btn" type="button">
              Load Default
            </button>
          </div>

          <label htmlFor="settings_name">Settings Name:</label>
          <input type="text" id="settings_name" name="settings_name" />

          <div className="section-break"></div>
          <h2>Contacts, Companies, & Premises</h2>
          <hr />
          <div className="section-break"></div>

          {/* Owner Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="select_contact"
                  name="owner_selection"
                  checked={ownerSelection === OwnerType.CONTACT}
                  onChange={handleOwnerSelectionChange}
                />
                Contact
              </label>
              <label>
                <input
                  type="radio"
                  id="select_company"
                  name="owner_selection"
                  checked={ownerSelection === OwnerType.COMPANY}
                  onChange={handleOwnerSelectionChange}
                />
                Company
              </label>
            </div>

            <label htmlFor="owner_id_contactid">Owner Contact:</label>
            <select
              id="owner_id_contactid"
              name="owner_id_contactid"
              disabled={ownerSelection !== OwnerType.CONTACT}
            >
              <option value="">Select a contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="owner_id_companyid">Owner Company:</label>
            <select
              id="owner_id_companyid"
              name="owner_id_companyid"
              disabled={ownerSelection !== OwnerType.COMPANY}
            >
              <option value="">Select a company...</option>
              {companyOptions}
            </select>

            <label htmlFor="owner_id_premiseid">Owner Premise:</label>
            <select id="owner_id_premiseid" name="owner_id_premiseid">
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>

          {/* Breeder Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="breeder_select_contact"
                  name="breeder_selection"
                  checked={breederSelection === OwnerType.CONTACT}
                  onChange={handleBreederSelectionChange}
                />
                Contact
              </label>
              <label>
                <input
                  type="radio"
                  id="breeder_select_company"
                  name="breeder_selection"
                  checked={breederSelection === OwnerType.COMPANY}
                  onChange={handleBreederSelectionChange}
                />
                Company
              </label>
            </div>

            <label htmlFor="breeder_id_contactid">Breeder Contact:</label>
            <select
              id="breeder_id_contactid"
              name="breeder_id_contactid"
              disabled={breederSelection !== OwnerType.CONTACT}
            >
              <option value="">Select a breeder contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="breeder_id_companyid">Breeder Company:</label>
            <select
              id="breeder_id_companyid"
              name="breeder_id_companyid"
              disabled={breederSelection !== OwnerType.COMPANY}
            >
              <option value="">Select a breeder company...</option>
              {companyOptions}
            </select>

            <label htmlFor="breeder_id_premiseid">Breeder Premise:</label>
            <select id="breeder_id_premiseid" name="breeder_id_premiseid">
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>

          {/* Transfer Reason Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input type="radio" id="transfer_reason_select_contact" name="transfer_reason_selection" defaultChecked />
                Contact
              </label>
              <label>
                <input type="radio" id="transfer_reason_select_company" name="transfer_reason_selection" />
                Company
              </label>
            </div>

            <label htmlFor="transfer_reason_id_contactid">Transfer Reason Contact:</label>
            <select id="transfer_reason_id_contactid" name="transfer_reason_id_contactid">
              <option value="">Select a transfer reason contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="transfer_reason_id_companyid">Transfer Reason Company:</label>
            <select id="transfer_reason_id_companyid" name="transfer_reason_id_companyid">
              <option value="">Select a Transfer Reason company...</option>
              {companyOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="vet_id_contactid">Vet Contact:</label>
            <select id="vet_id_contactid" name="vet_id_contactid">
              <option value="">Select a vet contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="vet_id_premiseid">Vet Premise:</label>
            <select id="vet_id_premiseid" name="vet_id_premiseid">
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>

          {/* More sections follow in similar structure */}
          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="lab_id_companyid">Lab Company:</label>
              <select id="lab_id_companyid" name="lab_id_companyid">
                <option value="">Select a lab company...</option>
                {companyOptions}
              </select>

            <label htmlFor="lab_id_premiseid">Lab Premise:</label>
            <select id="lab_id_premiseid" name="lab_id_premiseid">
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_registry_id_companyid">Registry Company:</label>
            <select id="id_registry_id_companyid" name="id_registry_id_companyid">
              <option value="">Select a Registry Company...</option>
              {registryCompanyOptions}
            </select>

            <label htmlFor="registry_id_premiseid">Registry Premise:</label>
            <select id="registry_id_premiseid" name="registry_id_premiseid">
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h2>Locations</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_stateid">State:</label>
            <select id="id_stateid" name="id_stateid">
              <option value="">Select a state...</option>
              {stateOptions}
            </select>

            <label htmlFor="id_countyid">County:</label>
            <select id="id_countyid" name="id_countyid">
              <option value="">Select a county...</option>
              {countyOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h2>Tag Information</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_idtypeid_primary">Primary ID Type:</label>
            <select id="id_idtypeid_primary" name="id_idtypeid_primary">
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_secondary">Secondary ID Type:</label>
            <select id="id_idtypeid_secondary" name="id_idtypeid_secondary">
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_tertiary">Tertiary ID Type:</label>
            <select id="id_idtypeid_tertiary" name="id_idtypeid_tertiary">
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>EID Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_eid_tag_male_color_female_color_same">EID Tag Male/Female Same Color:</label>
            <select id="id_eid_tag_male_color_female_color_same" name="id_eid_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="eid_tag_color_male">EID Tag Color Male:</label>
            <select id="eid_tag_color_male" name="eid_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_color_female">EID Tag Color Female:</label>
            <select id="eid_tag_color_female" name="eid_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_location">EID Tag Location:</label>
            <select id="eid_tag_location" name="eid_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>


          </div>

          <div className="section-break"></div>
          <h3>Farm Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_farm_tag_male_color_female_color_same">Farm Tag Male/Female Same Color:</label>
            <select id="id_farm_tag_male_color_female_color_same" name="id_farm_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="farm_tag_color_male">Farm Tag Color Male Side:</label>
            <select id="farm_tag_color_male" name="farm_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="farm_tag_color_female">Farm Tag Color Female Side:</label>
            <select id="farm_tag_color_female" name="farm_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="farm_tag_based_on_eid_tag">Farm Tag Based on EID Tag:</label>
            <select id="farm_tag_based_on_eid_tag" name="farm_tag_based_on_eid_tag">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="farm_tag_number_digits_from_eid">Farm Tag Number Digits from EID:</label>
            <input type="number" id="farm_tag_number_digits_from_eid" name="farm_tag_number_digits_from_eid" min="0" step="1" />

            <label htmlFor="farm_tag_location">Farm Tag Location:</label>
            <select id="farm_tag_location" name="farm_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>Federal Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_fed_tag_male_color_female_color_same">Federal Tag Male/Female Same Color:</label>
            <select id="id_fed_tag_male_color_female_color_same" name="id_fed_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="fed_tag_color_male">Federal Tag Color Male Side:</label>
            <select id="fed_tag_color_male" name="fed_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_color_female">Federal Tag Color Female Side:</label>
            <select id="fed_tag_color_female" name="fed_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_location">Federal Tag Location:</label>
            <select id="fed_tag_location" name="fed_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>NUES Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_nues_tag_male_color_female_color_same">NUES Tag Male/Female Same Color:</label>
            <select id="id_nues_tag_male_color_female_color_same" name="id_nues_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="nues_tag_color_male">NUES Tag Color Male Side:</label>
            <select id="nues_tag_color_male" name="nues_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_color_female">NUES Tag Color Female Side:</label>
            <select id="nues_tag_color_female" name="nues_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_location">NUES Tag Location:</label>
            <select id="nues_tag_location" name="nues_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>Trich Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_trich_tag_male_color_female_color_same">Trich Tag Male/Female Same Color:</label>
            <select id="id_trich_tag_male_color_female_color_same" name="id_trich_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="trich_tag_color_male">Trich Tag Color Male Side:</label>
            <select id="trich_tag_color_male" name="trich_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_color_female">Trich Tag Color Female Side:</label>
            <select id="trich_tag_color_female" name="trich_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_location">Trich Tag Location:</label>
            <select id="trich_tag_location" name="trich_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>

            <label htmlFor="trich_tag_auto_increment">Trich Tag Auto Increment:</label>
            <select id="trich_tag_auto_increment" name="trich_tag_auto_increment">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="trich_tag_starting_value">Trich Tag Auto Increment Starting Value:</label>
            <input type="number" id="trich_tag_starting_value" name="trich_tag_starting_value" min="0" step="1" />
          </div>

          <div className="section-break"></div>
          <h3>Bangs Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_bangs_tag_male_color_female_color_same">Bangs Male and Female Color Same:</label>
            <select id="id_bangs_tag_male_color_female_color_same" name="id_bangs_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="bangs_tag_color_male">Bangs Tag Color Male Side:</label>
            <select id="bangs_tag_color_male" name="bangs_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_color_female">Bangs Tag Color Female Side:</label>
            <select id="bangs_tag_color_female" name="bangs_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_location">Bangs Tag Location:</label>
            <select id="bangs_tag_location" name="bangs_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>Sale Order Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_sale_order_tag_male_color_female_color_same">Sale Order Male and Female Color Same:</label>
            <select id="id_sale_order_tag_male_color_female_color_same" name="id_sale_order_tag_male_color_female_color_same">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="sale_order_tag_color_male">Sale Order Tag Color Male Side:</label>
            <select id="sale_order_tag_color_male" name="sale_order_tag_color_male">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_color_female">Sale Order Tag Color Female Side:</label>
            <select id="sale_order_tag_color_female" name="sale_order_tag_color_female">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_location">Sale Order Tag Location:</label>
            <select id="sale_order_tag_location" name="sale_order_tag_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h3>Misc Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="use_paint_marks">Use Paint Marks:</label>
            <select id="use_paint_marks" name="use_paint_marks">
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="paint_mark_color">Paint Mark Color:</label>
            <select id="paint_mark_color" name="paint_mark_color">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="paint_mark_location">Paint Mark Tag Location:</label>
            <select id="paint_mark_location" name="paint_mark_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="tattoo_color">Tattoo Color:</label>
            <select id="tattoo_color" name="tattoo_color">
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="tattoo_location">Tattoo Location:</label>
            <select id="tattoo_location" name="tattoo_location">
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <label htmlFor="freeze_brand_location">Freeze Brand Tag Location:</label>
          <select id="freeze_brand_location" name="freeze_brand_location">
            <option value="">Select a Tag Location...</option>
            {locationOptions}
          </select>

          <label htmlFor="id_idremovereasonid">ID Remove Reason:</label>
          <select id="id_idremovereasonid" name="id_idremovereasonid">
            <option value="">Select a Remove Reason...</option>
            {removeReasonOptions}
          </select>

          <div className="section-break"></div>
          <h3>Tissue Sample Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_tissuesampletypeid">Tissue Sample Type:</label>
            <select id="id_tissuesampletypeid" name="id_tissuesampletypeid">
              <option value="">Select a Tissue Sample type...</option>
              {tissueSampleTypeOptions}
            </select>

            <label htmlFor="id_tissuetestid">Tissue Test:</label>
            <select id="id_tissuetestid" name="id_tissuetestid">
              <option value="">Select a Tissue Test...</option>
              {tissueTestOptions}
            </select>

            <label htmlFor="id_tissuesamplecontainertypeid">Tissue Sample Container Type:</label>
            <select id="id_tissuesamplecontainertypeid" name="id_tissuesamplecontainertypeid">
              <option value="">Select a Tissue Sample Container Type...</option>
              {tissueSampleContainerTypeOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <h2>Animal Information</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_speciesid">Species:</label>
            <select
              id="id_speciesid"
              name="id_speciesid"
              value={selectedSpeciesId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedSpeciesId(id);
                updateBreeds(id);
              }}
            >
              <option value="">Select a Species...</option>
              {speciesOptions}
            </select>

            <select
              id="id_breedid"
              name="id_breedid"
              disabled={!breeds.length}
            >
              <option value="" disabled selected>
                Select a breed...
              </option>
              {breedOptions}
            </select>
          </div>

          <label htmlFor="id_flockprefixid">Flock Prefix:</label>
          <select id="id_flockprefixid" name="id_flockprefixid">
            <option value="">Select a Flock Prefix...</option>
            {flockPrefixOptions}
          </select>

          <label htmlFor="id_sexid">Sex:</label>
          <select id="id_sexid" name="id_sexid">
            <option value="">Select a Flock Prefix...</option>
            {sexOptions}
          </select>

          <label htmlFor="birth_type">Birth Type:</label>
          <select id="birth_type" name="birth_type">
            <option value="">Select a Birth Type...</option>
            {birthTypeOptions}
          </select>

          <label htmlFor="rear_type">Rear Type:</label>
          <select id="rear_type" name="rear_type">
            <option value="">Select a Birth Type...</option>
            {birthTypeOptions}
          </select>

          <label htmlFor="minimum_birth_weight">Minimum Birth Weight:</label>
          <input type="number" id="minimum_birth_weight" name="minimum_birth_weight" min="0" step="0.1" />

          <label htmlFor="maximum_birth_weight">Maximum Birth Weight:</label>
          <input type="number" id="maximum_birth_weight" name="maximum_birth_weight" min="0" step="0.1" />

          <label htmlFor="birth_weight_id_unitsid">Birth Weight Units:</label>
          <select id="birth_weight_id_unitsid" name="birth_weight_id_unitsid">
            <option value="">Select a Birth Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="weight_id_unitsid">Weight Units:</label>
          <select id="weight_id_unitsid" name="weight_id_unitsid">
            <option value="">Select a Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="sale_price_id_unitsid">Sale Price Units:</label>
          <select id="sale_price_id_unitsid" name="sale_price_id_unitsid">
            <option value="">Select a Currency...</option>
            {currencyUnitOptions}
          </select>
          
          <label htmlFor="id_deathreasonid">Death Reason:</label>
          <select id="id_deathreasonid" name="id_deathreasonid">
            <option value="">Select a Death Reason...</option>
            {deathReasonOptions}
          </select>


          <label htmlFor="id_transferreasonid">Transfer Reason:</label>
          <select id="id_transferreasonid" name="id_transferreasonid">
            <option value="">Select a Transfer Reason...</option>
            {transferReasonOptions}
          </select>


          {/* Miscellaneous Section */}
          <div className="section-break"></div>
          <h3>Miscellaneous</h3>
          <hr />

          <label htmlFor="evaluation_update_alert">Evaluation Update Alert:</label>
          <select id="evaluation_update_alert" name="evaluation_update_alert" />
        </form>
      </div>
    </div>
  );
};

export default CreateDefaults;
