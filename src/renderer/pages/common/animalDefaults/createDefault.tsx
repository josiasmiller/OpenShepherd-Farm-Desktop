import { 
  BirthType,
  Breed,
  BreedRequest,
  Color, 
  Company,
  Contact, 
  County, 
  DeathReason, 
  DefaultSettingsResults, 
  FlockPrefix,
  OwnerType,
  Premise, 
  RemoveReason, 
  Sex, 
  Species, 
  State,
  TagLocation,
  TagType,
  TissueSampleContainerType,
  TissueSampleType,
  TissueTest,
  TransferReason,
  Unit,
  UnitRequest,
  NewDefaultSettingsParameters,
} from '@app/api';

import Swal from "sweetalert2";
import React, { useEffect, useMemo, useState } from "react";
import { handleResult } from '@common/core';
import { getCurrentFormattedTimestamp } from '@common/time';
import { BackButton } from "@components/buttons";
import {useNavigate} from "react-router-dom";

const CreateDefaults: React.FC = () => {

  const navigate = useNavigate();

  ////////////
  // STATES //
  ////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // define the arrays that are used when retrieving data from the DB
  const [contacts, setOwnerContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [registryCompanies, setRegistryCompanies] = useState<Company[]>([]);
  const [premises, setPremises] = useState<Premise[]>([]);
  const [removeReasons, setRemoveReasons] = useState<RemoveReason[]>([]);
  const [deathReasons, setDeathReasons] = useState<DeathReason[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [sexes, setSexes] = useState<Sex[]>([]);
  const [flockPrefixes, setFlockPrefixes] = useState<FlockPrefix[]>([]);
  const [tagLocations, setTagLocation] = useState<TagLocation[]>([]);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [tissueSampleContainerTypes, setTissueSampleContainerTypes] = useState<TissueSampleContainerType[]>([]);
  const [tissueSampleTypes, setTissueSampleTypes] = useState<TissueSampleType[]>([]);
  const [tissueTests, setTissueTests] = useState<TissueTest[]>([]);
  const [transferReasons, setTransferReasons] = useState<TransferReason[]>([]);
  const [birthTypes, setBirthTypes] = useState<BirthType[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [weightUnits, setWeightUnits] = useState<Unit[]>([]);
  const [currencyUnits, setCurrencyUnits] = useState<Unit[]>([]);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [existingDefaults, setExistingDefaults] = useState<DefaultSettingsResults[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<DefaultSettingsResults | null>(null);
  const [newDefaultName, setNewDefaultName] = useState<string>('');

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
  const [eidTagMaleFemaleColorSame, setEidTagMaleFemaleColorSame] = useState<number>(0);
  const [eidTagColorMale, setEidTagColorMale] = useState('');
  const [eidTagColorFemale, setEidTagColorFemale] = useState('');
  const [eidTagLocation, setEidTagLocation] = useState('');
  
  // Farm Tag
  const [farmTagMaleFemaleColorSame, setFarmTagMaleFemaleColorSame] = useState<number>(0);
  const [farmTagColorMale, setFarmTagColorMale] = useState('');
  const [farmTagColorFemale, setFarmTagColorFemale] = useState('');
  const [farmTagBasedOnEidTag, setFarmTagBasedOnEidTag] = useState('');
  const [farmTagNumberDigitsFromEid, setFarmTagNumberDigitsFromEid] = useState('');
  const [farmTagLocation, setFarmTagLocation] = useState('');
  
  // Federal Tags
  const [fedSameColor, setFedSameColor] = useState<number>(0);
  const [fedColorMale, setFedColorMale] = useState<string>('');
  const [fedColorFemale, setFedColorFemale] = useState<string>('');
  const [fedLocation, setFedLocation] = useState<string>('');

  // NUES Tags
  const [nuesSameColor, setNuesSameColor] = useState<number>(0);
  const [nuesColorMale, setNuesColorMale] = useState<string>('');
  const [nuesColorFemale, setNuesColorFemale] = useState<string>('');
  const [nuesLocation, setNuesLocation] = useState<string>('');

  // Trich Tags
  const [trichSameColor, setTrichSameColor] = useState<number>(0);
  const [trichColorMale, setTrichColorMale] = useState<string>('');
  const [trichColorFemale, setTrichColorFemale] = useState<string>('');
  const [trichLocation, setTrichLocation] = useState<string>('');
  const [trichAutoIncrement, setTrichAutoIncrement] = useState<string>('');
  const [trichStartingValue, setTrichStartingValue] = useState<string>('');

  // Bangs Tags
  const [bangsSameColor, setBangsSameColor] = useState<number>(0);
  const [bangsColorMale, setBangsColorMale] = useState<string>('');
  const [bangsColorFemale, setBangsColorFemale] = useState<string>('');
  const [bangsLocation, setBangsLocation] = useState<string>('');

  // Sale Order Tags
  const [saleOrderSameColor, setSaleOrderSameColor] = useState<number>(0);
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
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('');
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

  /////////////
  // ON LOAD //
  /////////////

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
        contactResult,
        standardCompanyResult,
        registryCompanyResult,
        premiseResult,
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
        window.defaultsAPI.getExisting(),
        window.lookupAPI.getContactInfo(),
        window.lookupAPI.getCompanyInfo(false),
        window.lookupAPI.getCompanyInfo(true),
        window.lookupAPI.getPremiseInfo(),
        window.lookupAPI.getRemoveReasons(),
        window.lookupAPI.getDeathReasons(),
        window.lookupAPI.getSpecies(),
        window.lookupAPI.getSexes(),
        window.lookupAPI.getLocations(),
        window.lookupAPI.getFlockPrefixes(),
        window.lookupAPI.getTagTypes(),
        window.lookupAPI.getTissueSampleContainerTypes(),
        window.lookupAPI.getTissueSampleTypes(),
        window.lookupAPI.getTissueTests(),
        window.lookupAPI.getTransferReasons(),
        window.lookupAPI.getBirthTypes(),
        window.lookupAPI.getColors(),
        window.lookupAPI.getUnits(weightReq),
        window.lookupAPI.getUnits(currencyReq),
      ]);

      handleResult(existingDefaultsResult, {
        success: (data : DefaultSettingsResults[]) => {
          setExistingDefaults(data);
        },
        error: (err) => {
          console.error("Failed to fetch existing defaults:", err);
        },
      });

      handleResult(contactResult, {
        success: (data : Contact[]) => {
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
        success: (data: TagLocation[]) => {
          setTagLocation(data);
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

  ///////////////////////
  // Memory Management //
  ///////////////////////

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

  const tagTypeOptions = useMemo(() => (
    tagTypes.map((tagType) => (
      <option key={tagType.id} value={tagType.id}>
        {tagType.name}
      </option>
    ))
  ), [tagTypes]);

  const locationOptions = useMemo(() => (
    tagLocations.map((location) => (
      <option key={location.id} value={location.id}>
        {location.name}
      </option>
    ))
  ), [tagLocations]);
  
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

  const booleanSelectOptions = (
    <>
      <option id="option-true" value="1">True</option>
      <option id="option-false" value="0">False</option>
    </>
  );

  const updateBreeds = async (speciesId : string) => {
    if (!speciesId) return; // no species selected yet

    try {
      const queryParams: BreedRequest = {
        species_id: speciesId,
      };

      const result = await window.lookupAPI.getBreeds(queryParams);

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

  const handleOwnerSelectionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerSelection(e.target.id === "select_contact" ? OwnerType.CONTACT : OwnerType.COMPANY);

    // Clear both ID fields regardless of the new selection
    setOwnerContactId('');
    setOwnerCompanyId('');
  };

  const handleBreederSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreederSelection(e.target.id === "breeder_select_contact" ? OwnerType.CONTACT : OwnerType.COMPANY);

    // Clear both ID fields regardless of the new selection
    setBreederContactId('');
    setBreederCompanyId('');
  };

  const handleTransferReasonSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransferReasonSelection(e.target.id === 'transfer_reason_select_contact' ? OwnerType.CONTACT : OwnerType.COMPANY);

    // Clear both ID fields regardless of the new selection
    setTransferReasonContactId('');
    setTransferReasonCompanyId('');
  };

  type FormParamResult =
  | { success: true; data: NewDefaultSettingsParameters }
  | { success: false; reason: string };

  const getDefaultParamsFromForm = (): FormParamResult => {

    if (selectedDefault === null) {
      return { success: false, reason: "NO_SELECTED_DEFAULT" };
    }

    const currentTimestamp: string = getCurrentFormattedTimestamp();


    // extract owner ID based on form
    var selectedOwnerId: string;
    if (ownerSelection == OwnerType.CONTACT) {
      selectedOwnerId = ownerContactId;
    } else if (ownerSelection == OwnerType.COMPANY) {
      selectedOwnerId = ownerCompanyId;
    } else {
      throw new TypeError("Invalid owner selection state");
    }

    // extract breeder ID based on form
    var selectedBreederId: string;
    if (breederSelection == OwnerType.CONTACT) {
      selectedBreederId = breederContactId;
    } else if (breederSelection == OwnerType.COMPANY) {
      selectedBreederId = breederCompanyId;
    } else {
      throw new TypeError("Invalid breeder selection state");
    }

    // extract transfer reason ID based on form
    var transferReasonOwnerId: string;
    if (transferReasonSelection == OwnerType.CONTACT) {
      transferReasonOwnerId = transferReasonContactId;
    } else if (transferReasonSelection == OwnerType.COMPANY) {
      transferReasonOwnerId = transferReasonCompanyId;
    } else {
      throw new TypeError("Invalid transfer reason selection state");
    }

    const formData: NewDefaultSettingsParameters = {
      id: selectedDefault!.id,
      default_settings_name: newDefaultName,
  
      contactType: ownerSelection,
      ownerId: selectedOwnerId,
      owner_id_premiseid: ownerPremiseId,
  
      breederId: selectedBreederId,
      breederType: breederSelection,
      breeder_id_premiseid: breederPremiseId,
  
      transferReasonContactId: transferReasonOwnerId,
      transferReasonContactType: transferReasonSelection,
  
      vet_id_contactid: vetContactId,
      vet_id_premiseid: vetPremiseId,
  
      lab_id_companyid: labCompanyId,
      lab_id_premiseid: labPremiseId,
  
      id_registry_id_companyid: registryCompanyId,
      registry_id_premiseid: registryPremiseId,
  
      id_stateid: stateId,
      id_countyid: countyId,
      id_flockprefixid: flockPrefixId,
      id_speciesid: selectedSpeciesId,
      id_breedid: selectedBreedId,
      id_sexid: sexId,
  
      id_idtypeid_primary: primaryIdTypeId,
      id_idtypeid_secondary: secondaryIdTypeId,
      id_idtypeid_tertiary: tertiaryIdTypeId,
  
      id_eid_tag_male_color_female_color_same: eidTagMaleFemaleColorSame,
      eid_tag_color_male: eidTagColorMale,
      eid_tag_color_female: eidTagColorFemale,
      eid_tag_location: eidTagLocation,
  
      id_farm_tag_male_color_female_color_same: farmTagMaleFemaleColorSame,
      farm_tag_based_on_eid_tag: farmTagBasedOnEidTag,
      farm_tag_number_digits_from_eid: farmTagNumberDigitsFromEid,
      farm_tag_color_male: farmTagColorMale,
      farm_tag_color_female: farmTagColorFemale,
      farm_tag_location: farmTagLocation,
  
      id_fed_tag_male_color_female_color_same: fedSameColor,
      fed_tag_color_male: fedColorMale,
      fed_tag_color_female: fedColorFemale,
      fed_tag_location: fedLocation,
  
      id_nues_tag_male_color_female_color_same: nuesSameColor,
      nues_tag_color_male: nuesColorMale,
      nues_tag_color_female: nuesColorFemale,
      nues_tag_location: nuesLocation,
  
      id_trich_tag_male_color_female_color_same: trichSameColor,
      trich_tag_color_male: trichColorMale,
      trich_tag_color_female: trichColorFemale,
      trich_tag_location: trichLocation,
      trich_tag_auto_increment: trichAutoIncrement,
  
      use_paint_marks: usePaintMarks,
      paint_mark_color: paintMarkColor,
      paint_mark_location: paintMarkLocation,
  
      tattoo_color: tattooColor,
      tattoo_location: tattooLocation,
  
      freeze_brand_location: freezeBrandLocation,
  
      id_idremovereasonid: idRemoveReason,
      id_tissuesampletypeid: tissueSampleTypeId,
      id_tissuetestid: tissueTestId,
      id_tissuesamplecontainertypeid: tissueSampleContainerTypeId,
  
      birth_type: birthType,
      rear_type: rearType,
  
      minimum_birth_weight: minBirthWeight,
      maximum_birth_weight: maxBirthWeight,
      birth_weight_id_unitsid: birthWeightUnitsId,
      weight_id_unitsid: weightUnitsId,
      sale_price_id_unitsid: salePriceUnitsId,
  
      evaluation_update_alert: evaluationUpdateAlert,
  
      id_bangs_tag_male_color_female_color_same: bangsSameColor,
      bangs_tag_color_male: bangsColorMale,
      bangs_tag_color_female: bangsColorFemale,
      bangs_tag_location: bangsLocation,
      id_sale_order_tag_male_color_female_color_same: saleOrderSameColor,
      sale_order_tag_color_male: saleOrderColorMale,
      sale_order_tag_color_female: saleOrderColorFemale,
      sale_order_tag_location: saleOrderLocation,
      id_deathreasonid: deathReasonId,
  
      id_transferreasonid: transferReasonId,
      created: currentTimestamp,
      modified: currentTimestamp,
  
      death_reason_id_contactid: "0",
      death_reason_id_companyid: "0",
      trich_tag_next_tag_number: "0",
    };

    return { success: true, data: formData };
  }

  const createNewDefault = async () => {

    if (!verifyForm()) {
      return;
    }

    const result: FormParamResult = getDefaultParamsFromForm();

    if (!result.success) {
      console.warn("Form not ready:", result);
      return;
    }

    const formData: NewDefaultSettingsParameters = result.data;
  
    try {
      const success: boolean = await window.defaultsAPI.writeNew(formData);

      if (success) {
        Swal.fire({
          title: "New Defaults Saved",
          text: `A new Default Setting has been created with the name \"${formData.default_settings_name}\"`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.message || "There was an error creating the default settings.",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  }

  const editDefault = async () => {

    if (!verifyForm()) {
      return;
    }

    const result: FormParamResult = getDefaultParamsFromForm();

    if (!result.success) {
      console.warn("Form not ready:", result);
      return;
    }

    const formData: NewDefaultSettingsParameters = result.data;
  
    const success: boolean = await window.defaultsAPI.editExisting(formData);
  
    if (success) {
      Swal.fire({
        title: "Existing Default Updated",
        text: `The default setting has successfully been updated`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "There was an error editing the default settings",
        icon: "error",
        confirmButtonText: "Continue",
      });
    }
  
    return;
  }

  const isFieldValid = (val : string): boolean => {
    return val != '' && val != undefined && val != "undefined"
  }

  const verifyForm = (): boolean => {

    // verify name is set
    if (!newDefaultName || newDefaultName == '') {
      Swal.fire({
        title: "Your animal default needs a name!",
        text: "Please provide a name for the animal default settings",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // verify a owner company or contact has been selected
    if (ownerSelection == OwnerType.COMPANY) {
      if (ownerCompanyId == '') {
        Swal.fire({
          title: "You must select a owner contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else if (ownerSelection == OwnerType.CONTACT) {

      if (ownerContactId == '') {
        Swal.fire({
          title: "You must select a owner contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else {
      throw new TypeError("Invalid ownerSelection:" + ownerSelection);
    }

    // verify a breeder company or contact has been selected
    if (breederSelection == OwnerType.COMPANY) {
      if (breederCompanyId == '') {
        Swal.fire({
          title: "You must select a breeder contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else if (breederSelection == OwnerType.CONTACT) {

      if (breederContactId == '') {
        Swal.fire({
          title: "You must select a breeder contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else {
      throw new TypeError("Invalid breederSelection:" + breederSelection);
    }

    // verify a transfer reason company or contact has been selected
    if (transferReasonSelection == OwnerType.COMPANY) {
      if (transferReasonCompanyId == '') {
        Swal.fire({
          title: "You must select a transfer reason contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else if (transferReasonSelection == OwnerType.CONTACT) {

      if (!isFieldValid(transferReasonContactId)) {
        Swal.fire({
          title: "You must select a transfer reason contact or company",
          text: "Please select one",
          icon: "info",
          confirmButtonText: "OK",
        });
        return false;
      }

    } else {
      throw new TypeError("Invalid transferReasonSelection:" + transferReasonSelection);
    }

    // Vet
    if (!isFieldValid(vetContactId)) {
      Swal.fire({
        title: "Missing Vet Contact",
        text: "Please select a vet contact ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(vetPremiseId)) {
      Swal.fire({
        title: "Missing Vet Premise",
        text: "Please select a vet premise ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Lab
    if (!isFieldValid(labCompanyId)) {
      Swal.fire({
        title: "Missing Lab Company",
        text: "Please select a lab company ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(labPremiseId)) {
      Swal.fire({
        title: "Missing Lab Premise",
        text: "Please select a lab premise ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Registry
    if (!isFieldValid(registryCompanyId)) {
      Swal.fire({
        title: "Missing Registry Company",
        text: "Please select a registry company ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(registryPremiseId)) {
      Swal.fire({
        title: "Missing Registry Premise",
        text: "Please select a registry premise ID.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // ID Types
    if (!isFieldValid(primaryIdTypeId)) {
      Swal.fire({
        title: "Missing Primary ID Type",
        text: "Please select a primary ID type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(secondaryIdTypeId)) {
      Swal.fire({
        title: "Missing Secondary ID Type",
        text: "Please select a secondary ID type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(tertiaryIdTypeId)) {
      Swal.fire({
        title: "Missing Tertiary ID Type",
        text: "Please select a tertiary ID type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // EID Tag
    if (!isFieldValid(eidTagColorMale)) {
      Swal.fire({
        title: "Missing EID Tag Male Color",
        text: "Please select a color for male EID tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(eidTagColorFemale)) {
      Swal.fire({
        title: "Missing EID Tag Female Color",
        text: "Please select a color for female EID tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(eidTagLocation)) {
      Swal.fire({
        title: "Missing EID Tag Location",
        text: "Please specify the EID tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Farm Tag
    if (!isFieldValid(farmTagColorMale)) {
      Swal.fire({
        title: "Missing Farm Tag Male Color",
        text: "Please select a color for male farm tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(farmTagColorFemale)) {
      Swal.fire({
        title: "Missing Farm Tag Female Color",
        text: "Please select a color for female farm tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!farmTagBasedOnEidTag) {
      Swal.fire({
        title: "Missing Farm Tag EID Link",
        text: "Please specify if the farm tag is based on the EID tag.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(farmTagNumberDigitsFromEid)) {
      Swal.fire({
        title: "Missing Farm Tag Digits",
        text: "Please enter the number of digits to use from the EID tag.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(farmTagLocation)) {
      Swal.fire({
        title: "Missing Farm Tag Location",
        text: "Please specify the farm tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Federal Tags
    if (!isFieldValid(fedColorMale)) {
      Swal.fire({
        title: "Missing Federal Tag Male Color",
        text: "Please select a color for male federal tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(fedColorFemale)) {
      Swal.fire({
        title: "Missing Federal Tag Female Color",
        text: "Please select a color for female federal tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(fedLocation)) {
      Swal.fire({
        title: "Missing Federal Tag Location",
        text: "Please specify the federal tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // NUES Tags
    if (!isFieldValid(nuesColorMale)) {
      Swal.fire({
        title: "Missing NUES Tag Male Color",
        text: "Please select a color for male NUES tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(nuesColorFemale)) {
      Swal.fire({
        title: "Missing NUES Tag Female Color",
        text: "Please select a color for female NUES tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(nuesLocation)) {
      Swal.fire({
        title: "Missing NUES Tag Location",
        text: "Please specify the NUES tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Trich Tags
    if (!isFieldValid(trichColorMale)) {
      Swal.fire({
        title: "Missing Trich Tag Male Color",
        text: "Please select a color for male Trich tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(trichColorFemale)) {
      Swal.fire({
        title: "Missing Trich Tag Female Color",
        text: "Please select a color for female Trich tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(trichLocation)) {
      Swal.fire({
        title: "Missing Trich Tag Location",
        text: "Please specify the Trich tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(trichAutoIncrement)) {
      Swal.fire({
        title: "Missing Trich Auto Increment",
        text: "Please enter the Trich tag auto-increment value.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(trichStartingValue)) {
      Swal.fire({
        title: "Missing Trich Starting Value",
        text: "Please enter the starting value for Trich tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Bangs Tags
    if (!isFieldValid(bangsColorMale)) {
      Swal.fire({
        title: "Missing Bangs Tag Male Color",
        text: "Please select a color for male Bangs tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(bangsColorFemale)) {
      Swal.fire({
        title: "Missing Bangs Tag Female Color",
        text: "Please select a color for female Bangs tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(bangsLocation)) {
      Swal.fire({
        title: "Missing Bangs Tag Location",
        text: "Please specify the Bangs tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Sale Order Tags
    if (!isFieldValid(saleOrderColorMale)) {
      Swal.fire({
        title: "Missing Sale Order Tag Male Color",
        text: "Please select a color for male Sale Order tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(saleOrderColorFemale)) {
      Swal.fire({
        title: "Missing Sale Order Tag Female Color",
        text: "Please select a color for female Sale Order tags.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(saleOrderLocation)) {
      Swal.fire({
        title: "Missing Sale Order Tag Location",
        text: "Please specify the Sale Order tag location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Paint Mark
    if (!isFieldValid(usePaintMarks)) {
      Swal.fire({
        title: "Missing Paint Mark Usage",
        text: "Please indicate whether paint marks are used.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(paintMarkColor)) {
      Swal.fire({
        title: "Missing Paint Mark Color",
        text: "Please select a paint mark color.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(paintMarkLocation)) {
      Swal.fire({
        title: "Missing Paint Mark Location",
        text: "Please specify the paint mark location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Tattoo / Freeze Brand / ID Removal
    if (!isFieldValid(tattooColor)) {
      Swal.fire({
        title: "Missing Tattoo Color",
        text: "Please select a tattoo color.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(tattooLocation)) {
      Swal.fire({
        title: "Missing Tattoo Location",
        text: "Please specify the tattoo location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(freezeBrandLocation)) {
      Swal.fire({
        title: "Missing Freeze Brand Location",
        text: "Please specify the freeze brand location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(idRemoveReason)) {
      Swal.fire({
        title: "Missing ID Remove Reason",
        text: "Please provide a reason for ID removal.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Tissue Sample
    if (!isFieldValid(tissueSampleTypeId)) {
      Swal.fire({
        title: "Missing Tissue Sample Type",
        text: "Please select a tissue sample type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(tissueTestId)) {
      Swal.fire({
        title: "Missing Tissue Test",
        text: "Please select a tissue test.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(tissueSampleContainerTypeId)) {
      Swal.fire({
        title: "Missing Sample Container Type",
        text: "Please select a tissue sample container type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    // Animal Info
    if (!isFieldValid(selectedSpeciesId)) {
      Swal.fire({
        title: "Missing Species",
        text: "Please select a species.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(selectedBreedId)) {
      Swal.fire({
        title: "Missing Breed",
        text: "Please select a breed.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(flockPrefixId)) {
      Swal.fire({
        title: "Missing Flock Prefix",
        text: "Please select a flock prefix.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(sexId)) {
      Swal.fire({
        title: "Missing Sex",
        text: "Please select the sex of the animal.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(birthType)) {
      Swal.fire({
        title: "Missing Birth Type",
        text: "Please select the birth type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(rearType)) {
      Swal.fire({
        title: "Missing Rear Type",
        text: "Please select the rear type.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (minBirthWeight <= 0) {
      Swal.fire({
        title: "Invalid Minimum Birth Weight",
        text: "Minimum birth weight must be greater than 0.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (maxBirthWeight <= 0) {
      Swal.fire({
        title: "Invalid Maximum Birth Weight",
        text: "Maximum birth weight must be greater than 0.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(birthWeightUnitsId)) {
      Swal.fire({
        title: "Missing Birth Weight Units",
        text: "Please select birth weight units.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(weightUnitsId)) {
      Swal.fire({
        title: "Missing Weight Units",
        text: "Please select weight units.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(salePriceUnitsId)) {
      Swal.fire({
        title: "Missing Sale Price Units",
        text: "Please select sale price units.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(deathReasonId)) {
      Swal.fire({
        title: "Missing Death Reason",
        text: "Please select a reason for death.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(transferReasonId)) {
      Swal.fire({
        title: "Missing Transfer Reason",
        text: "Please select a reason for animal transfer.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (!isFieldValid(evaluationUpdateAlert)) {
      Swal.fire({
        title: "Missing Evaluation Update Alert",
        text: "Please provide an evaluation update alert message.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  }

  const loadDefaultSettings = (defaultSetting: DefaultSettingsResults) => {

    setNewDefaultName(defaultSetting.name || '');

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
      setTransferReasonContactId(defaultSetting.transferReasonContactId || '');
      setTransferReasonCompanyId("");
    } else if (defaultSetting.transferReasonContactType === OwnerType.COMPANY) {
      setTransferReasonCompanyId(defaultSetting.transferReasonContactId || '');
      setTransferReasonContactId("");
    }

    setVetContactId(defaultSetting.vet_id_contactid || '');
    setVetPremiseId(defaultSetting.vet_id_premiseid || '');

    setLabCompanyId(defaultSetting.lab_id_companyid || '');
    setLabPremiseId(defaultSetting.lab_id_premiseid || '');
    setRegistryCompanyId(defaultSetting.id_registry_id_companyid || '');
    setRegistryPremiseId(defaultSetting.registry_id_premiseid || '');
    setStateId(defaultSetting.id_stateid || '');
    setCountyId(defaultSetting.id_countyid || '');
    setPrimaryIdTypeId(defaultSetting.id_idtypeid_primary || '');
    setSecondaryIdTypeId(defaultSetting.id_idtypeid_secondary || '');
    setTertiaryIdTypeId(defaultSetting.id_idtypeid_tertiary || '');

    setEidTagMaleFemaleColorSame(defaultSetting.id_eid_tag_male_color_female_color_same);
    setEidTagColorMale(defaultSetting.eid_tag_color_male || '');
    setEidTagColorFemale(defaultSetting.eid_tag_color_female || '');
    setEidTagLocation(defaultSetting.eid_tag_location || '');

    setFarmTagMaleFemaleColorSame(defaultSetting.id_farm_tag_male_color_female_color_same);
    setFarmTagColorMale(defaultSetting.farm_tag_color_male || '');
    setFarmTagColorFemale(defaultSetting.farm_tag_color_female || '');
    setFarmTagBasedOnEidTag(defaultSetting.farm_tag_based_on_eid_tag || '');
    setFarmTagNumberDigitsFromEid(defaultSetting.farm_tag_number_digits_from_eid || '');
    setFarmTagLocation(defaultSetting.farm_tag_location || '');

    // Federal Tags
    setFedSameColor(defaultSetting.id_fed_tag_male_color_female_color_same);
    setFedColorMale(defaultSetting.fed_tag_color_male || '');
    setFedColorFemale(defaultSetting.fed_tag_color_female || '');
    setFedLocation(defaultSetting.fed_tag_location || '');
  
    // NUES Tags
    setNuesSameColor(defaultSetting.id_nues_tag_male_color_female_color_same);
    setNuesColorMale(defaultSetting.nues_tag_color_male || '');
    setNuesColorFemale(defaultSetting.nues_tag_color_female || '');
    setNuesLocation(defaultSetting.nues_tag_location || '');
  
    // Trich Tags
    setTrichSameColor(defaultSetting.id_trich_tag_male_color_female_color_same);
    setTrichColorMale(defaultSetting.trich_tag_color_male || '');
    setTrichColorFemale(defaultSetting.trich_tag_color_female || '');
    setTrichLocation(defaultSetting.trich_tag_location || '');
    setTrichAutoIncrement(defaultSetting.trich_tag_auto_increment || '');
    setTrichStartingValue(defaultSetting.trich_tag_next_tag_number || '');

    // Bangs Tag
    setBangsSameColor(defaultSetting.id_bangs_tag_male_color_female_color_same);
    setBangsColorMale(defaultSetting.bangs_tag_color_male || '');
    setBangsColorFemale(defaultSetting.bangs_tag_color_female || '');
    setBangsLocation(defaultSetting.bangs_tag_location || '');

    // Sale Order Tag
    setSaleOrderSameColor(defaultSetting.id_sale_order_tag_male_color_female_color_same);
    setSaleOrderColorMale(defaultSetting.sale_order_tag_color_male || '');
    setSaleOrderColorFemale(defaultSetting.sale_order_tag_color_female || '');
    setSaleOrderLocation(defaultSetting.sale_order_tag_location || '');

    // Misc
    setUsePaintMarks(defaultSetting.use_paint_marks);
    setPaintMarkColor(defaultSetting.paint_mark_color || '');
    setPaintMarkLocation(defaultSetting.paint_mark_location || '');
    setTattooColor(defaultSetting.tattoo_color || '');
    setTattooLocation(defaultSetting.tattoo_location || '');
    setFreezeBrandLocation(defaultSetting.freeze_brand_location || '');
    setIdRemoveReason(defaultSetting.id_idremovereasonid || '');
    
    setTissueSampleTypeId(defaultSetting.id_tissuesampletypeid || '');
    setTissueTestId(defaultSetting.id_tissuetestid || '');
    setTissueSampleContainerTypeId(defaultSetting.id_tissuesamplecontainertypeid || '');
  
    setSelectedSpeciesId(defaultSetting.id_speciesid || '');
    setSelectedBreedId(defaultSetting.id_breedid || '');
    setFlockPrefixId(defaultSetting.id_flockprefixid || '');
    setSexId(defaultSetting.id_sexid || '');
    setBirthType(defaultSetting.birth_type || '');
    setRearType(defaultSetting.rear_type || '');
    setMinBirthWeight(defaultSetting.minimum_birth_weight);
    setMaxBirthWeight(defaultSetting.maximum_birth_weight);
    setBirthWeightUnitsId(defaultSetting.birth_weight_id_unitsid || '');
    setWeightUnitsId(defaultSetting.weight_id_unitsid || '');
    setSalePriceUnitsId(defaultSetting.sale_price_id_unitsid || '');
    setDeathReasonId(defaultSetting.id_deathreasonid || '');
    setTransferReasonId(defaultSetting.id_transferreasonid || '');
    setEvaluationUpdateAlert(defaultSetting.evaluation_update_alert || '');
  };

  return (
    <div className="container">

      {/* Top Section */}
      <div className="create-defaults-top-section">

        <BackButton onClick={() => navigate(-1)} />

        <h2>Default Settings</h2>
        <div className="button-group">
          <button
            id="create-default-btn" 
            className="forward-button"
            onClick={createNewDefault}
          >
            Create New Default
          </button>

          <button
            id="edit-default-btn" 
            className="forward-button"
            onClick={editDefault}
          >
            Edit Existing Default
          </button>
        </div>
      </div>


      {/* Bottom Section */}
      <div className="create-defaults-bottom-section">
        <form id="defaults-form">

          {/* Existing Setting Selection */}
          <div className="existing-setting-container">
            <label htmlFor="existing-settings">Existing Setting:</label>
            <select
              id="existing-settings"
              name="existing-settings"
              value={selectedDefault?.id.toString() || ""} // default to "" if null
              onChange={(e) => {
                const selectedId = e.target.value;
                const found = existingDefaults.find((def) => def.id == selectedId) || null;
                setSelectedDefault(found);

                if (found) {
                  loadDefaultSettings(found);
                }
              }}
            >
              <option value="">Select an Existing Default...</option>
              {existingDefaults.map((existingdef) => (
                <option key={existingdef.id} value={existingdef.id}>
                  {existingdef.name}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="settings_name">Settings Name:</label>
          <input 
            type="text" 
            id="settings_name" 
            name="settings_name"
            value={newDefaultName}
            onChange={(e) => setNewDefaultName(e.target.value || '')}
          />

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
              onChange={(e) => setOwnerContactId(e.target.value || '')}
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
              onChange={(e) => setOwnerCompanyId(e.target.value || '')}
            >
              <option value="">Select a company...</option>
              {companyOptions}
            </select>

            <label htmlFor="owner_id_premiseid">Owner Premise:</label>
            <select
              id="owner_id_premiseid"
              name="owner_id_premiseid"
              value={ownerPremiseId}
              onChange={(e) => setOwnerPremiseId(e.target.value || '')}
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
              onChange={(e) => setBreederContactId(e.target.value || '')}
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
              onChange={(e) => setBreederCompanyId(e.target.value || '')}
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
              onChange={(e) => setBreederPremiseId(e.target.value || '')}
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
              onChange={(e) => setTransferReasonContactId(e.target.value || '')}
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
              onChange={(e) => setTransferReasonCompanyId(e.target.value || '')}
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
              onChange={(e) => setVetContactId(e.target.value || '')}
            >
              <option value="">Select a vet contact...</option>
              {contactOptions}
            </select>

            <label htmlFor="vet_id_premiseid">Vet Premise:</label>
            <select
              id="vet_id_premiseid"
              name="vet_id_premiseid"
              value={vetPremiseId}
              onChange={(e) => setVetPremiseId(e.target.value || '')}
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
              onChange={(e) => setLabCompanyId(e.target.value || '')}
            >
              <option value="">Select a lab company...</option>
              {companyOptions}
            </select>

            <label htmlFor="lab_id_premiseid">Lab Premise:</label>
            <select
              id="lab_id_premiseid"
              name="lab_id_premiseid"
              value={labPremiseId}
              onChange={(e) => setLabPremiseId(e.target.value || '')}
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
              onChange={(e) => setRegistryCompanyId(e.target.value || '')}
            >
              <option value="">Select a Registry Company...</option>
              {registryCompanyOptions}
            </select>

            <label htmlFor="registry_id_premiseid">Registry Premise:</label>
            <select
              id="registry_id_premiseid"
              name="registry_id_premiseid"
              value={registryPremiseId}
              onChange={(e) => setRegistryPremiseId(e.target.value || '')}
            >
              <option value="">Select a premise...</option>
              {premiseOptions}
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
              onChange={(e) => setPrimaryIdTypeId(e.target.value || '')}
            >
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_secondary">Secondary ID Type:</label>
            <select
              id="id_idtypeid_secondary"
              name="id_idtypeid_secondary"
              value={secondaryIdTypeId}
              onChange={(e) => setSecondaryIdTypeId(e.target.value || '')}
            >
              <option value="">Select a tag type...</option>
              {tagTypeOptions}
            </select>

            <label htmlFor="id_idtypeid_tertiary">Tertiary ID Type:</label>
            <select
              id="id_idtypeid_tertiary"
              name="id_idtypeid_tertiary"
              value={tertiaryIdTypeId}
              onChange={(e) => setTertiaryIdTypeId(e.target.value || '')}
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
              onChange={(e) => setEidTagMaleFemaleColorSame(Number(e.target.value))}

            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="eid_tag_color_male">EID Tag Color Male:</label>
            <select
              id="eid_tag_color_male"
              name="eid_tag_color_male"
              value={eidTagColorMale}
              onChange={(e) => setEidTagColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_color_female">EID Tag Color Female:</label>
            <select
              id="eid_tag_color_female"
              name="eid_tag_color_female"
              value={eidTagColorFemale}
              onChange={(e) => setEidTagColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="eid_tag_location">EID Tag Location:</label>
            <select
              id="eid_tag_location"
              name="eid_tag_location"
              value={eidTagLocation}
              onChange={(e) => setEidTagLocation(e.target.value || '')}
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
              onChange={(e) => setFarmTagMaleFemaleColorSame(Number(e.target.value))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="farm_tag_color_male">Farm Tag Color Male Side:</label>
            <select
              id="farm_tag_color_male"
              name="farm_tag_color_male"
              value={farmTagColorMale}
              onChange={(e) => setFarmTagColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="farm_tag_color_female">Farm Tag Color Female Side:</label>
            <select
              id="farm_tag_color_female"
              name="farm_tag_color_female"
              value={farmTagColorFemale}
              onChange={(e) => setFarmTagColorFemale(e.target.value || '')}
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
              onChange={(e) => setFarmTagBasedOnEidTag(e.target.value || '')}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="farm_tag_number_digits_from_eid">Farm Tag Number Digits from EID:</label>
            <input
              type="number"
              id="farm_tag_number_digits_from_eid"
              name="farm_tag_number_digits_from_eid"
              min="0"
              step="1"
              value={farmTagNumberDigitsFromEid}
              onChange={(e) => setFarmTagNumberDigitsFromEid(e.target.value || '')}
            />

            <label htmlFor="farm_tag_location">Farm Tag Location:</label>
            <select
              id="farm_tag_location"
              name="farm_tag_location"
              value={farmTagLocation}
              onChange={(e) => setFarmTagLocation(e.target.value || '')}
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
              onChange={(e) => setFedSameColor(Number(e.target.value))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="fed_tag_color_male">Federal Tag Color Male Side:</label>
            <select
              id="fed_tag_color_male"
              name="fed_tag_color_male"
              value={fedColorMale}
              onChange={(e) => setFedColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_color_female">Federal Tag Color Female Side:</label>
            <select
              id="fed_tag_color_female"
              name="fed_tag_color_female"
              value={fedColorFemale}
              onChange={(e) => setFedColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="fed_tag_location">Federal Tag Location:</label>
            <select
              id="fed_tag_location"
              name="fed_tag_location"
              value={fedLocation}
              onChange={(e) => setFedLocation(e.target.value || '')}
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
              onChange={(e) => setNuesSameColor(Number(e.target.value))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="nues_tag_color_male">NUES Tag Color Male Side:</label>
            <select
              id="nues_tag_color_male"
              name="nues_tag_color_male"
              value={nuesColorMale}
              onChange={(e) => setNuesColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_color_female">NUES Tag Color Female Side:</label>
            <select
              id="nues_tag_color_female"
              name="nues_tag_color_female"
              value={nuesColorFemale}
              onChange={(e) => setNuesColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="nues_tag_location">NUES Tag Location:</label>
            <select
              id="nues_tag_location"
              name="nues_tag_location"
              value={nuesLocation}
              onChange={(e) => setNuesLocation(e.target.value || '')}
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
              onChange={(e) => setTrichSameColor(Number(e.target.value))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="trich_tag_color_male">Trich Tag Color Male Side:</label>
            <select
              id="trich_tag_color_male"
              name="trich_tag_color_male"
              value={trichColorMale}
              onChange={(e) => setTrichColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_color_female">Trich Tag Color Female Side:</label>
            <select
              id="trich_tag_color_female"
              name="trich_tag_color_female"
              value={trichColorFemale}
              onChange={(e) => setTrichColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="trich_tag_location">Trich Tag Location:</label>
            <select
              id="trich_tag_location"
              name="trich_tag_location"
              value={trichLocation}
              onChange={(e) => setTrichLocation(e.target.value || '')}
            >
              <option value="">Select a Tag Location...</option>
              {locationOptions}
            </select>

            <label htmlFor="trich_tag_auto_increment">Trich Tag Auto Increment:</label>
            <select
              id="trich_tag_auto_increment"
              name="trich_tag_auto_increment"
              value={trichAutoIncrement}
              onChange={(e) => setTrichAutoIncrement(e.target.value || '')}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="trich_tag_starting_value">Trich Tag Auto Increment Starting Value:</label>
            <input
              type="number"
              id="trich_tag_starting_value"
              name="trich_tag_starting_value"
              value={trichStartingValue}
              onChange={(e) => setTrichStartingValue(e.target.value || '')}
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
              onChange={(e) => setBangsSameColor(Number(e.target.value))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="bangs_tag_color_male">Bangs Tag Color Male Side:</label>
            <select
              id="bangs_tag_color_male"
              name="bangs_tag_color_male"
              value={bangsColorMale}
              onChange={(e) => setBangsColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_color_female">Bangs Tag Color Female Side:</label>
            <select
              id="bangs_tag_color_female"
              name="bangs_tag_color_female"
              value={bangsColorFemale}
              onChange={(e) => setBangsColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="bangs_tag_location">Bangs Tag Location:</label>
            <select
              id="bangs_tag_location"
              name="bangs_tag_location"
              value={bangsLocation}
              onChange={(e) => setBangsLocation(e.target.value || '')}
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
              onChange={(e) => setSaleOrderSameColor(Number(e.target.value || ''))}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="sale_order_tag_color_male">Sale Order Tag Color Male Side:</label>
            <select
              id="sale_order_tag_color_male"
              name="sale_order_tag_color_male"
              value={saleOrderColorMale}
              onChange={(e) => setSaleOrderColorMale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_color_female">Sale Order Tag Color Female Side:</label>
            <select
              id="sale_order_tag_color_female"
              name="sale_order_tag_color_female"
              value={saleOrderColorFemale}
              onChange={(e) => setSaleOrderColorFemale(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="sale_order_tag_location">Sale Order Tag Location:</label>
            <select
              id="sale_order_tag_location"
              name="sale_order_tag_location"
              value={saleOrderLocation}
              onChange={(e) => setSaleOrderLocation(e.target.value || '')}
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
              onChange={(e) => setUsePaintMarks(e.target.value || '')}
            >
              <option value="">Select...</option>
              {booleanSelectOptions}
            </select>

            <label htmlFor="paint_mark_color">Paint Mark Color:</label>
            <select
              id="paint_mark_color"
              name="paint_mark_color"
              value={paintMarkColor}
              onChange={(e) => setPaintMarkColor(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="paint_mark_location">Paint Mark Tag Location:</label>
            <select
              id="paint_mark_location"
              name="paint_mark_location"
              value={paintMarkLocation}
              onChange={(e) => setPaintMarkLocation(e.target.value || '')}
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
              onChange={(e) => setTattooColor(e.target.value || '')}
            >
              <option value="">Select a color...</option>
              {colorOptions}
            </select>

            <label htmlFor="tattoo_location">Tattoo Location:</label>
            <select
              id="tattoo_location"
              name="tattoo_location"
              value={tattooLocation}
              onChange={(e) => setTattooLocation(e.target.value || '')}
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
            onChange={(e) => setFreezeBrandLocation(e.target.value || '')}
          >
            <option value="">Select a Tag Location...</option>
            {locationOptions}
          </select>

          <label htmlFor="id_idremovereasonid">ID Remove Reason:</label>
          <select
            id="id_idremovereasonid"
            name="id_idremovereasonid"
            value={idRemoveReason}
            onChange={(e) => setIdRemoveReason(e.target.value || '')}
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
              onChange={(e) => setTissueSampleTypeId(e.target.value || '')}
            >
              <option value="">Select a Tissue Sample type...</option>
              {tissueSampleTypeOptions}
            </select>

            <label htmlFor="id_tissuetestid">Tissue Test:</label>
            <select
              id="id_tissuetestid"
              name="id_tissuetestid"
              value={tissueTestId}
              onChange={(e) => setTissueTestId(e.target.value || '')}
            >
              <option value="">Select a Tissue Test...</option>
              {tissueTestOptions}
            </select>

            <label htmlFor="id_tissuesamplecontainertypeid">Tissue Sample Container Type:</label>
            <select
              id="id_tissuesamplecontainertypeid"
              name="id_tissuesamplecontainertypeid"
              value={tissueSampleContainerTypeId}
              onChange={(e) => setTissueSampleContainerTypeId(e.target.value || '')}
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
                setSelectedSpeciesId(id  || '');
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
              onChange={(e) => setSelectedBreedId(e.target.value || '')}
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
            onChange={(e) => setFlockPrefixId(e.target.value || '')}
          >
            <option value="">Select a Flock Prefix...</option>
            {flockPrefixOptions}
          </select>

          <label htmlFor="id_sexid">Sex:</label>
          <select
            id="id_sexid"
            name="id_sexid"
            value={sexId}
            onChange={(e) => setSexId(e.target.value || '')}
          >
            <option value="">Select a Sex...</option>
            {sexOptions}
          </select>

          <label htmlFor="birth_type">Birth Type:</label>
          <select
            id="birth_type"
            name="birth_type"
            value={birthType}
            onChange={(e) => setBirthType(e.target.value || '')}
          >
            <option value="">Select a Birth Type...</option>
            {birthTypeOptions}
          </select>

          <label htmlFor="rear_type">Rear Type:</label>
          <select
            id="rear_type"
            name="rear_type"
            value={rearType}
            onChange={(e) => setRearType(e.target.value || '')}
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
            onChange={(e) => setBirthWeightUnitsId(e.target.value || '')}
          >
            <option value="">Select a Birth Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="weight_id_unitsid">Weight Units:</label>
          <select
            id="weight_id_unitsid"
            name="weight_id_unitsid"
            value={weightUnitsId}
            onChange={(e) => setWeightUnitsId(e.target.value || '')}
          >
            <option value="">Select a Weight Unit...</option>
            {weightUnitOptions}
          </select>

          <label htmlFor="sale_price_id_unitsid">Sale Price Units:</label>
          <select
            id="sale_price_id_unitsid"
            name="sale_price_id_unitsid"
            value={salePriceUnitsId}
            onChange={(e) => setSalePriceUnitsId(e.target.value || '')}
          >
            <option value="">Select a Currency...</option>
            {currencyUnitOptions}
          </select>

          <label htmlFor="id_deathreasonid">Death Reason:</label>
          <select
            id="id_deathreasonid"
            name="id_deathreasonid"
            value={deathReasonId}
            onChange={(e) => setDeathReasonId(e.target.value || '')}
          >
            <option value="">Select a Death Reason...</option>
            {deathReasonOptions}
          </select>

          <label htmlFor="id_transferreasonid">Transfer Reason:</label>
          <select
            id="id_transferreasonid"
            name="id_transferreasonid"
            value={transferReasonId}
            onChange={(e) => setTransferReasonId(e.target.value || '')}
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
            onChange={(e) => setEvaluationUpdateAlert(e.target.value || '')}
          >
            <option value="">Select...</option>
            {booleanSelectOptions}
          </select>

        </form>
      </div>
    </div>
  );
};

export default CreateDefaults;
