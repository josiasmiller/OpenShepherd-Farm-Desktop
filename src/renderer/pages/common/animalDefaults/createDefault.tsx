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
  const [existingDefaults, setExistingDefaults] = useState<DefaultSettingsResults[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<DefaultSettingsResults | null>(null);

  const [ownerSelection, setOwnerSelection] = useState<OwnerType>(OwnerType.CONTACT);
  const [ownerContactId, setOwnerContactId] = useState<string>('');
  const [ownerCompanyId, setOwnerCompanyId] = useState<string>('');
  const [ownerPremiseId, setOwnerPremiseId] = useState<string>('');

  // Breeder
  const [breederSelection, setBreederSelection] = useState<OwnerType>(OwnerType.CONTACT);
  const [breederContactId, setBreederContactId] = useState<string>('');
  const [breederCompanyId, setBreederCompanyId] = useState<string>('');
  const [breederPremiseId, setBreederPremiseId] = useState<string>('');

  // Transfer Reason
  const [transferReasonSelection, setTransferReasonSelection] = useState<OwnerType>(OwnerType.CONTACT);
  const [transferReasonContactId, setTransferReasonContactId] = useState<string>('');
  const [transferReasonCompanyId, setTransferReasonCompanyId] = useState<string>('');

  // Vet
  const [vetContactId, setVetContactId] = useState<string>('');
  const [vetPremiseId, setVetPremiseId] = useState<string>('');

  // Lab
  const [labCompanyId, setLabCompanyId] = useState<string>('');
  const [labPremiseId, setLabPremiseId] = useState<string>('');

  // Registry
  const [registryCompanyId, setRegistryCompanyId] = useState<string>('');
  const [registryPremiseId, setRegistryPremiseId] = useState<string>('');

  // Location
  const [stateId, setStateId] = useState<string>('');
  const [countyId, setCountyId] = useState<string>('');

  // ID Types
  const [primaryIdTypeId, setPrimaryIdTypeId] = useState<string>('');
  const [secondaryIdTypeId, setSecondaryIdTypeId] = useState<string>('');
  const [tertiaryIdTypeId, setTertiaryIdTypeId] = useState<string>('');

  // EID Tag 
  const [eidTagMaleFemaleColorSame, setEidTagMaleFemaleColorSame] = useState('');
  const [eidTagColorMale, setEidTagColorMale] = useState('');
  const [eidTagColorFemale, setEidTagColorFemale] = useState('');
  const [eidTagLocation, setEidTagLocation] = useState('');
  
  // Farm Tag
  const [farmTagMaleFemaleColorSame, setFarmTagMaleFemaleColorSame] = useState('');
  const [farmTagColorMale, setFarmTagColorMale] = useState('');
  const [farmTagColorFemale, setFarmTagColorFemale] = useState('');
  const [farmTagBasedOnEidTag, setFarmTagBasedOnEidTag] = useState('');
  const [farmTagNumberDigitsFromEid, setFarmTagNumberDigitsFromEid] = useState('');
  const [farmTagLocation, setFarmTagLocation] = useState('');
  

  // Federal Tags
  const [fedSameColor, setFedSameColor] = useState<string>('');
  const [fedColorMale, setFedColorMale] = useState<string>('');
  const [fedColorFemale, setFedColorFemale] = useState<string>('');
  const [fedLocation, setFedLocation] = useState<string>('');

  // NUES Tags
  const [nuesSameColor, setNuesSameColor] = useState<string>('');
  const [nuesColorMale, setNuesColorMale] = useState<string>('');
  const [nuesColorFemale, setNuesColorFemale] = useState<string>('');
  const [nuesLocation, setNuesLocation] = useState<string>('');

  // Trich Tags
  const [trichSameColor, setTrichSameColor] = useState<string>('');
  const [trichColorMale, setTrichColorMale] = useState<string>('');
  const [trichColorFemale, setTrichColorFemale] = useState<string>('');
  const [trichLocation, setTrichLocation] = useState<string>('');
  const [trichAutoIncrement, setTrichAutoIncrement] = useState<string>('');
  const [trichStartingValue, setTrichStartingValue] = useState<string>('');

  // Bangs Tags
  const [bangsSameColor, setBangsSameColor] = useState<string>('');
  const [bangsColorMale, setBangsColorMale] = useState<string>('');
  const [bangsColorFemale, setBangsColorFemale] = useState<string>('');
  const [bangsLocation, setBangsLocation] = useState<string>('');

  // Sale Order Tags
  const [saleOrderSameColor, setSaleOrderSameColor] = useState<string>('');
  const [saleOrderColorMale, setSaleOrderColorMale] = useState<string>('');
  const [saleOrderColorFemale, setSaleOrderColorFemale] = useState<string>('');
  const [saleOrderLocation, setSaleOrderLocation] = useState<string>('');

  // Paint Mark
  const [usePaintMarks, setUsePaintMarks] = useState<string>('');
  const [paintMarkColor, setPaintMarkColor] = useState<string>('');
  const [paintMarkLocation, setPaintMarkLocation] = useState<string>('');

  const [tattooColor, setTattooColor] = useState<string>('');
  const [tattooLocation, setTattooLocation] = useState<string>('');
  const [freezeBrandLocation, setFreezeBrandLocation] = useState<string>('');
  const [idRemoveReason, setIdRemoveReason] = useState<string>('');
  
  // Tissue Sample
  const [tissueSampleTypeId, setTissueSampleTypeId] = useState<string>('');
  const [tissueTestId, setTissueTestId] = useState<string>('');
  const [tissueSampleContainerTypeId, setTissueSampleContainerTypeId] = useState<string>('');

  // Animal Info
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
  const [selectedBreedId, setSelectedBreedId] = useState<string>('');
  const [flockPrefixId, setFlockPrefixId] = useState<string>('');
  const [sexId, setSexId] = useState<string>('');
  const [birthType, setBirthType] = useState<string>('');
  const [rearType, setRearType] = useState<string>('');
  const [minBirthWeight, setMinBirthWeight] = useState<number>(0);
  const [maxBirthWeight, setMaxBirthWeight] = useState<number>(0);
  const [birthWeightUnitsId, setBirthWeightUnitsId] = useState<string>('');
  const [weightUnitsId, setWeightUnitsId] = useState<string>('');
  const [salePriceUnitsId, setSalePriceUnitsId] = useState<string>('');
  const [deathReasonId, setDeathReasonId] = useState<string>('');
  const [transferReasonId, setTransferReasonId] = useState<string>('');
  const [evaluationUpdateAlert, setEvaluationUpdateAlert] = useState<string>('');


  useEffect(() => {
    const loadData = async () => {

      // define requests needed for specific pieces of data
      const weightReq: UnitRequest = {
        unit_type_id: null,
        unit_type_name: "Weight",
      };

      const currencyReq: UnitRequest = {
        unit_type_id: null,
        unit_type_name: "Currency",
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

  const handleTransferReasonSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.id === 'transfer_reason_select_contact' ? OwnerType.CONTACT : OwnerType.COMPANY;
    setTransferReasonSelection(value);
  };
  

  const loadDefaultSettings = (defaultSetting: DefaultSettingsResults) => {
    setOwnerSelection(defaultSetting.owner_type ?? null);

    if (defaultSetting.owner_type === OwnerType.CONTACT) {
      setOwnerContactId(defaultSetting.owner_id);
      setOwnerCompanyId("");
    } else if (defaultSetting.owner_type === OwnerType.COMPANY) {
      setOwnerCompanyId(defaultSetting.owner_id);
      setOwnerContactId("");
    }

    setOwnerPremiseId(defaultSetting.owner_id_premiseid ?? "");

    
    setBreederSelection(defaultSetting.breederType);

    if (defaultSetting.breederType === OwnerType.CONTACT) {
      setBreederContactId(defaultSetting.breederId);
      setBreederCompanyId("");
    } else if (defaultSetting.breederType === OwnerType.COMPANY) {
      setBreederCompanyId(defaultSetting.breederId);
      setBreederContactId("");
    }

    setBreederPremiseId(defaultSetting.breeder_id_premiseid || '');


    setTransferReasonSelection(defaultSetting.transferReasonContactType);

    if (defaultSetting.transferReasonContactType === OwnerType.CONTACT) {
      setTransferReasonContactId(defaultSetting.transferReasonContactId);
      setTransferReasonCompanyId("");
    } else if (defaultSetting.transferReasonContactType === OwnerType.COMPANY) {
      setTransferReasonCompanyId(defaultSetting.transferReasonContactId);
      setTransferReasonContactId("");
    }

    setVetContactId(defaultSetting.vet_id_contactid);
    setVetPremiseId(defaultSetting.vet_id_premiseid);

    setLabCompanyId(defaultSetting.lab_id_companyid);
    setLabPremiseId(defaultSetting.lab_id_premiseid);
    setRegistryCompanyId(defaultSetting.id_registry_id_companyid);
    setRegistryPremiseId(defaultSetting.registry_id_premiseid);
    setStateId(defaultSetting.id_stateid);
    setCountyId(defaultSetting.id_countyid);
    setPrimaryIdTypeId(defaultSetting.id_idtypeid_primary);
    setSecondaryIdTypeId(defaultSetting.id_idtypeid_secondary);
    setTertiaryIdTypeId(defaultSetting.id_idtypeid_tertiary);

    setEidTagMaleFemaleColorSame(defaultSetting.id_eid_tag_male_color_female_color_same);
    setEidTagColorMale(defaultSetting.eid_tag_color_male);
    setEidTagColorFemale(defaultSetting.eid_tag_color_female);
    setEidTagLocation(defaultSetting.eid_tag_location);

    setFarmTagMaleFemaleColorSame(defaultSetting.id_farm_tag_male_color_female_color_same);
    setFarmTagColorMale(defaultSetting.farm_tag_color_male);
    setFarmTagColorFemale(defaultSetting.farm_tag_color_female);
    setFarmTagBasedOnEidTag(defaultSetting.farm_tag_based_on_eid_tag);
    setFarmTagNumberDigitsFromEid(defaultSetting.farm_tag_number_digits_from_eid);
    setFarmTagLocation(defaultSetting.farm_tag_location);

    // Federal Tags
    setFedSameColor(defaultSetting.id_fed_tag_male_color_female_color_same);
    setFedColorMale(defaultSetting.fed_tag_color_male);
    setFedColorFemale(defaultSetting.fed_tag_color_female);
    setFedLocation(defaultSetting.fed_tag_location);
  
    // NUES Tags
    setNuesSameColor(defaultSetting.id_nues_tag_male_color_female_color_same);
    setNuesColorMale(defaultSetting.nues_tag_color_male);
    setNuesColorFemale(defaultSetting.nues_tag_color_female);
    setNuesLocation(defaultSetting.nues_tag_location);
  
    // Trich Tags
    setTrichSameColor(defaultSetting.id_trich_tag_male_color_female_color_same);
    setTrichColorMale(defaultSetting.trich_tag_color_male);
    setTrichColorFemale(defaultSetting.trich_tag_color_female);
    setTrichLocation(defaultSetting.trich_tag_location);
    setTrichAutoIncrement(defaultSetting.trich_tag_auto_increment);
    setTrichStartingValue(defaultSetting.trich_tag_next_tag_number);

    // Bangs Tag
    setBangsSameColor(defaultSetting.id_bangs_tag_male_color_female_color_same);
    setBangsColorMale(defaultSetting.bangs_tag_color_male);
    setBangsColorFemale(defaultSetting.bangs_tag_color_female);
    setBangsLocation(defaultSetting.bangs_tag_location);

    // Sale Order Tag
    setSaleOrderSameColor(defaultSetting.id_sale_order_tag_male_color_female_color_same);
    setSaleOrderColorMale(defaultSetting.sale_order_tag_color_male);
    setSaleOrderColorFemale(defaultSetting.sale_order_tag_color_female);
    setSaleOrderLocation(defaultSetting.sale_order_tag_location);

    // Misc
    setUsePaintMarks(defaultSetting.use_paint_marks);
    setPaintMarkColor(defaultSetting.paint_mark_color);
    setPaintMarkLocation(defaultSetting.paint_mark_location);
    setTattooColor(defaultSetting.tattoo_color);
    setTattooLocation(defaultSetting.tattoo_location);
    setFreezeBrandLocation(defaultSetting.freeze_brand_location);
    setIdRemoveReason(defaultSetting.id_idremovereasonid);
    
    setTissueSampleTypeId(defaultSetting.id_tissuesampletypeid);
    setTissueTestId(defaultSetting.id_tissuetestid);
    setTissueSampleContainerTypeId(defaultSetting.id_tissuesamplecontainertypeid);
  
    setSelectedSpeciesId(defaultSetting.id_speciesid);
    setSelectedBreedId(defaultSetting.id_breedid);
    setFlockPrefixId(defaultSetting.id_flockprefixid);
    setSexId(defaultSetting.id_sexid);
    setBirthType(defaultSetting.birth_type);
    setRearType(defaultSetting.rear_type);
    setMinBirthWeight(defaultSetting.minimum_birth_weight);
    setMaxBirthWeight(defaultSetting.maximum_birth_weight);
    setBirthWeightUnitsId(defaultSetting.birth_weight_id_unitsid);
    setWeightUnitsId(defaultSetting.weight_id_unitsid);
    setSalePriceUnitsId(defaultSetting.sale_price_id_unitsid);
    setDeathReasonId(defaultSetting.id_deathreasonid);
    setTransferReasonId(defaultSetting.id_transferreasonid);
    setEvaluationUpdateAlert(defaultSetting.evaluation_update_alert);
  };

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
            <select
              id="existing-settings"
              name="existing-settings"
              value={selectedDefault?.id.toString() ?? ""} // default to "" if null
              onChange={(e) => {
                const selectedId = e.target.value;
                const found = existingDefaults.find((def) => def.id == selectedId) || null;
                setSelectedDefault(found);
              }}
            >
              <option value="">Select an Existing Default...</option>
              {existingDefaults.map((existingdef) => (
                <option key={existingdef.id} value={existingdef.id}>
                  {existingdef.name}
                </option>
              ))}
            </select>

            {/* Load Default Button */}
            <button
              id="load-default-btn"
              type="button"
              onClick={() => {
                if (selectedDefault) {
                  loadDefaultSettings(selectedDefault);
                } else {
                  console.warn("No default selected");
                }
              }}
            >
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
              value={ownerContactId}
              onChange={(e) => setOwnerContactId(e.target.value)}
            >
              <option value="">Select a contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="owner_id_companyid">Owner Company:</label>
            <select
              id="owner_id_companyid"
              name="owner_id_companyid"
              disabled={ownerSelection !== OwnerType.COMPANY}
              value={ownerCompanyId}
              onChange={(e) => setOwnerCompanyId(e.target.value)}
            >
              <option value="">Select a company...</option>
              {companyOptions}
            </select>

            <label htmlFor="owner_id_premiseid">Owner Premise:</label>
            <select
              id="owner_id_premiseid"
              name="owner_id_premiseid"
              value={ownerPremiseId}
              onChange={(e) => setOwnerPremiseId(e.target.value)}
            >
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
              value={breederContactId}
              onChange={(e) => setBreederContactId(e.target.value)}
              disabled={breederSelection !== OwnerType.CONTACT}
            >
              <option value="">Select a breeder contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="breeder_id_companyid">Breeder Company:</label>
            <select
              id="breeder_id_companyid"
              name="breeder_id_companyid"
              value={breederCompanyId}
              onChange={(e) => setBreederCompanyId(e.target.value)}
              disabled={breederSelection !== OwnerType.COMPANY}
            >
              <option value="">Select a breeder company...</option>
              {companyOptions}
            </select>

            <label htmlFor="breeder_id_premiseid">Breeder Premise:</label>
            <select
              id="breeder_id_premiseid"
              name="breeder_id_premiseid"
              value={breederPremiseId}
              onChange={(e) => setBreederPremiseId(e.target.value)}
            >
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>


          <div className="section-break"></div>

          {/* Transfer Reason Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="transfer_reason_select_contact"
                  name="transfer_reason_selection"
                  checked={transferReasonSelection === OwnerType.CONTACT}
                  onChange={handleTransferReasonSelectionChange}
                />
                Contact
              </label>
              <label>
                <input
                  type="radio"
                  id="transfer_reason_select_company"
                  name="transfer_reason_selection"
                  checked={transferReasonSelection === OwnerType.COMPANY}
                  onChange={handleTransferReasonSelectionChange}
                />
                Company
              </label>
            </div>

            <label htmlFor="transfer_reason_id_contactid">Transfer Reason Contact:</label>
            <select
              id="transfer_reason_id_contactid"
              name="transfer_reason_id_contactid"
              value={transferReasonContactId}
              onChange={(e) => setTransferReasonContactId(e.target.value)}
              disabled={transferReasonSelection !== OwnerType.CONTACT}
            >
              <option value="">Select a transfer reason contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="transfer_reason_id_companyid">Transfer Reason Company:</label>
            <select
              id="transfer_reason_id_companyid"
              name="transfer_reason_id_companyid"
              value={transferReasonCompanyId}
              onChange={(e) => setTransferReasonCompanyId(e.target.value)}
              disabled={transferReasonSelection !== OwnerType.COMPANY}
            >
              <option value="">Select a Transfer Reason company...</option>
              {companyOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="vet_id_contactid">Vet Contact:</label>
            <select
              id="vet_id_contactid"
              name="vet_id_contactid"
              value={vetContactId}
              onChange={(e) => setVetContactId(e.target.value)}
            >
              <option value="">Select a vet contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="vet_id_premiseid">Vet Premise:</label>
            <select
              id="vet_id_premiseid"
              name="vet_id_premiseid"
              value={vetPremiseId}
              onChange={(e) => setVetPremiseId(e.target.value)}
            >
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>


          <div className="section-break"></div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="lab_id_companyid">Lab Company:</label>
            <select
              id="lab_id_companyid"
              name="lab_id_companyid"
              value={labCompanyId}
              onChange={(e) => setLabCompanyId(e.target.value)}
            >
              <option value="">Select a lab company...</option>
              {companyOptions}
            </select>

            <label htmlFor="lab_id_premiseid">Lab Premise:</label>
            <select
              id="lab_id_premiseid"
              name="lab_id_premiseid"
              value={labPremiseId}
              onChange={(e) => setLabPremiseId(e.target.value)}
            >
              <option value="">Select a premise...</option>
              {premiseOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_registry_id_companyid">Registry Company:</label>
            <select
              id="id_registry_id_companyid"
              name="id_registry_id_companyid"
              value={registryCompanyId}
              onChange={(e) => setRegistryCompanyId(e.target.value)}
            >
              <option value="">Select a Registry Company...</option>
              {registryCompanyOptions}
            </select>

            <label htmlFor="registry_id_premiseid">Registry Premise:</label>
            <select
              id="registry_id_premiseid"
              name="registry_id_premiseid"
              value={registryPremiseId}
              onChange={(e) => setRegistryPremiseId(e.target.value)}
            >
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
            <select
              id="id_stateid"
              name="id_stateid"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
            >
              <option value="">Select a state...</option>
              {stateOptions}
            </select>

            <label htmlFor="id_countyid">County:</label>
            <select
              id="id_countyid"
              name="id_countyid"
              value={countyId}
              onChange={(e) => setCountyId(e.target.value)}
            >
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
            <select
              id="id_idtypeid_primary"
              name="id_idtypeid_primary"
              value={primaryIdTypeId}
              onChange={(e) => setPrimaryIdTypeId(e.target.value)}
            >
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_secondary">Secondary ID Type:</label>
            <select
              id="id_idtypeid_secondary"
              name="id_idtypeid_secondary"
              value={secondaryIdTypeId}
              onChange={(e) => setSecondaryIdTypeId(e.target.value)}
            >
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_tertiary">Tertiary ID Type:</label>
            <select
              id="id_idtypeid_tertiary"
              name="id_idtypeid_tertiary"
              value={tertiaryIdTypeId}
              onChange={(e) => setTertiaryIdTypeId(e.target.value)}
            >
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
            <select
              id="id_eid_tag_male_color_female_color_same"
              name="id_eid_tag_male_color_female_color_same"
              value={eidTagMaleFemaleColorSame}
              onChange={(e) => setEidTagMaleFemaleColorSame(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="eid_tag_color_male">EID Tag Color Male:</label>
            <select
              id="eid_tag_color_male"
              name="eid_tag_color_male"
              value={eidTagColorMale}
              onChange={(e) => setEidTagColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_color_female">EID Tag Color Female:</label>
            <select
              id="eid_tag_color_female"
              name="eid_tag_color_female"
              value={eidTagColorFemale}
              onChange={(e) => setEidTagColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_location">EID Tag Location:</label>
            <select
              id="eid_tag_location"
              name="eid_tag_location"
              value={eidTagLocation}
              onChange={(e) => setEidTagLocation(e.target.value)}
            >
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
            <select
              id="id_farm_tag_male_color_female_color_same"
              name="id_farm_tag_male_color_female_color_same"
              value={farmTagMaleFemaleColorSame}
              onChange={(e) => setFarmTagMaleFemaleColorSame(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="farm_tag_color_male">Farm Tag Color Male Side:</label>
            <select
              id="farm_tag_color_male"
              name="farm_tag_color_male"
              value={farmTagColorMale}
              onChange={(e) => setFarmTagColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="farm_tag_color_female">Farm Tag Color Female Side:</label>
            <select
              id="farm_tag_color_female"
              name="farm_tag_color_female"
              value={farmTagColorFemale}
              onChange={(e) => setFarmTagColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="farm_tag_based_on_eid_tag">Farm Tag Based on EID Tag:</label>
            <select
              id="farm_tag_based_on_eid_tag"
              name="farm_tag_based_on_eid_tag"
              value={farmTagBasedOnEidTag}
              onChange={(e) => setFarmTagBasedOnEidTag(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="farm_tag_number_digits_from_eid">Farm Tag Number Digits from EID:</label>
            <input
              type="number"
              id="farm_tag_number_digits_from_eid"
              name="farm_tag_number_digits_from_eid"
              min="0"
              step="1"
              value={farmTagNumberDigitsFromEid}
              onChange={(e) => setFarmTagNumberDigitsFromEid(e.target.value)}
            />

            <label htmlFor="farm_tag_location">Farm Tag Location:</label>
            <select
              id="farm_tag_location"
              name="farm_tag_location"
              value={farmTagLocation}
              onChange={(e) => setFarmTagLocation(e.target.value)}
            >
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
            <select
              id="id_fed_tag_male_color_female_color_same"
              name="id_fed_tag_male_color_female_color_same"
              value={fedSameColor}
              onChange={(e) => setFedSameColor(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="fed_tag_color_male">Federal Tag Color Male Side:</label>
            <select
              id="fed_tag_color_male"
              name="fed_tag_color_male"
              value={fedColorMale}
              onChange={(e) => setFedColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_color_female">Federal Tag Color Female Side:</label>
            <select
              id="fed_tag_color_female"
              name="fed_tag_color_female"
              value={fedColorFemale}
              onChange={(e) => setFedColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_location">Federal Tag Location:</label>
            <select
              id="fed_tag_location"
              name="fed_tag_location"
              value={fedLocation}
              onChange={(e) => setFedLocation(e.target.value)}
            >
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
            <select
              id="id_nues_tag_male_color_female_color_same"
              name="id_nues_tag_male_color_female_color_same"
              value={nuesSameColor}
              onChange={(e) => setNuesSameColor(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="nues_tag_color_male">NUES Tag Color Male Side:</label>
            <select
              id="nues_tag_color_male"
              name="nues_tag_color_male"
              value={nuesColorMale}
              onChange={(e) => setNuesColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_color_female">NUES Tag Color Female Side:</label>
            <select
              id="nues_tag_color_female"
              name="nues_tag_color_female"
              value={nuesColorFemale}
              onChange={(e) => setNuesColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_location">NUES Tag Location:</label>
            <select
              id="nues_tag_location"
              name="nues_tag_location"
              value={nuesLocation}
              onChange={(e) => setNuesLocation(e.target.value)}
            >
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
            <select
              id="id_trich_tag_male_color_female_color_same"
              name="id_trich_tag_male_color_female_color_same"
              value={trichSameColor}
              onChange={(e) => setTrichSameColor(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="trich_tag_color_male">Trich Tag Color Male Side:</label>
            <select
              id="trich_tag_color_male"
              name="trich_tag_color_male"
              value={trichColorMale}
              onChange={(e) => setTrichColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_color_female">Trich Tag Color Female Side:</label>
            <select
              id="trich_tag_color_female"
              name="trich_tag_color_female"
              value={trichColorFemale}
              onChange={(e) => setTrichColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_location">Trich Tag Location:</label>
            <select
              id="trich_tag_location"
              name="trich_tag_location"
              value={trichLocation}
              onChange={(e) => setTrichLocation(e.target.value)}
            >
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>

            <label htmlFor="trich_tag_auto_increment">Trich Tag Auto Increment:</label>
            <select
              id="trich_tag_auto_increment"
              name="trich_tag_auto_increment"
              value={trichAutoIncrement}
              onChange={(e) => setTrichAutoIncrement(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="trich_tag_starting_value">Trich Tag Auto Increment Starting Value:</label>
            <input
              type="number"
              id="trich_tag_starting_value"
              name="trich_tag_starting_value"
              value={trichStartingValue}
              onChange={(e) => setTrichStartingValue(e.target.value)}
              min="0"
              step="1"
            />
          </div>

          <div className="section-break"></div>
          <h3>Bangs Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_bangs_tag_male_color_female_color_same">Bangs Male and Female Color Same:</label>
            <select
              id="id_bangs_tag_male_color_female_color_same"
              name="id_bangs_tag_male_color_female_color_same"
              value={bangsSameColor}
              onChange={(e) => setBangsSameColor(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="bangs_tag_color_male">Bangs Tag Color Male Side:</label>
            <select
              id="bangs_tag_color_male"
              name="bangs_tag_color_male"
              value={bangsColorMale}
              onChange={(e) => setBangsColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_color_female">Bangs Tag Color Female Side:</label>
            <select
              id="bangs_tag_color_female"
              name="bangs_tag_color_female"
              value={bangsColorFemale}
              onChange={(e) => setBangsColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_location">Bangs Tag Location:</label>
            <select
              id="bangs_tag_location"
              name="bangs_tag_location"
              value={bangsLocation}
              onChange={(e) => setBangsLocation(e.target.value)}
            >
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
            <select
              id="id_sale_order_tag_male_color_female_color_same"
              name="id_sale_order_tag_male_color_female_color_same"
              value={saleOrderSameColor}
              onChange={(e) => setSaleOrderSameColor(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="sale_order_tag_color_male">Sale Order Tag Color Male Side:</label>
            <select
              id="sale_order_tag_color_male"
              name="sale_order_tag_color_male"
              value={saleOrderColorMale}
              onChange={(e) => setSaleOrderColorMale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_color_female">Sale Order Tag Color Female Side:</label>
            <select
              id="sale_order_tag_color_female"
              name="sale_order_tag_color_female"
              value={saleOrderColorFemale}
              onChange={(e) => setSaleOrderColorFemale(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_location">Sale Order Tag Location:</label>
            <select
              id="sale_order_tag_location"
              name="sale_order_tag_location"
              value={saleOrderLocation}
              onChange={(e) => setSaleOrderLocation(e.target.value)}
            >
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
            <select
              id="use_paint_marks"
              name="use_paint_marks"
              value={usePaintMarks}
              onChange={(e) => setUsePaintMarks(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <label htmlFor="paint_mark_color">Paint Mark Color:</label>
            <select
              id="paint_mark_color"
              name="paint_mark_color"
              value={paintMarkColor}
              onChange={(e) => setPaintMarkColor(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="paint_mark_location">Paint Mark Tag Location:</label>
            <select
              id="paint_mark_location"
              name="paint_mark_location"
              value={paintMarkLocation}
              onChange={(e) => setPaintMarkLocation(e.target.value)}
            >
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="tattoo_color">Tattoo Color:</label>
            <select
              id="tattoo_color"
              name="tattoo_color"
              value={tattooColor}
              onChange={(e) => setTattooColor(e.target.value)}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="tattoo_location">Tattoo Location:</label>
            <select
              id="tattoo_location"
              name="tattoo_location"
              value={tattooLocation}
              onChange={(e) => setTattooLocation(e.target.value)}
            >
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>
          </div>

          <label htmlFor="freeze_brand_location">Freeze Brand Tag Location:</label>
          <select
            id="freeze_brand_location"
            name="freeze_brand_location"
            value={freezeBrandLocation}
            onChange={(e) => setFreezeBrandLocation(e.target.value)}
          >
            <option value="">Select a Tag Location...</option>
            {locationOptions}
          </select>

          <label htmlFor="id_idremovereasonid">ID Remove Reason:</label>
          <select
            id="id_idremovereasonid"
            name="id_idremovereasonid"
            value={idRemoveReason}
            onChange={(e) => setIdRemoveReason(e.target.value)}
          >
            <option value="">Select a Remove Reason...</option>
            {removeReasonOptions}
          </select>


          <div className="section-break"></div>
          <h3>Tissue Sample Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="id_tissuesampletypeid">Tissue Sample Type:</label>
            <select
              id="id_tissuesampletypeid"
              name="id_tissuesampletypeid"
              value={tissueSampleTypeId}
              onChange={(e) => setTissueSampleTypeId(e.target.value)}
            >
              <option value="">Select a Tissue Sample type...</option>
              {tissueSampleTypeOptions}
            </select>

            <label htmlFor="id_tissuetestid">Tissue Test:</label>
            <select
              id="id_tissuetestid"
              name="id_tissuetestid"
              value={tissueTestId}
              onChange={(e) => setTissueTestId(e.target.value)}
            >
              <option value="">Select a Tissue Test...</option>
              {tissueTestOptions}
            </select>

            <label htmlFor="id_tissuesamplecontainertypeid">Tissue Sample Container Type:</label>
            <select
              id="id_tissuesamplecontainertypeid"
              name="id_tissuesamplecontainertypeid"
              value={tissueSampleContainerTypeId}
              onChange={(e) => setTissueSampleContainerTypeId(e.target.value)}
            >
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

            <label htmlFor="id_breedid">Breed:</label>
            <select
              id="id_breedid"
              name="id_breedid"
              value={selectedBreedId}
              onChange={(e) => setSelectedBreedId(e.target.value)}
              disabled={!breeds.length}
            >
              <option value="">Select a breed...</option>
              {breedOptions}
            </select>
          </div>

          <label htmlFor="id_flockprefixid">Flock Prefix:</label>
          <select
            id="id_flockprefixid"
            name="id_flockprefixid"
            value={flockPrefixId}
            onChange={(e) => setFlockPrefixId(e.target.value)}
          >
            <option value="">Select a Flock Prefix...</option>
            {flockPrefixOptions}
          </select>

          <label htmlFor="id_sexid">Sex:</label>
          <select
            id="id_sexid"
            name="id_sexid"
            value={sexId}
            onChange={(e) => setSexId(e.target.value)}
          >
            <option value="">Select a Sex...</option>
            {sexOptions}
          </select>

          <label htmlFor="birth_type">Birth Type:</label>
          <select
            id="birth_type"
            name="birth_type"
            value={birthType}
            onChange={(e) => setBirthType(e.target.value)}
          >
            <option value="">Select a Birth Type...</option>
            {birthTypeOptions}
          </select>

          <label htmlFor="rear_type">Rear Type:</label>
          <select
            id="rear_type"
            name="rear_type"
            value={rearType}
            onChange={(e) => setRearType(e.target.value)}
          >
            <option value="">Select a Rear Type...</option>
            {birthTypeOptions}
          </select>

          <label htmlFor="minimum_birth_weight">Minimum Birth Weight:</label>
          <input
            type="number"
            id="minimum_birth_weight"
            name="minimum_birth_weight"
            min="0"
            step="0.1"
            value={minBirthWeight}
            onChange={(e) => setMinBirthWeight(parseFloat(e.target.value) || 0)}
          />

          <label htmlFor="maximum_birth_weight">Maximum Birth Weight:</label>
          <input
            type="number"
            id="maximum_birth_weight"
            name="maximum_birth_weight"
            min="0"
            step="0.1"
            value={maxBirthWeight}
            onChange={(e) => setMaxBirthWeight(parseFloat(e.target.value) || 0)}
          />


          <label htmlFor="birth_weight_id_unitsid">Birth Weight Units:</label>
          <select
            id="birth_weight_id_unitsid"
            name="birth_weight_id_unitsid"
            value={birthWeightUnitsId}
            onChange={(e) => setBirthWeightUnitsId(e.target.value)}
          >
            <option value="">Select a Birth Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="weight_id_unitsid">Weight Units:</label>
          <select
            id="weight_id_unitsid"
            name="weight_id_unitsid"
            value={weightUnitsId}
            onChange={(e) => setWeightUnitsId(e.target.value)}
          >
            <option value="">Select a Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="sale_price_id_unitsid">Sale Price Units:</label>
          <select
            id="sale_price_id_unitsid"
            name="sale_price_id_unitsid"
            value={salePriceUnitsId}
            onChange={(e) => setSalePriceUnitsId(e.target.value)}
          >
            <option value="">Select a Currency...</option>
            {currencyUnitOptions}
          </select>

          <label htmlFor="id_deathreasonid">Death Reason:</label>
          <select
            id="id_deathreasonid"
            name="id_deathreasonid"
            value={deathReasonId}
            onChange={(e) => setDeathReasonId(e.target.value)}
          >
            <option value="">Select a Death Reason...</option>
            {deathReasonOptions}
          </select>

          <label htmlFor="id_transferreasonid">Transfer Reason:</label>
          <select
            id="id_transferreasonid"
            name="id_transferreasonid"
            value={transferReasonId}
            onChange={(e) => setTransferReasonId(e.target.value)}
          >
            <option value="">Select a Transfer Reason...</option>
            {transferReasonOptions}
          </select>

          {/* Miscellaneous Section */}
          <div className="section-break"></div>
          <h3>Miscellaneous</h3>
          <hr />

          <label htmlFor="evaluation_update_alert">Evaluation Update Alert:</label>
          <select
            id="evaluation_update_alert"
            name="evaluation_update_alert"
            value={evaluationUpdateAlert}
            onChange={(e) => setEvaluationUpdateAlert(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

        </form>
      </div>
    </div>
  );
};

export default CreateDefaults;
